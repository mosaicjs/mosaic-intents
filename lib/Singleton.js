export default {
    singletonPromise(method){
        function runAction(params){
            params = params || {};
            for (let key in params){
                runAction.params[key] = params[key];
            }
            if (!runAction.promise){
                runAction.promise = Promise.resolve().then(function(result){
                    delete runAction.promise;
                    runAction.params = {};
                    return method.call(that, params);
                });
            }
            return runAction.promise;
        }
        runAction.params = {};
        runAction.promise;
        return runAction;
    },
    singletonAction(that, actionName, action){
        function runAction(params){
            params = params || {};
            for (let key in params){
                runAction.params[key] = params[key];
            }
            if (!runAction.intent){
                runAction.intent = that.action(actionName, runAction.params,
                    function(n){
                    function clear(){
                        if (n === runAction.intent){
                            runAction.params = {};
                            delete runAction.intent;
                        }
                    }
                    n.after(clear, clear);
                    return action.call(that, n);
                });
            }
            return runAction.intent;
        }
        runAction.params = {};
        return runAction;
    },
};