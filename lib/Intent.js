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
        this.promise = new Promise(function(resolve, reject) {
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
    }
    then() {
        return this.promise.then.apply(this.promise, arguments);
    }
}