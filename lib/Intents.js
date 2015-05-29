import { EventEmitter } from 'events';
import Intent from './Intent';

function Intents(obj){
    obj = obj || this;
    EventEmitter.apply(obj);
}
extend(Intents.prototype, {
    intent(key, params) {
        let intent = this._newIntent(key, params);
        try {
            this.emit(key, intent);
        } catch (err) {
            intent.reject(err);
        }
        return intent;
    },
    action(key, params, action) {
        if (action === undefined) {
            action = params; 
            params = undefined;
        }
        let intent = this.intent(key, params);
        try {
            let result = action.call(this, intent);
            if (result !== undefined && !intent.handled) {
                intent.resolve(result);
            }
        } catch (err) {
            intent.reject(err);
        }
        return intent;
    },
    _newIntent(key, params) {
        let intent = new Intent(params);
        intent.key = key;
        return intent;
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
