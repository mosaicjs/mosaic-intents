(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("promise"), require("events"));
	else if(typeof define === 'function' && define.amd)
		define(["promise", "events"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("promise"), require("events")) : factory(root["promise"], root["events"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _libIntent = __webpack_require__(1);

	var _libIntent2 = _interopRequireDefault(_libIntent);

	var _libIntents = __webpack_require__(3);

	var _libIntents2 = _interopRequireDefault(_libIntents);

	exports['default'] = {
	    Intent: _libIntent2['default'],
	    Intents: _libIntents2['default'] };
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var Intent = (function () {
	    function Intent(params) {
	        _classCallCheck(this, Intent);

	        this._params = params;
	        this._promise = new _promise2['default']((function (resolve, reject) {
	            this._resolve = resolve;
	            this._reject = reject;
	        }).bind(this));
	        this._handled = false;
	    }

	    _createClass(Intent, [{
	        key: 'then',
	        value: function then() {
	            return this.promise.then.apply(this.promise, arguments);
	        }
	    }, {
	        key: 'params',
	        get: function () {
	            return this._params;
	        }
	    }, {
	        key: 'handled',
	        get: function () {
	            return this._handled;
	        }
	    }, {
	        key: 'promise',
	        get: function () {
	            return this._promise;
	        }
	    }, {
	        key: 'resolve',
	        value: function resolve(result) {
	            this._handled = true;
	            this._resolve(result);
	            return this;
	        }
	    }, {
	        key: 'reject',
	        value: function reject(err) {
	            this._handled = true;
	            this._reject(err);
	            return this;
	        }
	    }]);

	    return Intent;
	})();

	exports['default'] = Intent;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _events = __webpack_require__(4);

	var _Intent = __webpack_require__(1);

	var _Intent2 = _interopRequireDefault(_Intent);

	function Intents(obj) {
	    obj = obj || this;
	    _events.EventEmitter.apply(obj);
	}
	extend(Intents.prototype, {
	    intent: function intent(key, params) {
	        var intent = this._newIntent(key, params);
	        try {
	            this.emit(key, intent);
	        } catch (err) {
	            intent.reject(err);
	        }
	        return intent;
	    },
	    action: function action(key, params, _action) {
	        if (_action === undefined) {
	            _action = params;
	            params = undefined;
	        }
	        var intent = this.intent(key, params);
	        try {
	            var result = _action.call(this, intent);
	            if (result !== undefined && !intent.handled) {
	                intent.resolve(result);
	            }
	        } catch (err) {
	            intent.reject(err);
	        }
	        return intent;
	    },
	    _newIntent: function _newIntent(key, params) {
	        var intent = new _Intent2['default'](params);
	        intent.key = key;
	        return intent;
	    }
	}, _events.EventEmitter.prototype);

	Intents.addTo = function (Type) {
	    extend(Type.prototype, Intents.prototype);
	};

	function extend(to) {
	    for (var i = 1; i < arguments.length; i++) {
	        var from = arguments[i];
	        for (var key in from) {
	            if (!to[key] && Object.prototype.hasOwnProperty.call(from, key)) {
	                to[key] = from[key];
	            }
	        }
	    }
	}

	exports['default'] = Intents;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }
/******/ ])
});
;