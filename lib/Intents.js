import { EventEmitter } from 'events';
import Intent from './Intent';

export default class Intents extends EventEmitter {
    intent(key, params) {
        let intent = this._newIntent(key, params);
        try {
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
    }
    _newIntent(key, params) {
        let intent = new Intent(params);
        intent.key = key;
        return intent;
    }
}