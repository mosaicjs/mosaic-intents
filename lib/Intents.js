import { EventEmitter } from 'events';
import Intent from './Intent';

function Intents(obj){
    obj = obj || this;
    EventEmitter.apply(obj);
}
extend(Intents.prototype, {
    intent(key, params) {
        let intent = this._newIntent(key, params);
        return this.fireIntent(key, intent);
    },
    action(key, params, action) {
        if (action === undefined) {
            action = params; 
            params = undefined;
        }
        let intent = this._newIntent(key, params);
        return this.runAction(key, intent, action);
    },
    fireIntent(key, intent){
        try {
            this.emit(key, intent);
        } catch (err) {
            intent.reject(err);
        }
        return intent;
    },
    runAction(key, intent, action) {
        try {
            let that = this;
            intent = that.fireIntent(key, intent);
            if (!intent.handled){
                Promise.resolve().then(function(){
                    let result = action.call(that, intent);
                    if (result !== undefined && !intent.handled) {
                        intent.resolve(result);
                    }
                }).then(null, function(err){
                    intent.reject(err);
                });
            }
        } catch (err) {
            intent.reject(err);
        }
        return intent;
    },
    _newIntent(key, params) {
        return new Intent(params, key);
    }
}, EventEmitter.prototype);

Intents.addTo = function(Type){
    extend(Type.prototype, Intents.prototype);
}

function extend(to) {
    for (let i = 1; i < arguments.length; i++) {
        var from = arguments[i];
        for (let key in from){
            if (!to[key] && Object.prototype.hasOwnProperty.call(from, key)){
                to[key] = from[key];
            }
        }
    }
}

export default Intents;
