import Promise from 'promise';

export default class Intent {
    constructor(params, key){
        this._params = params;
        if (key) {
            this.key = key;
        }
        this._promise = new Promise(function(resolve, reject) {
            this._resolve = resolve;
            this._reject = reject;
        }.bind(this));
        this._handled = false;
    }
    then() {
        return this.promise.then.apply(this.promise, arguments);
    }
    get params(){
        return this._params;
    }
    get handled(){
        return this._handled;
    }
    get promise(){
        return this._promise;
    }
    resolve(result){
        this._handled = true;
        this._resolve(result);
        return this;
    }
    reject(err){
        this._handled = true;
        this._reject(err);
        return this;
    }
}