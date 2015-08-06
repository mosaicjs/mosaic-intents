import Promise from 'promise';
import { EventEmitter } from 'events';

export default class Intent extends EventEmitter {
    constructor(params, key){
        super();
        let that = this;
        that.params = params;
        if (key) {
            that.key = key;
        }
        that.handled = false;
        that._after = [];
        that._innerPromise = new Promise(function(resolve, reject) {
            that.resolve = function(result){ 
                that.handled = true;
                resolve(result);
                return that;
            };
            that.reject = function(err) {
                that.handled = true;
                reject(err);
                return that;
            };
        });
        that.promise = that._innerPromise.then(function(res){
            if (that._after.length){
                return Promise.all(that._after).then(function(){
                    return res;
                }, function(err) {
                    throw err;
                });
            }
            return res;
        });
        that.finalize = that['finally'] = function(method){
            return that.then(function(result){
                try { method(null, result); } catch(e) {}
                return result;
            },
            function(err){
                try { method(err); } catch(e) {}
                throw err;
            });
        }
    }
    then(onResolve, onReject) {
        return this.promise.then(onResolve, onReject);
    }
    /**
     * The specified action will be executed just after the main promise is
     * resolved.
     */
    after(onResolve, onReject){
        let res = this._innerPromise.then(onResolve, onReject);
        this._after.push(res);
        return res;
    }
}