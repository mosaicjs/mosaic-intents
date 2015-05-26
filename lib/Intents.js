import { EventEmitter } from 'events';
import Intent from './Intent';

export default class Intents extends EventEmitter {
    intent(key, params){
        let intent = this._newIntent(params); 
        try {
            intent.key = key;
            this.emit(key, intent);
        } catch (err) {
            intent.reject(err);
        }
        return intent;
    }
    action(key, params, action) {
        if (action === undefined) {
            action = params; 
            params = undefined;
        }
        var intent = this.intent(key, params);
        try {
            var result = action.call(this, intent);
            if (result !== undefined && !intent.handled) {
                intent.resolve(result);
            }
        } catch (err) {
            intent.reject(err);
        }
        return intent;
    }
    _newIntent(params){
        return new Intent(params);
    }
}