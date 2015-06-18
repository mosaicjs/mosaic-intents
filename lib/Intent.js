import Promise from 'promise';
import { EventEmitter } from 'events';

export default class Intent extends EventEmitter {
    constructor(params, key){
        super();
        this.params = params;
        if (key) {
            this.key = key;
        }
        this.handled = false;
        this._after = [];
        this._innerPromise = new Promise(function(resolve, reject) {
            this.resolve = function(result){ 
                this.handled = true;
                resolve(result);
                return this;
            };
            this.reject = function(err) {
                this.handled = true;
                reject(err);
                return this;
            };
        }.bind(this));
        this.promise = this._innerPromise.then(function(res){
            if (this._after.length){
                return Promise.all(this._after).then(function(){
                    return res;
                }, function(err) {
                    throw err;
                });
            }
            return res;
        }.bind(this));
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