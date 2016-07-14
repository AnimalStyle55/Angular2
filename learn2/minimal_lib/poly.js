/******/ (function(modules) { // webpackBootstrap
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

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	__webpack_require__(1);
	var event_target_1 = __webpack_require__(2);
	var define_property_1 = __webpack_require__(4);
	var register_element_1 = __webpack_require__(5);
	var property_descriptor_1 = __webpack_require__(6);
	var timers_1 = __webpack_require__(8);
	var utils_1 = __webpack_require__(3);
	var set = 'set';
	var clear = 'clear';
	var blockingMethods = ['alert', 'prompt', 'confirm'];
	var _global = typeof window == 'undefined' ? global : window;
	timers_1.patchTimer(_global, set, clear, 'Timeout');
	timers_1.patchTimer(_global, set, clear, 'Interval');
	timers_1.patchTimer(_global, set, clear, 'Immediate');
	timers_1.patchTimer(_global, 'request', 'cancelMacroTask', 'AnimationFrame');
	timers_1.patchTimer(_global, 'mozRequest', 'mozCancel', 'AnimationFrame');
	timers_1.patchTimer(_global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
	for (var i = 0; i < blockingMethods.length; i++) {
	    var name = blockingMethods[i];
	    utils_1.patchMethod(_global, name, function (delegate, symbol, name) {
	        return function (s, args) {
	            return Zone.current.run(delegate, _global, args, name);
	        };
	    });
	}
	event_target_1.eventTargetPatch(_global);
	property_descriptor_1.propertyDescriptorPatch(_global);
	utils_1.patchClass('MutationObserver');
	utils_1.patchClass('WebKitMutationObserver');
	utils_1.patchClass('FileReader');
	define_property_1.propertyPatch();
	register_element_1.registerElementPatch(_global);
	// Treat XMLHTTPRequest as a macrotask.
	patchXHR(_global);
	var XHR_TASK = utils_1.zoneSymbol('xhrTask');
	function patchXHR(window) {
	    function findPendingTask(target) {
	        var pendingTask = target[XHR_TASK];
	        return pendingTask;
	    }
	    function scheduleTask(task) {
	        var data = task.data;
	        data.target.addEventListener('readystatechange', function () {
	            if (data.target.readyState === XMLHttpRequest.DONE) {
	                if (!data.aborted) {
	                    task.invoke();
	                }
	            }
	        });
	        var storedTask = data.target[XHR_TASK];
	        if (!storedTask) {
	            data.target[XHR_TASK] = task;
	        }
	        setNative.apply(data.target, data.args);
	        return task;
	    }
	    function placeholderCallback() {
	    }
	    function clearTask(task) {
	        var data = task.data;
	        // Note - ideally, we would call data.target.removeEventListener here, but it's too late
	        // to prevent it from firing. So instead, we store info for the event listener.
	        data.aborted = true;
	        return clearNative.apply(data.target, data.args);
	    }
	    var setNative = utils_1.patchMethod(window.XMLHttpRequest.prototype, 'send', function () { return function (self, args) {
	        var zone = Zone.current;
	        var options = {
	            target: self,
	            isPeriodic: false,
	            delay: null,
	            args: args,
	            aborted: false
	        };
	        return zone.scheduleMacroTask('XMLHttpRequest.send', placeholderCallback, options, scheduleTask, clearTask);
	    }; });
	    var clearNative = utils_1.patchMethod(window.XMLHttpRequest.prototype, 'abort', function (delegate) { return function (self, args) {
	        var task = findPendingTask(self);
	        if (task && typeof task.type == 'string') {
	            // If the XHR has already completed, do nothing.
	            if (task.cancelFn == null) {
	                return;
	            }
	            task.zone.cancelTask(task);
	        }
	        // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no task to cancel. Do nothing.
	    }; });
	}
	/// GEO_LOCATION
	if (_global['navigator'] && _global['navigator'].geolocation) {
	    utils_1.patchPrototype(_global['navigator'].geolocation, [
	        'getCurrentPosition',
	        'watchPosition'
	    ]);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {;
	;
	var Zone = (function (global) {
	    var Zone = (function () {
	        function Zone(parent, zoneSpec) {
	            this._properties = null;
	            this._parent = parent;
	            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
	            this._properties = zoneSpec && zoneSpec.properties || {};
	            this._zoneDelegate = new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
	        }
	        Object.defineProperty(Zone, "current", {
	            get: function () { return _currentZone; },
	            enumerable: true,
	            configurable: true
	        });
	        ;
	        Object.defineProperty(Zone, "currentTask", {
	            get: function () { return _currentTask; },
	            enumerable: true,
	            configurable: true
	        });
	        ;
	        Object.defineProperty(Zone.prototype, "parent", {
	            get: function () { return this._parent; },
	            enumerable: true,
	            configurable: true
	        });
	        ;
	        Object.defineProperty(Zone.prototype, "name", {
	            get: function () { return this._name; },
	            enumerable: true,
	            configurable: true
	        });
	        ;
	        Zone.prototype.get = function (key) {
	            var current = this;
	            while (current) {
	                if (current._properties.hasOwnProperty(key)) {
	                    return current._properties[key];
	                }
	                current = current._parent;
	            }
	        };
	        Zone.prototype.fork = function (zoneSpec) {
	            if (!zoneSpec)
	                throw new Error('ZoneSpec required!');
	            return this._zoneDelegate.fork(this, zoneSpec);
	        };
	        Zone.prototype.wrap = function (callback, source) {
	            if (typeof callback !== 'function') {
	                throw new Error('Expecting function got: ' + callback);
	            }
	            var _callback = this._zoneDelegate.intercept(this, callback, source);
	            var zone = this;
	            return function () {
	                return zone.runGuarded(_callback, this, arguments, source);
	            };
	        };
	        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
	            if (applyThis === void 0) { applyThis = null; }
	            if (applyArgs === void 0) { applyArgs = null; }
	            if (source === void 0) { source = null; }
	            var oldZone = _currentZone;
	            _currentZone = this;
	            try {
	                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
	            }
	            finally {
	                _currentZone = oldZone;
	            }
	        };
	        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
	            if (applyThis === void 0) { applyThis = null; }
	            if (applyArgs === void 0) { applyArgs = null; }
	            if (source === void 0) { source = null; }
	            var oldZone = _currentZone;
	            _currentZone = this;
	            try {
	                try {
	                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
	                }
	                catch (error) {
	                    if (this._zoneDelegate.handleError(this, error)) {
	                        throw error;
	                    }
	                }
	            }
	            finally {
	                _currentZone = oldZone;
	            }
	        };
	        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
	            task.runCount++;
	            if (task.zone != this)
	                throw new Error('A task can only be run in the zone which created it! (Creation: ' +
	                    task.zone.name + '; Execution: ' + this.name + ')');
	            var previousTask = _currentTask;
	            _currentTask = task;
	            var oldZone = _currentZone;
	            _currentZone = this;
	            try {
	                if (task.type == 'macroTask' && task.data && !task.data.isPeriodic) {
	                    task.cancelFn = null;
	                }
	                try {
	                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
	                }
	                catch (error) {
	                    if (this._zoneDelegate.handleError(this, error)) {
	                        throw error;
	                    }
	                }
	            }
	            finally {
	                _currentZone = oldZone;
	                _currentTask = previousTask;
	            }
	        };
	        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
	            return this._zoneDelegate.scheduleTask(this, new ZoneTask('microTask', this, source, callback, data, customSchedule, null));
	        };
	        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
	            return this._zoneDelegate.scheduleTask(this, new ZoneTask('macroTask', this, source, callback, data, customSchedule, customCancel));
	        };
	        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
	            return this._zoneDelegate.scheduleTask(this, new ZoneTask('eventTask', this, source, callback, data, customSchedule, customCancel));
	        };
	        Zone.prototype.cancelTask = function (task) {
	            var value = this._zoneDelegate.cancelTask(this, task);
	            task.runCount = -1;
	            task.cancelFn = null;
	            return value;
	        };
	        Zone.__symbol__ = __symbol__;
	        return Zone;
	    }());
	    ;
	    var ZoneDelegate = (function () {
	        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
	            this._taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 };
	            this.zone = zone;
	            this._parentDelegate = parentDelegate;
	            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
	            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
	            this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
	            this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
	            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
	            this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
	            this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
	            this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
	            this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
	            this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
	            this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
	            this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
	            this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
	            this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
	            this._hasTaskZS = zoneSpec && (zoneSpec.onHasTask ? zoneSpec : parentDelegate._hasTaskZS);
	            this._hasTaskDlgt = zoneSpec && (zoneSpec.onHasTask ? parentDelegate : parentDelegate._hasTaskDlgt);
	        }
	        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
	            return this._forkZS
	                ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec)
	                : new Zone(targetZone, zoneSpec);
	        };
	        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
	            return this._interceptZS
	                ? this._interceptZS.onIntercept(this._interceptDlgt, this.zone, targetZone, callback, source)
	                : callback;
	        };
	        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
	            return this._invokeZS
	                ? this._invokeZS.onInvoke(this._invokeDlgt, this.zone, targetZone, callback, applyThis, applyArgs, source)
	                : callback.apply(applyThis, applyArgs);
	        };
	        ZoneDelegate.prototype.handleError = function (targetZone, error) {
	            return this._handleErrorZS
	                ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this.zone, targetZone, error)
	                : true;
	        };
	        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
	            try {
	                if (this._scheduleTaskZS) {
	                    return this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this.zone, targetZone, task);
	                }
	                else if (task.scheduleFn) {
	                    task.scheduleFn(task);
	                }
	                else if (task.type == 'microTask') {
	                    scheduleMicroTask(task);
	                }
	                else {
	                    throw new Error('Task is missing scheduleFn.');
	                }
	                return task;
	            }
	            finally {
	                if (targetZone == this.zone) {
	                    this._updateTaskCount(task.type, 1);
	                }
	            }
	        };
	        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
	            try {
	                return this._invokeTaskZS
	                    ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this.zone, targetZone, task, applyThis, applyArgs)
	                    : task.callback.apply(applyThis, applyArgs);
	            }
	            finally {
	                if (targetZone == this.zone && (task.type != 'eventTask') && !(task.data && task.data.isPeriodic)) {
	                    this._updateTaskCount(task.type, -1);
	                }
	            }
	        };
	        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
	            var value;
	            if (this._cancelTaskZS) {
	                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this.zone, targetZone, task);
	            }
	            else if (!task.cancelFn) {
	                throw new Error('Task does not support cancellation, or is already canceled.');
	            }
	            else {
	                value = task.cancelFn(task);
	            }
	            if (targetZone == this.zone) {
	                // this should not be in the finally block, because exceptions assume not canceled.
	                this._updateTaskCount(task.type, -1);
	            }
	            return value;
	        };
	        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
	            return this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this.zone, targetZone, isEmpty);
	        };
	        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
	            var counts = this._taskCounts;
	            var prev = counts[type];
	            var next = counts[type] = prev + count;
	            if (next < 0) {
	                throw new Error('More tasks executed then were scheduled.');
	            }
	            if (prev == 0 || next == 0) {
	                var isEmpty = {
	                    microTask: counts.microTask > 0,
	                    macroTask: counts.macroTask > 0,
	                    eventTask: counts.eventTask > 0,
	                    change: type
	                };
	                try {
	                    this.hasTask(this.zone, isEmpty);
	                }
	                finally {
	                    if (this._parentDelegate) {
	                        this._parentDelegate._updateTaskCount(type, count);
	                    }
	                }
	            }
	        };
	        return ZoneDelegate;
	    }());
	    var ZoneTask = (function () {
	        function ZoneTask(type, zone, source, callback, options, scheduleFn, cancelFn) {
	            this.runCount = 0;
	            this.type = type;
	            this.zone = zone;
	            this.source = source;
	            this.data = options;
	            this.scheduleFn = scheduleFn;
	            this.cancelFn = cancelFn;
	            this.callback = callback;
	            var self = this;
	            this.invoke = function () {
	                try {
	                    return zone.runTask(self, this, arguments);
	                }
	                finally {
	                    drainMicroTaskQueue();
	                }
	            };
	        }
	        return ZoneTask;
	    }());
	    function __symbol__(name) { return '__zone_symbol__' + name; }
	    ;
	    var symbolSetTimeout = __symbol__('setTimeout');
	    var symbolPromise = __symbol__('Promise');
	    var symbolThen = __symbol__('then');
	    var _currentZone = new Zone(null, null);
	    var _currentTask = null;
	    var _microTaskQueue = [];
	    var _isDrainingMicrotaskQueue = false;
	    var _uncaughtPromiseErrors = [];
	    var _drainScheduled = false;
	    function scheduleQueueDrain() {
	        if (!_drainScheduled && !_currentTask && _microTaskQueue.length == 0) {
	            // We are not running in Task, so we need to kickstart the microtask queue.
	            if (global[symbolPromise]) {
	                global[symbolPromise].resolve(0)[symbolThen](drainMicroTaskQueue);
	            }
	            else {
	                global[symbolSetTimeout](drainMicroTaskQueue, 0);
	            }
	        }
	    }
	    function scheduleMicroTask(task) {
	        scheduleQueueDrain();
	        _microTaskQueue.push(task);
	    }
	    function consoleError(e) {
	        var rejection = e && e.rejection;
	        if (rejection) {
	            console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection);
	        }
	        console.error(e);
	    }
	    function drainMicroTaskQueue() {
	        if (!_isDrainingMicrotaskQueue) {
	            _isDrainingMicrotaskQueue = true;
	            while (_microTaskQueue.length) {
	                var queue = _microTaskQueue;
	                _microTaskQueue = [];
	                for (var i = 0; i < queue.length; i++) {
	                    var task = queue[i];
	                    try {
	                        task.zone.runTask(task, null, null);
	                    }
	                    catch (e) {
	                        consoleError(e);
	                    }
	                }
	            }
	            while (_uncaughtPromiseErrors.length) {
	                var uncaughtPromiseErrors = _uncaughtPromiseErrors;
	                _uncaughtPromiseErrors = [];
	                var _loop_1 = function(i) {
	                    var uncaughtPromiseError = uncaughtPromiseErrors[i];
	                    try {
	                        uncaughtPromiseError.zone.runGuarded(function () { throw uncaughtPromiseError; });
	                    }
	                    catch (e) {
	                        consoleError(e);
	                    }
	                };
	                for (var i = 0; i < uncaughtPromiseErrors.length; i++) {
	                    _loop_1(i);
	                }
	            }
	            _isDrainingMicrotaskQueue = false;
	            _drainScheduled = false;
	        }
	    }
	    function isThenable(value) {
	        return value && value.then;
	    }
	    function forwardResolution(value) { return value; }
	    function forwardRejection(rejection) { return ZoneAwarePromise.reject(rejection); }
	    var symbolState = __symbol__('state');
	    var symbolValue = __symbol__('value');
	    var source = 'Promise.then';
	    var UNRESOLVED = null;
	    var RESOLVED = true;
	    var REJECTED = false;
	    var REJECTED_NO_CATCH = 0;
	    function makeResolver(promise, state) {
	        return function (v) {
	            resolvePromise(promise, state, v);
	            // Do not return value or you will break the Promise spec.
	        };
	    }
	    function resolvePromise(promise, state, value) {
	        if (promise[symbolState] === UNRESOLVED) {
	            if (value instanceof ZoneAwarePromise && value[symbolState] !== UNRESOLVED) {
	                clearRejectedNoCatch(value);
	                resolvePromise(promise, value[symbolState], value[symbolValue]);
	            }
	            else if (isThenable(value)) {
	                value.then(makeResolver(promise, state), makeResolver(promise, false));
	            }
	            else {
	                promise[symbolState] = state;
	                var queue = promise[symbolValue];
	                promise[symbolValue] = value;
	                for (var i = 0; i < queue.length;) {
	                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
	                }
	                if (queue.length == 0 && state == REJECTED) {
	                    promise[symbolState] = REJECTED_NO_CATCH;
	                    try {
	                        throw new Error("Uncaught (in promise): " + value);
	                    }
	                    catch (e) {
	                        var error = e;
	                        error.rejection = value;
	                        error.promise = promise;
	                        error.zone = Zone.current;
	                        error.task = Zone.currentTask;
	                        _uncaughtPromiseErrors.push(error);
	                        scheduleQueueDrain();
	                    }
	                }
	            }
	        }
	        // Resolving an already resolved promise is a noop.
	        return promise;
	    }
	    function clearRejectedNoCatch(promise) {
	        if (promise[symbolState] === REJECTED_NO_CATCH) {
	            promise[symbolState] = REJECTED;
	            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
	                if (promise === _uncaughtPromiseErrors[i].promise) {
	                    _uncaughtPromiseErrors.splice(i, 1);
	                    break;
	                }
	            }
	        }
	    }
	    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
	        clearRejectedNoCatch(promise);
	        var delegate = promise[symbolState] ? onFulfilled || forwardResolution : onRejected || forwardRejection;
	        zone.scheduleMicroTask(source, function () {
	            try {
	                resolvePromise(chainPromise, true, zone.run(delegate, null, [promise[symbolValue]]));
	            }
	            catch (error) {
	                resolvePromise(chainPromise, false, error);
	            }
	        });
	    }
	    var ZoneAwarePromise = (function () {
	        function ZoneAwarePromise(executor) {
	            var promise = this;
	            promise[symbolState] = UNRESOLVED;
	            promise[symbolValue] = []; // queue;
	            try {
	                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
	            }
	            catch (e) {
	                resolvePromise(promise, false, e);
	            }
	        }
	        ZoneAwarePromise.resolve = function (value) {
	            return resolvePromise(new this(null), RESOLVED, value);
	        };
	        ZoneAwarePromise.reject = function (error) {
	            return resolvePromise(new this(null), REJECTED, error);
	        };
	        ZoneAwarePromise.race = function (values) {
	            var resolve;
	            var reject;
	            var promise = new this(function (res, rej) { resolve = res; reject = rej; });
	            function onResolve(value) { promise && (promise = null || resolve(value)); }
	            function onReject(error) { promise && (promise = null || reject(error)); }
	            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
	                var value = values_1[_i];
	                if (!isThenable(value)) {
	                    value = this.resolve(value);
	                }
	                value.then(onResolve, onReject);
	            }
	            return promise;
	        };
	        ZoneAwarePromise.all = function (values) {
	            var resolve;
	            var reject;
	            var promise = new this(function (res, rej) { resolve = res; reject = rej; });
	            var count = 0;
	            var resolvedValues = [];
	            function onReject(error) { promise && reject(error); promise = null; }
	            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
	                var value = values_2[_i];
	                if (!isThenable(value)) {
	                    value = this.resolve(value);
	                }
	                value.then((function (index) { return function (value) {
	                    resolvedValues[index] = value;
	                    count--;
	                    if (promise && !count) {
	                        resolve(resolvedValues);
	                    }
	                    promise == null;
	                }; })(count), onReject);
	                count++;
	            }
	            if (!count)
	                resolve(resolvedValues);
	            return promise;
	        };
	        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
	            var chainPromise = new ZoneAwarePromise(null);
	            var zone = Zone.current;
	            if (this[symbolState] == UNRESOLVED) {
	                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
	            }
	            else {
	                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
	            }
	            return chainPromise;
	        };
	        ZoneAwarePromise.prototype.catch = function (onRejected) {
	            return this.then(null, onRejected);
	        };
	        return ZoneAwarePromise;
	    }());
	    var NativePromise = global[__symbol__('Promise')] = global.Promise;
	    global.Promise = ZoneAwarePromise;
	    if (NativePromise) {
	        var NativePromiseProtototype = NativePromise.prototype;
	        var NativePromiseThen_1 = NativePromiseProtototype[__symbol__('then')]
	            = NativePromiseProtototype.then;
	        NativePromiseProtototype.then = function (onResolve, onReject) {
	            var nativePromise = this;
	            return new ZoneAwarePromise(function (resolve, reject) {
	                NativePromiseThen_1.call(nativePromise, resolve, reject);
	            }).then(onResolve, onReject);
	        };
	    }
	    return global.Zone = Zone;
	})(typeof window === 'undefined' ? global : window);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(3);
	var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
	var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex'.split(',');
	var EVENT_TARGET = 'EventTarget';
	function eventTargetPatch(_global) {
	    var apis = [];
	    var isWtf = _global['wtf'];
	    if (isWtf) {
	        // Workaround for: https://github.com/google/tracing-framework/issues/555
	        apis = WTF_ISSUE_555.split(',').map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
	    }
	    else if (_global[EVENT_TARGET]) {
	        apis.push(EVENT_TARGET);
	    }
	    else {
	        // Note: EventTarget is not available in all browsers,
	        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
	        apis = NO_EVENT_TARGET;
	    }
	    for (var i = 0; i < apis.length; i++) {
	        var type = _global[apis[i]];
	        utils_1.patchEventTargetMethods(type && type.prototype);
	    }
	}
	exports.eventTargetPatch = eventTargetPatch;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Suppress closure compiler errors about unknown 'process' variable
	 * @fileoverview
	 * @suppress {undefinedVars}
	 */
	"use strict";
	exports.zoneSymbol = Zone['__symbol__'];
	var _global = typeof window == 'undefined' ? global : window;
	function bindArguments(args, source) {
	    for (var i = args.length - 1; i >= 0; i--) {
	        if (typeof args[i] === 'function') {
	            args[i] = Zone.current.wrap(args[i], source + '_' + i);
	        }
	    }
	    return args;
	}
	exports.bindArguments = bindArguments;
	;
	function patchPrototype(prototype, fnNames) {
	    var source = prototype.constructor['name'];
	    var _loop_1 = function(i) {
	        var name_1 = fnNames[i];
	        var delegate = prototype[name_1];
	        if (delegate) {
	            prototype[name_1] = (function (delegate) {
	                return function () {
	                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
	                };
	            })(delegate);
	        }
	    };
	    for (var i = 0; i < fnNames.length; i++) {
	        _loop_1(i);
	    }
	}
	exports.patchPrototype = patchPrototype;
	;
	exports.isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
	exports.isNode = (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]');
	exports.isBrowser = !exports.isNode && !exports.isWebWorker && !!(typeof window !== 'undefined' && window['HTMLElement']);
	function patchProperty(obj, prop) {
	    var desc = Object.getOwnPropertyDescriptor(obj, prop) || {
	        enumerable: true,
	        configurable: true
	    };
	    // A property descriptor cannot have getter/setter and be writable
	    // deleting the writable and value properties avoids this error:
	    //
	    // TypeError: property descriptors must not specify a value or be writable when a
	    // getter or setter has been specified
	    delete desc.writable;
	    delete desc.value;
	    // substr(2) cuz 'onclick' -> 'click', etc
	    var eventName = prop.substr(2);
	    var _prop = '_' + prop;
	    desc.set = function (fn) {
	        if (this[_prop]) {
	            this.removeEventListener(eventName, this[_prop]);
	        }
	        if (typeof fn === 'function') {
	            var wrapFn = function (event) {
	                var result;
	                result = fn.apply(this, arguments);
	                if (result != undefined && !result)
	                    event.preventDefault();
	            };
	            this[_prop] = wrapFn;
	            this.addEventListener(eventName, wrapFn, false);
	        }
	        else {
	            this[_prop] = null;
	        }
	    };
	    desc.get = function () {
	        return this[_prop];
	    };
	    Object.defineProperty(obj, prop, desc);
	}
	exports.patchProperty = patchProperty;
	;
	function patchOnProperties(obj, properties) {
	    var onProperties = [];
	    for (var prop in obj) {
	        if (prop.substr(0, 2) == 'on') {
	            onProperties.push(prop);
	        }
	    }
	    for (var j = 0; j < onProperties.length; j++) {
	        patchProperty(obj, onProperties[j]);
	    }
	    if (properties) {
	        for (var i = 0; i < properties.length; i++) {
	            patchProperty(obj, 'on' + properties[i]);
	        }
	    }
	}
	exports.patchOnProperties = patchOnProperties;
	;
	var EVENT_TASKS = exports.zoneSymbol('eventTasks');
	var ADD_EVENT_LISTENER = 'addEventListener';
	var REMOVE_EVENT_LISTENER = 'removeEventListener';
	var SYMBOL_ADD_EVENT_LISTENER = exports.zoneSymbol(ADD_EVENT_LISTENER);
	var SYMBOL_REMOVE_EVENT_LISTENER = exports.zoneSymbol(REMOVE_EVENT_LISTENER);
	function findExistingRegisteredTask(target, handler, name, capture, remove) {
	    var eventTasks = target[EVENT_TASKS];
	    if (eventTasks) {
	        for (var i = 0; i < eventTasks.length; i++) {
	            var eventTask = eventTasks[i];
	            var data = eventTask.data;
	            if (data.handler === handler
	                && data.useCapturing === capture
	                && data.eventName === name) {
	                if (remove) {
	                    eventTasks.splice(i, 1);
	                }
	                return eventTask;
	            }
	        }
	    }
	    return null;
	}
	function attachRegisteredEvent(target, eventTask) {
	    var eventTasks = target[EVENT_TASKS];
	    if (!eventTasks) {
	        eventTasks = target[EVENT_TASKS] = [];
	    }
	    eventTasks.push(eventTask);
	}
	function scheduleEventListener(eventTask) {
	    var meta = eventTask.data;
	    attachRegisteredEvent(meta.target, eventTask);
	    return meta.target[SYMBOL_ADD_EVENT_LISTENER](meta.eventName, eventTask.invoke, meta.useCapturing);
	}
	function cancelEventListener(eventTask) {
	    var meta = eventTask.data;
	    findExistingRegisteredTask(meta.target, eventTask.invoke, meta.eventName, meta.useCapturing, true);
	    meta.target[SYMBOL_REMOVE_EVENT_LISTENER](meta.eventName, eventTask.invoke, meta.useCapturing);
	}
	function zoneAwareAddEventListener(self, args) {
	    var eventName = args[0];
	    var handler = args[1];
	    var useCapturing = args[2] || false;
	    // - Inside a Web Worker, `this` is undefined, the context is `global`
	    // - When `addEventListener` is called on the global context in strict mode, `this` is undefined
	    // see https://github.com/angular/zone.js/issues/190
	    var target = self || _global;
	    var delegate = null;
	    if (typeof handler == 'function') {
	        delegate = handler;
	    }
	    else if (handler && handler.handleEvent) {
	        delegate = function (event) { return handler.handleEvent(event); };
	    }
	    var validZoneHandler = false;
	    try {
	        // In cross site contexts (such as WebDriver frameworks like Selenium),
	        // accessing the handler object here will cause an exception to be thrown which
	        // will fail tests prematurely.
	        validZoneHandler = handler && handler.toString() === "[object FunctionWrapper]";
	    }
	    catch (e) {
	        // Returning nothing here is fine, because objects in a cross-site context are unusable
	        return;
	    }
	    // Ignore special listeners of IE11 & Edge dev tools, see https://github.com/angular/zone.js/issues/150
	    if (!delegate || validZoneHandler) {
	        return target[SYMBOL_ADD_EVENT_LISTENER](eventName, handler, useCapturing);
	    }
	    var eventTask = findExistingRegisteredTask(target, handler, eventName, useCapturing, false);
	    if (eventTask) {
	        // we already registered, so this will have noop.
	        return target[SYMBOL_ADD_EVENT_LISTENER](eventName, eventTask.invoke, useCapturing);
	    }
	    var zone = Zone.current;
	    var source = target.constructor['name'] + '.addEventListener:' + eventName;
	    var data = {
	        target: target,
	        eventName: eventName,
	        name: eventName,
	        useCapturing: useCapturing,
	        handler: handler
	    };
	    zone.scheduleEventTask(source, delegate, data, scheduleEventListener, cancelEventListener);
	}
	function zoneAwareRemoveEventListener(self, args) {
	    var eventName = args[0];
	    var handler = args[1];
	    var useCapturing = args[2] || false;
	    // - Inside a Web Worker, `this` is undefined, the context is `global`
	    // - When `addEventListener` is called on the global context in strict mode, `this` is undefined
	    // see https://github.com/angular/zone.js/issues/190
	    var target = self || _global;
	    var eventTask = findExistingRegisteredTask(target, handler, eventName, useCapturing, true);
	    if (eventTask) {
	        eventTask.zone.cancelTask(eventTask);
	    }
	    else {
	        target[SYMBOL_REMOVE_EVENT_LISTENER](eventName, handler, useCapturing);
	    }
	}
	function patchEventTargetMethods(obj) {
	    if (obj && obj.addEventListener) {
	        patchMethod(obj, ADD_EVENT_LISTENER, function () { return zoneAwareAddEventListener; });
	        patchMethod(obj, REMOVE_EVENT_LISTENER, function () { return zoneAwareRemoveEventListener; });
	        return true;
	    }
	    else {
	        return false;
	    }
	}
	exports.patchEventTargetMethods = patchEventTargetMethods;
	;
	var originalInstanceKey = exports.zoneSymbol('originalInstance');
	// wrap some native API on `window`
	function patchClass(className) {
	    var OriginalClass = _global[className];
	    if (!OriginalClass)
	        return;
	    _global[className] = function () {
	        var a = bindArguments(arguments, className);
	        switch (a.length) {
	            case 0:
	                this[originalInstanceKey] = new OriginalClass();
	                break;
	            case 1:
	                this[originalInstanceKey] = new OriginalClass(a[0]);
	                break;
	            case 2:
	                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
	                break;
	            case 3:
	                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
	                break;
	            case 4:
	                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
	                break;
	            default: throw new Error('Arg list too long.');
	        }
	    };
	    var instance = new OriginalClass(function () { });
	    var prop;
	    for (prop in instance) {
	        (function (prop) {
	            if (typeof instance[prop] === 'function') {
	                _global[className].prototype[prop] = function () {
	                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
	                };
	            }
	            else {
	                Object.defineProperty(_global[className].prototype, prop, {
	                    set: function (fn) {
	                        if (typeof fn === 'function') {
	                            this[originalInstanceKey][prop] = Zone.current.wrap(fn, className + '.' + prop);
	                        }
	                        else {
	                            this[originalInstanceKey][prop] = fn;
	                        }
	                    },
	                    get: function () {
	                        return this[originalInstanceKey][prop];
	                    }
	                });
	            }
	        }(prop));
	    }
	    for (prop in OriginalClass) {
	        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
	            _global[className][prop] = OriginalClass[prop];
	        }
	    }
	}
	exports.patchClass = patchClass;
	;
	function createNamedFn(name, delegate) {
	    try {
	        return (Function('f', "return function " + name + "(){return f(this, arguments)}"))(delegate);
	    }
	    catch (e) {
	        // if we fail, we must be CSP, just return delegate.
	        return function () {
	            return delegate(this, arguments);
	        };
	    }
	}
	exports.createNamedFn = createNamedFn;
	function patchMethod(target, name, patchFn) {
	    var proto = target;
	    while (proto && !proto.hasOwnProperty(name)) {
	        proto = Object.getPrototypeOf(proto);
	    }
	    if (!proto && target[name]) {
	        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
	        proto = target;
	    }
	    var delegateName = exports.zoneSymbol(name);
	    var delegate;
	    if (proto && !(delegate = proto[delegateName])) {
	        delegate = proto[delegateName] = proto[name];
	        proto[name] = createNamedFn(name, patchFn(delegate, delegateName, name));
	    }
	    return delegate;
	}
	exports.patchMethod = patchMethod;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(3);
	/*
	 * This is necessary for Chrome and Chrome mobile, to enable
	 * things like redefining `createdCallback` on an element.
	 */
	var _defineProperty = Object.defineProperty;
	var _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var _create = Object.create;
	var unconfigurablesKey = utils_1.zoneSymbol('unconfigurables');
	function propertyPatch() {
	    Object.defineProperty = function (obj, prop, desc) {
	        if (isUnconfigurable(obj, prop)) {
	            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
	        }
	        if (prop !== 'prototype') {
	            desc = rewriteDescriptor(obj, prop, desc);
	        }
	        return _defineProperty(obj, prop, desc);
	    };
	    Object.defineProperties = function (obj, props) {
	        Object.keys(props).forEach(function (prop) {
	            Object.defineProperty(obj, prop, props[prop]);
	        });
	        return obj;
	    };
	    Object.create = function (obj, proto) {
	        if (typeof proto === 'object') {
	            Object.keys(proto).forEach(function (prop) {
	                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
	            });
	        }
	        return _create(obj, proto);
	    };
	    Object.getOwnPropertyDescriptor = function (obj, prop) {
	        var desc = _getOwnPropertyDescriptor(obj, prop);
	        if (isUnconfigurable(obj, prop)) {
	            desc.configurable = false;
	        }
	        return desc;
	    };
	}
	exports.propertyPatch = propertyPatch;
	;
	function _redefineProperty(obj, prop, desc) {
	    desc = rewriteDescriptor(obj, prop, desc);
	    return _defineProperty(obj, prop, desc);
	}
	exports._redefineProperty = _redefineProperty;
	;
	function isUnconfigurable(obj, prop) {
	    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
	}
	function rewriteDescriptor(obj, prop, desc) {
	    desc.configurable = true;
	    if (!desc.configurable) {
	        if (!obj[unconfigurablesKey]) {
	            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
	        }
	        obj[unconfigurablesKey][prop] = true;
	    }
	    return desc;
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var define_property_1 = __webpack_require__(4);
	var utils_1 = __webpack_require__(3);
	function registerElementPatch(_global) {
	    if (!utils_1.isBrowser || !('registerElement' in _global.document)) {
	        return;
	    }
	    var _registerElement = document.registerElement;
	    var callbacks = [
	        'createdCallback',
	        'attachedCallback',
	        'detachedCallback',
	        'attributeChangedCallback'
	    ];
	    document.registerElement = function (name, opts) {
	        if (opts && opts.prototype) {
	            callbacks.forEach(function (callback) {
	                var source = 'Document.registerElement::' + callback;
	                if (opts.prototype.hasOwnProperty(callback)) {
	                    var descriptor = Object.getOwnPropertyDescriptor(opts.prototype, callback);
	                    if (descriptor && descriptor.value) {
	                        descriptor.value = Zone.current.wrap(descriptor.value, source);
	                        define_property_1._redefineProperty(opts.prototype, callback, descriptor);
	                    }
	                    else {
	                        opts.prototype[callback] = Zone.current.wrap(opts.prototype[callback], source);
	                    }
	                }
	                else if (opts.prototype[callback]) {
	                    opts.prototype[callback] = Zone.current.wrap(opts.prototype[callback], source);
	                }
	            });
	        }
	        return _registerElement.apply(document, [name, opts]);
	    };
	}
	exports.registerElementPatch = registerElementPatch;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var webSocketPatch = __webpack_require__(7);
	var utils_1 = __webpack_require__(3);
	var eventNames = 'copy cut paste abort blur focus canplay canplaythrough change click contextmenu dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart message mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup pause play playing progress ratechange reset scroll seeked seeking select show stalled submit suspend timeupdate volumechange waiting mozfullscreenchange mozfullscreenerror mozpointerlockchange mozpointerlockerror error webglcontextrestored webglcontextlost webglcontextcreationerror'.split(' ');
	function propertyDescriptorPatch(_global) {
	    if (utils_1.isNode) {
	        return;
	    }
	    var supportsWebSocket = typeof WebSocket !== 'undefined';
	    if (canPatchViaPropertyDescriptor()) {
	        // for browsers that we can patch the descriptor:  Chrome & Firefox
	        if (utils_1.isBrowser) {
	            utils_1.patchOnProperties(HTMLElement.prototype, eventNames);
	        }
	        utils_1.patchOnProperties(XMLHttpRequest.prototype, null);
	        if (typeof IDBIndex !== 'undefined') {
	            utils_1.patchOnProperties(IDBIndex.prototype, null);
	            utils_1.patchOnProperties(IDBRequest.prototype, null);
	            utils_1.patchOnProperties(IDBOpenDBRequest.prototype, null);
	            utils_1.patchOnProperties(IDBDatabase.prototype, null);
	            utils_1.patchOnProperties(IDBTransaction.prototype, null);
	            utils_1.patchOnProperties(IDBCursor.prototype, null);
	        }
	        if (supportsWebSocket) {
	            utils_1.patchOnProperties(WebSocket.prototype, null);
	        }
	    }
	    else {
	        // Safari, Android browsers (Jelly Bean)
	        patchViaCapturingAllTheEvents();
	        utils_1.patchClass('XMLHttpRequest');
	        if (supportsWebSocket) {
	            webSocketPatch.apply(_global);
	        }
	    }
	}
	exports.propertyDescriptorPatch = propertyDescriptorPatch;
	function canPatchViaPropertyDescriptor() {
	    if (utils_1.isBrowser && !Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick')
	        && typeof Element !== 'undefined') {
	        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
	        // IDL interface attributes are not configurable
	        var desc = Object.getOwnPropertyDescriptor(Element.prototype, 'onclick');
	        if (desc && !desc.configurable)
	            return false;
	    }
	    Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
	        get: function () {
	            return true;
	        }
	    });
	    var req = new XMLHttpRequest();
	    var result = !!req.onreadystatechange;
	    Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {});
	    return result;
	}
	;
	var unboundKey = utils_1.zoneSymbol('unbound');
	// Whenever any eventListener fires, we check the eventListener target and all parents
	// for `onwhatever` properties and replace them with zone-bound functions
	// - Chrome (for now)
	function patchViaCapturingAllTheEvents() {
	    var _loop_1 = function(i) {
	        var property = eventNames[i];
	        var onproperty = 'on' + property;
	        document.addEventListener(property, function (event) {
	            var elt = event.target, bound;
	            var source = elt.constructor['name'] + '.' + onproperty;
	            while (elt) {
	                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
	                    bound = Zone.current.wrap(elt[onproperty], source);
	                    bound[unboundKey] = elt[onproperty];
	                    elt[onproperty] = bound;
	                }
	                elt = elt.parentElement;
	            }
	        }, true);
	    };
	    for (var i = 0; i < eventNames.length; i++) {
	        _loop_1(i);
	    }
	    ;
	}
	;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(3);
	// we have to patch the instance since the proto is non-configurable
	function apply(_global) {
	    var WS = _global.WebSocket;
	    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
	    // On older Chrome, no need since EventTarget was already patched
	    if (!_global.EventTarget) {
	        utils_1.patchEventTargetMethods(WS.prototype);
	    }
	    _global.WebSocket = function (a, b) {
	        var socket = arguments.length > 1 ? new WS(a, b) : new WS(a);
	        var proxySocket;
	        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
	        var onmessageDesc = Object.getOwnPropertyDescriptor(socket, 'onmessage');
	        if (onmessageDesc && onmessageDesc.configurable === false) {
	            proxySocket = Object.create(socket);
	            ['addEventListener', 'removeEventListener', 'send', 'close'].forEach(function (propName) {
	                proxySocket[propName] = function () {
	                    return socket[propName].apply(socket, arguments);
	                };
	            });
	        }
	        else {
	            // we can patch the real socket
	            proxySocket = socket;
	        }
	        utils_1.patchOnProperties(proxySocket, ['close', 'error', 'message', 'open']);
	        return proxySocket;
	    };
	    for (var prop in WS) {
	        _global.WebSocket[prop] = WS[prop];
	    }
	}
	exports.apply = apply;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(3);
	function patchTimer(window, setName, cancelName, nameSuffix) {
	    var setNative = null;
	    var clearNative = null;
	    setName += nameSuffix;
	    cancelName += nameSuffix;
	    function scheduleTask(task) {
	        var data = task.data;
	        data.args[0] = task.invoke;
	        data.handleId = setNative.apply(window, data.args);
	        return task;
	    }
	    function clearTask(task) {
	        return clearNative(task.data.handleId);
	    }
	    setNative = utils_1.patchMethod(window, setName, function (delegate) { return function (self, args) {
	        if (typeof args[0] === 'function') {
	            var zone = Zone.current;
	            var options = {
	                handleId: null,
	                isPeriodic: nameSuffix === 'Interval',
	                delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 : null,
	                args: args
	            };
	            return zone.scheduleMacroTask(setName, args[0], options, scheduleTask, clearTask);
	        }
	        else {
	            // cause an error by calling it directly.
	            return delegate.apply(window, args);
	        }
	    }; });
	    clearNative = utils_1.patchMethod(window, cancelName, function (delegate) { return function (self, args) {
	        var task = args[0];
	        if (task && typeof task.type === 'string') {
	            if (task.cancelFn && task.data.isPeriodic || task.runCount === 0) {
	                // Do not cancel already canceled functions
	                task.zone.cancelTask(task);
	            }
	        }
	        else {
	            // cause an error by calling it directly.
	            delegate.apply(window, args);
	        }
	    }; });
	}
	exports.patchTimer = patchTimer;


/***/ }
/******/ ]);/*!
  * https://github.com/paulmillr/es6-shim
  * @license es6-shim Copyright 2013-2016 by Paul Miller (http://paulmillr.com)
  *   and contributors,  MIT License
  * es6-shim: v0.35.0
  * see https://github.com/paulmillr/es6-shim/blob/0.35.0/LICENSE
  * Details and documentation:
  * https://github.com/paulmillr/es6-shim/
  */
(function(e,t){if(typeof define==="function"&&define.amd){define(t)}else if(typeof exports==="object"){module.exports=t()}else{e.returnExports=t()}})(this,function(){"use strict";var e=Function.call.bind(Function.apply);var t=Function.call.bind(Function.call);var r=Array.isArray;var n=Object.keys;var o=function notThunker(t){return function notThunk(){return!e(t,this,arguments)}};var i=function(e){try{e();return false}catch(t){return true}};var a=function valueOrFalseIfThrows(e){try{return e()}catch(t){return false}};var u=o(i);var f=function(){return!i(function(){Object.defineProperty({},"x",{get:function(){}})})};var s=!!Object.defineProperty&&f();var c=function foo(){}.name==="foo";var l=Function.call.bind(Array.prototype.forEach);var p=Function.call.bind(Array.prototype.reduce);var v=Function.call.bind(Array.prototype.filter);var y=Function.call.bind(Array.prototype.some);var h=function(e,t,r,n){if(!n&&t in e){return}if(s){Object.defineProperty(e,t,{configurable:true,enumerable:false,writable:true,value:r})}else{e[t]=r}};var b=function(e,t,r){l(n(t),function(n){var o=t[n];h(e,n,o,!!r)})};var g=Function.call.bind(Object.prototype.toString);var d=typeof/abc/==="function"?function IsCallableSlow(e){return typeof e==="function"&&g(e)==="[object Function]"}:function IsCallableFast(e){return typeof e==="function"};var O={getter:function(e,t,r){if(!s){throw new TypeError("getters require true ES5 support")}Object.defineProperty(e,t,{configurable:true,enumerable:false,get:r})},proxy:function(e,t,r){if(!s){throw new TypeError("getters require true ES5 support")}var n=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,{configurable:n.configurable,enumerable:n.enumerable,get:function getKey(){return e[t]},set:function setKey(r){e[t]=r}})},redefine:function(e,t,r){if(s){var n=Object.getOwnPropertyDescriptor(e,t);n.value=r;Object.defineProperty(e,t,n)}else{e[t]=r}},defineByDescriptor:function(e,t,r){if(s){Object.defineProperty(e,t,r)}else if("value"in r){e[t]=r.value}},preserveToString:function(e,t){if(t&&d(t.toString)){h(e,"toString",t.toString.bind(t),true)}}};var m=Object.create||function(e,t){var r=function Prototype(){};r.prototype=e;var o=new r;if(typeof t!=="undefined"){n(t).forEach(function(e){O.defineByDescriptor(o,e,t[e])})}return o};var w=function(e,t){if(!Object.setPrototypeOf){return false}return a(function(){var r=function Subclass(t){var r=new e(t);Object.setPrototypeOf(r,Subclass.prototype);return r};Object.setPrototypeOf(r,e);r.prototype=m(e.prototype,{constructor:{value:r}});return t(r)})};var j=function(){if(typeof self!=="undefined"){return self}if(typeof window!=="undefined"){return window}if(typeof global!=="undefined"){return global}throw new Error("unable to locate global object")};var S=j();var T=S.isFinite;var I=Function.call.bind(String.prototype.indexOf);var E=Function.apply.bind(Array.prototype.indexOf);var P=Function.call.bind(Array.prototype.concat);var M=Function.call.bind(Array.prototype.sort);var C=Function.call.bind(String.prototype.slice);var x=Function.call.bind(Array.prototype.push);var N=Function.apply.bind(Array.prototype.push);var A=Function.call.bind(Array.prototype.shift);var R=Math.max;var _=Math.min;var k=Math.floor;var F=Math.abs;var L=Math.log;var D=Math.sqrt;var z=Function.call.bind(Object.prototype.hasOwnProperty);var q;var G=function(){};var W=S.Symbol||{};var H=W.species||"@@species";var V=Number.isNaN||function isNaN(e){return e!==e};var B=Number.isFinite||function isFinite(e){return typeof e==="number"&&T(e)};var $=function isArguments(e){return g(e)==="[object Arguments]"};var U=function isArguments(e){return e!==null&&typeof e==="object"&&typeof e.length==="number"&&e.length>=0&&g(e)!=="[object Array]"&&g(e.callee)==="[object Function]"};var J=$(arguments)?$:U;var K={primitive:function(e){return e===null||typeof e!=="function"&&typeof e!=="object"},object:function(e){return e!==null&&typeof e==="object"},string:function(e){return g(e)==="[object String]"},regex:function(e){return g(e)==="[object RegExp]"},symbol:function(e){return typeof S.Symbol==="function"&&typeof e==="symbol"}};var X=function overrideNative(e,t,r){var n=e[t];h(e,t,r,true);O.preserveToString(e[t],n)};var Z=typeof W==="function"&&typeof W["for"]==="function"&&K.symbol(W());var Y=K.symbol(W.iterator)?W.iterator:"_es6-shim iterator_";if(S.Set&&typeof(new S.Set)["@@iterator"]==="function"){Y="@@iterator"}if(!S.Reflect){h(S,"Reflect",{},true)}var Q=S.Reflect;var ee=String;var te={Call:function Call(t,r){var n=arguments.length>2?arguments[2]:[];if(!te.IsCallable(t)){throw new TypeError(t+" is not a function")}return e(t,r,n)},RequireObjectCoercible:function(e,t){if(e==null){throw new TypeError(t||"Cannot call method on "+e)}return e},TypeIsObject:function(e){if(e===void 0||e===null||e===true||e===false){return false}return typeof e==="function"||typeof e==="object"},ToObject:function(e,t){return Object(te.RequireObjectCoercible(e,t))},IsCallable:d,IsConstructor:function(e){return te.IsCallable(e)},ToInt32:function(e){return te.ToNumber(e)>>0},ToUint32:function(e){return te.ToNumber(e)>>>0},ToNumber:function(e){if(g(e)==="[object Symbol]"){throw new TypeError("Cannot convert a Symbol value to a number")}return+e},ToInteger:function(e){var t=te.ToNumber(e);if(V(t)){return 0}if(t===0||!B(t)){return t}return(t>0?1:-1)*k(F(t))},ToLength:function(e){var t=te.ToInteger(e);if(t<=0){return 0}if(t>Number.MAX_SAFE_INTEGER){return Number.MAX_SAFE_INTEGER}return t},SameValue:function(e,t){if(e===t){if(e===0){return 1/e===1/t}return true}return V(e)&&V(t)},SameValueZero:function(e,t){return e===t||V(e)&&V(t)},IsIterable:function(e){return te.TypeIsObject(e)&&(typeof e[Y]!=="undefined"||J(e))},GetIterator:function(e){if(J(e)){return new q(e,"value")}var t=te.GetMethod(e,Y);if(!te.IsCallable(t)){throw new TypeError("value is not an iterable")}var r=te.Call(t,e);if(!te.TypeIsObject(r)){throw new TypeError("bad iterator")}return r},GetMethod:function(e,t){var r=te.ToObject(e)[t];if(r===void 0||r===null){return void 0}if(!te.IsCallable(r)){throw new TypeError("Method not callable: "+t)}return r},IteratorComplete:function(e){return!!e.done},IteratorClose:function(e,t){var r=te.GetMethod(e,"return");if(r===void 0){return}var n,o;try{n=te.Call(r,e)}catch(i){o=i}if(t){return}if(o){throw o}if(!te.TypeIsObject(n)){throw new TypeError("Iterator's return method returned a non-object.")}},IteratorNext:function(e){var t=arguments.length>1?e.next(arguments[1]):e.next();if(!te.TypeIsObject(t)){throw new TypeError("bad iterator")}return t},IteratorStep:function(e){var t=te.IteratorNext(e);var r=te.IteratorComplete(t);return r?false:t},Construct:function(e,t,r,n){var o=typeof r==="undefined"?e:r;if(!n&&Q.construct){return Q.construct(e,t,o)}var i=o.prototype;if(!te.TypeIsObject(i)){i=Object.prototype}var a=m(i);var u=te.Call(e,a,t);return te.TypeIsObject(u)?u:a},SpeciesConstructor:function(e,t){var r=e.constructor;if(r===void 0){return t}if(!te.TypeIsObject(r)){throw new TypeError("Bad constructor")}var n=r[H];if(n===void 0||n===null){return t}if(!te.IsConstructor(n)){throw new TypeError("Bad @@species")}return n},CreateHTML:function(e,t,r,n){var o=te.ToString(e);var i="<"+t;if(r!==""){var a=te.ToString(n);var u=a.replace(/"/g,"&quot;");i+=" "+r+'="'+u+'"'}var f=i+">";var s=f+o;return s+"</"+t+">"},IsRegExp:function IsRegExp(e){if(!te.TypeIsObject(e)){return false}var t=e[W.match];if(typeof t!=="undefined"){return!!t}return K.regex(e)},ToString:function ToString(e){return ee(e)}};if(s&&Z){var re=function defineWellKnownSymbol(e){if(K.symbol(W[e])){return W[e]}var t=W["for"]("Symbol."+e);Object.defineProperty(W,e,{configurable:false,enumerable:false,writable:false,value:t});return t};if(!K.symbol(W.search)){var ne=re("search");var oe=String.prototype.search;h(RegExp.prototype,ne,function search(e){return te.Call(oe,e,[this])});var ie=function search(e){var t=te.RequireObjectCoercible(this);if(e!==null&&typeof e!=="undefined"){var r=te.GetMethod(e,ne);if(typeof r!=="undefined"){return te.Call(r,e,[t])}}return te.Call(oe,t,[te.ToString(e)])};X(String.prototype,"search",ie)}if(!K.symbol(W.replace)){var ae=re("replace");var ue=String.prototype.replace;h(RegExp.prototype,ae,function replace(e,t){return te.Call(ue,e,[this,t])});var fe=function replace(e,t){var r=te.RequireObjectCoercible(this);if(e!==null&&typeof e!=="undefined"){var n=te.GetMethod(e,ae);if(typeof n!=="undefined"){return te.Call(n,e,[r,t])}}return te.Call(ue,r,[te.ToString(e),t])};X(String.prototype,"replace",fe)}if(!K.symbol(W.split)){var se=re("split");var ce=String.prototype.split;h(RegExp.prototype,se,function split(e,t){return te.Call(ce,e,[this,t])});var le=function split(e,t){var r=te.RequireObjectCoercible(this);if(e!==null&&typeof e!=="undefined"){var n=te.GetMethod(e,se);if(typeof n!=="undefined"){return te.Call(n,e,[r,t])}}return te.Call(ce,r,[te.ToString(e),t])};X(String.prototype,"split",le)}var pe=K.symbol(W.match);var ve=pe&&function(){var e={};e[W.match]=function(){return 42};return"a".match(e)!==42}();if(!pe||ve){var ye=re("match");var he=String.prototype.match;h(RegExp.prototype,ye,function match(e){return te.Call(he,e,[this])});var be=function match(e){var t=te.RequireObjectCoercible(this);if(e!==null&&typeof e!=="undefined"){var r=te.GetMethod(e,ye);if(typeof r!=="undefined"){return te.Call(r,e,[t])}}return te.Call(he,t,[te.ToString(e)])};X(String.prototype,"match",be)}}var ge=function wrapConstructor(e,t,r){O.preserveToString(t,e);if(Object.setPrototypeOf){Object.setPrototypeOf(e,t)}if(s){l(Object.getOwnPropertyNames(e),function(n){if(n in G||r[n]){return}O.proxy(e,n,t)})}else{l(Object.keys(e),function(n){if(n in G||r[n]){return}t[n]=e[n]})}t.prototype=e.prototype;O.redefine(e.prototype,"constructor",t)};var de=function(){return this};var Oe=function(e){if(s&&!z(e,H)){O.getter(e,H,de)}};var me=function(e,t){var r=t||function iterator(){return this};h(e,Y,r);if(!e[Y]&&K.symbol(Y)){e[Y]=r}};var we=function createDataProperty(e,t,r){if(s){Object.defineProperty(e,t,{configurable:true,enumerable:true,writable:true,value:r})}else{e[t]=r}};var je=function createDataPropertyOrThrow(e,t,r){we(e,t,r);if(!te.SameValue(e[t],r)){throw new TypeError("property is nonconfigurable")}};var Se=function(e,t,r,n){if(!te.TypeIsObject(e)){throw new TypeError("Constructor requires `new`: "+t.name)}var o=t.prototype;if(!te.TypeIsObject(o)){o=r}var i=m(o);for(var a in n){if(z(n,a)){var u=n[a];h(i,a,u,true)}}return i};if(String.fromCodePoint&&String.fromCodePoint.length!==1){var Te=String.fromCodePoint;X(String,"fromCodePoint",function fromCodePoint(e){return te.Call(Te,this,arguments)})}var Ie={fromCodePoint:function fromCodePoint(e){var t=[];var r;for(var n=0,o=arguments.length;n<o;n++){r=Number(arguments[n]);if(!te.SameValue(r,te.ToInteger(r))||r<0||r>1114111){throw new RangeError("Invalid code point "+r)}if(r<65536){x(t,String.fromCharCode(r))}else{r-=65536;x(t,String.fromCharCode((r>>10)+55296));x(t,String.fromCharCode(r%1024+56320))}}return t.join("")},raw:function raw(e){var t=te.ToObject(e,"bad callSite");var r=te.ToObject(t.raw,"bad raw value");var n=r.length;var o=te.ToLength(n);if(o<=0){return""}var i=[];var a=0;var u,f,s,c;while(a<o){u=te.ToString(a);s=te.ToString(r[u]);x(i,s);if(a+1>=o){break}f=a+1<arguments.length?arguments[a+1]:"";c=te.ToString(f);x(i,c);a+=1}return i.join("")}};if(String.raw&&String.raw({raw:{0:"x",1:"y",length:2}})!=="xy"){X(String,"raw",Ie.raw)}b(String,Ie);var Ee=function repeat(e,t){if(t<1){return""}if(t%2){return repeat(e,t-1)+e}var r=repeat(e,t/2);return r+r};var Pe=Infinity;var Me={repeat:function repeat(e){var t=te.ToString(te.RequireObjectCoercible(this));var r=te.ToInteger(e);if(r<0||r>=Pe){throw new RangeError("repeat count must be less than infinity and not overflow maximum string size")}return Ee(t,r)},startsWith:function startsWith(e){var t=te.ToString(te.RequireObjectCoercible(this));if(te.IsRegExp(e)){throw new TypeError('Cannot call method "startsWith" with a regex')}var r=te.ToString(e);var n;if(arguments.length>1){n=arguments[1]}var o=R(te.ToInteger(n),0);return C(t,o,o+r.length)===r},endsWith:function endsWith(e){var t=te.ToString(te.RequireObjectCoercible(this));if(te.IsRegExp(e)){throw new TypeError('Cannot call method "endsWith" with a regex')}var r=te.ToString(e);var n=t.length;var o;if(arguments.length>1){o=arguments[1]}var i=typeof o==="undefined"?n:te.ToInteger(o);var a=_(R(i,0),n);return C(t,a-r.length,a)===r},includes:function includes(e){if(te.IsRegExp(e)){throw new TypeError('"includes" does not accept a RegExp')}var t=te.ToString(e);var r;if(arguments.length>1){r=arguments[1]}return I(this,t,r)!==-1},codePointAt:function codePointAt(e){var t=te.ToString(te.RequireObjectCoercible(this));var r=te.ToInteger(e);var n=t.length;if(r>=0&&r<n){var o=t.charCodeAt(r);var i=r+1===n;if(o<55296||o>56319||i){return o}var a=t.charCodeAt(r+1);if(a<56320||a>57343){return o}return(o-55296)*1024+(a-56320)+65536}}};if(String.prototype.includes&&"a".includes("a",Infinity)!==false){X(String.prototype,"includes",Me.includes)}if(String.prototype.startsWith&&String.prototype.endsWith){var Ce=i(function(){"/a/".startsWith(/a/)});var xe=a(function(){return"abc".startsWith("a",Infinity)===false});if(!Ce||!xe){X(String.prototype,"startsWith",Me.startsWith);X(String.prototype,"endsWith",Me.endsWith)}}if(Z){var Ne=a(function(){var e=/a/;e[W.match]=false;return"/a/".startsWith(e)});if(!Ne){X(String.prototype,"startsWith",Me.startsWith)}var Ae=a(function(){var e=/a/;e[W.match]=false;return"/a/".endsWith(e)});if(!Ae){X(String.prototype,"endsWith",Me.endsWith)}var Re=a(function(){var e=/a/;e[W.match]=false;return"/a/".includes(e)});if(!Re){X(String.prototype,"includes",Me.includes)}}b(String.prototype,Me);var _e=["	\n\x0B\f\r \xa0\u1680\u180e\u2000\u2001\u2002\u2003","\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028","\u2029\ufeff"].join("");var ke=new RegExp("(^["+_e+"]+)|(["+_e+"]+$)","g");var Fe=function trim(){return te.ToString(te.RequireObjectCoercible(this)).replace(ke,"")};var Le=["\x85","\u200b","\ufffe"].join("");var De=new RegExp("["+Le+"]","g");var ze=/^[\-+]0x[0-9a-f]+$/i;var qe=Le.trim().length!==Le.length;h(String.prototype,"trim",Fe,qe);var Ge=function(e){te.RequireObjectCoercible(e);this._s=te.ToString(e);this._i=0};Ge.prototype.next=function(){var e=this._s,t=this._i;if(typeof e==="undefined"||t>=e.length){this._s=void 0;return{value:void 0,done:true}}var r=e.charCodeAt(t),n,o;if(r<55296||r>56319||t+1===e.length){o=1}else{n=e.charCodeAt(t+1);o=n<56320||n>57343?1:2}this._i=t+o;return{value:e.substr(t,o),done:false}};me(Ge.prototype);me(String.prototype,function(){return new Ge(this)});var We={from:function from(e){var r=this;var n;if(arguments.length>1){n=arguments[1]}var o,i;if(typeof n==="undefined"){o=false}else{if(!te.IsCallable(n)){throw new TypeError("Array.from: when provided, the second argument must be a function")}if(arguments.length>2){i=arguments[2]}o=true}var a=typeof(J(e)||te.GetMethod(e,Y))!=="undefined";var u,f,s;if(a){f=te.IsConstructor(r)?Object(new r):[];var c=te.GetIterator(e);var l,p;s=0;while(true){l=te.IteratorStep(c);if(l===false){break}p=l.value;try{if(o){p=typeof i==="undefined"?n(p,s):t(n,i,p,s)}f[s]=p}catch(v){te.IteratorClose(c,true);throw v}s+=1}u=s}else{var y=te.ToObject(e);u=te.ToLength(y.length);f=te.IsConstructor(r)?Object(new r(u)):new Array(u);var h;for(s=0;s<u;++s){h=y[s];if(o){h=typeof i==="undefined"?n(h,s):t(n,i,h,s)}f[s]=h}}f.length=u;return f},of:function of(){var e=arguments.length;var t=this;var n=r(t)||!te.IsCallable(t)?new Array(e):te.Construct(t,[e]);for(var o=0;o<e;++o){je(n,o,arguments[o])}n.length=e;return n}};b(Array,We);Oe(Array);var He=function(e){return{value:e,done:arguments.length===0}};q=function(e,t){this.i=0;this.array=e;this.kind=t};b(q.prototype,{next:function(){var e=this.i,t=this.array;if(!(this instanceof q)){throw new TypeError("Not an ArrayIterator")}if(typeof t!=="undefined"){var r=te.ToLength(t.length);for(;e<r;e++){var n=this.kind;var o;if(n==="key"){o=e}else if(n==="value"){o=t[e]}else if(n==="entry"){o=[e,t[e]]}this.i=e+1;return{value:o,done:false}}}this.array=void 0;return{value:void 0,done:true}}});me(q.prototype);var Ve=function orderKeys(e,t){var r=String(te.ToInteger(e))===e;var n=String(te.ToInteger(t))===t;if(r&&n){return t-e}else if(r&&!n){return-1}else if(!r&&n){return 1}else{return e.localeCompare(t)}};var Be=function getAllKeys(e){var t=[];var r=[];for(var n in e){x(z(e,n)?t:r,n)}M(t,Ve);M(r,Ve);return P(t,r)};var $e=Array.of===We.of||function(){var e=function Foo(e){this.length=e};e.prototype=[];var t=Array.of.apply(e,[1,2]);return t instanceof e&&t.length===2}();if(!$e){X(Array,"of",We.of)}var Ue={copyWithin:function copyWithin(e,t){var r=te.ToObject(this);var n=te.ToLength(r.length);var o=te.ToInteger(e);var i=te.ToInteger(t);var a=o<0?R(n+o,0):_(o,n);var u=i<0?R(n+i,0):_(i,n);var f;if(arguments.length>2){f=arguments[2]}var s=typeof f==="undefined"?n:te.ToInteger(f);var c=s<0?R(n+s,0):_(s,n);var l=_(c-u,n-a);var p=1;if(u<a&&a<u+l){p=-1;u+=l-1;a+=l-1}while(l>0){if(u in r){r[a]=r[u]}else{delete r[a]}u+=p;a+=p;l-=1}return r},fill:function fill(e){var t;if(arguments.length>1){t=arguments[1]}var r;if(arguments.length>2){r=arguments[2]}var n=te.ToObject(this);var o=te.ToLength(n.length);t=te.ToInteger(typeof t==="undefined"?0:t);r=te.ToInteger(typeof r==="undefined"?o:r);var i=t<0?R(o+t,0):_(t,o);var a=r<0?o+r:r;for(var u=i;u<o&&u<a;++u){n[u]=e}return n},find:function find(e){var r=te.ToObject(this);var n=te.ToLength(r.length);if(!te.IsCallable(e)){throw new TypeError("Array#find: predicate must be a function")}var o=arguments.length>1?arguments[1]:null;for(var i=0,a;i<n;i++){a=r[i];if(o){if(t(e,o,a,i,r)){return a}}else if(e(a,i,r)){return a}}},findIndex:function findIndex(e){var r=te.ToObject(this);var n=te.ToLength(r.length);if(!te.IsCallable(e)){throw new TypeError("Array#findIndex: predicate must be a function")}var o=arguments.length>1?arguments[1]:null;for(var i=0;i<n;i++){if(o){if(t(e,o,r[i],i,r)){return i}}else if(e(r[i],i,r)){return i}}return-1},keys:function keys(){return new q(this,"key")},values:function values(){return new q(this,"value")},entries:function entries(){return new q(this,"entry")}};if(Array.prototype.keys&&!te.IsCallable([1].keys().next)){delete Array.prototype.keys}if(Array.prototype.entries&&!te.IsCallable([1].entries().next)){delete Array.prototype.entries}if(Array.prototype.keys&&Array.prototype.entries&&!Array.prototype.values&&Array.prototype[Y]){b(Array.prototype,{values:Array.prototype[Y]});if(K.symbol(W.unscopables)){Array.prototype[W.unscopables].values=true}}if(c&&Array.prototype.values&&Array.prototype.values.name!=="values"){var Je=Array.prototype.values;X(Array.prototype,"values",function values(){return te.Call(Je,this,arguments)});h(Array.prototype,Y,Array.prototype.values,true)}b(Array.prototype,Ue);if(1/[true].indexOf(true,-0)<0){h(Array.prototype,"indexOf",function indexOf(e){var t=E(this,arguments);if(t===0&&1/t<0){return 0}return t},true)}me(Array.prototype,function(){return this.values()});if(Object.getPrototypeOf){me(Object.getPrototypeOf([].values()))}var Ke=function(){return a(function(){return Array.from({length:-1}).length===0})}();var Xe=function(){var e=Array.from([0].entries());return e.length===1&&r(e[0])&&e[0][0]===0&&e[0][1]===0}();if(!Ke||!Xe){X(Array,"from",We.from)}var Ze=function(){return a(function(){return Array.from([0],void 0)})}();if(!Ze){var Ye=Array.from;X(Array,"from",function from(e){if(arguments.length>1&&typeof arguments[1]!=="undefined"){return te.Call(Ye,this,arguments)}else{return t(Ye,this,e)}})}var Qe=-(Math.pow(2,32)-1);var et=function(e,r){var n={length:Qe};n[r?(n.length>>>0)-1:0]=true;return a(function(){t(e,n,function(){throw new RangeError("should not reach here")},[]);return true})};if(!et(Array.prototype.forEach)){var tt=Array.prototype.forEach;X(Array.prototype,"forEach",function forEach(e){return te.Call(tt,this.length>=0?this:[],arguments)},true)}if(!et(Array.prototype.map)){var rt=Array.prototype.map;X(Array.prototype,"map",function map(e){return te.Call(rt,this.length>=0?this:[],arguments)},true)}if(!et(Array.prototype.filter)){var nt=Array.prototype.filter;X(Array.prototype,"filter",function filter(e){return te.Call(nt,this.length>=0?this:[],arguments)},true)}if(!et(Array.prototype.some)){var ot=Array.prototype.some;X(Array.prototype,"some",function some(e){return te.Call(ot,this.length>=0?this:[],arguments)},true)}if(!et(Array.prototype.every)){var it=Array.prototype.every;X(Array.prototype,"every",function every(e){return te.Call(it,this.length>=0?this:[],arguments)},true)}if(!et(Array.prototype.reduce)){var at=Array.prototype.reduce;X(Array.prototype,"reduce",function reduce(e){return te.Call(at,this.length>=0?this:[],arguments)},true)}if(!et(Array.prototype.reduceRight,true)){var ut=Array.prototype.reduceRight;X(Array.prototype,"reduceRight",function reduceRight(e){return te.Call(ut,this.length>=0?this:[],arguments)},true)}var ft=Number("0o10")!==8;var st=Number("0b10")!==2;var ct=y(Le,function(e){return Number(e+0+e)===0});if(ft||st||ct){var lt=Number;var pt=/^0b[01]+$/i;var vt=/^0o[0-7]+$/i;var yt=pt.test.bind(pt);var ht=vt.test.bind(vt);var bt=function(e){var t;if(typeof e.valueOf==="function"){t=e.valueOf();if(K.primitive(t)){return t}}if(typeof e.toString==="function"){t=e.toString();if(K.primitive(t)){return t}}throw new TypeError("No default value")};var gt=De.test.bind(De);var dt=ze.test.bind(ze);var Ot=function(){var e=function Number(t){var r;if(arguments.length>0){r=K.primitive(t)?t:bt(t,"number")}else{r=0}if(typeof r==="string"){r=te.Call(Fe,r);if(yt(r)){r=parseInt(C(r,2),2)}else if(ht(r)){r=parseInt(C(r,2),8)}else if(gt(r)||dt(r)){r=NaN}}var n=this;var o=a(function(){lt.prototype.valueOf.call(n);return true});if(n instanceof e&&!o){return new lt(r)}return lt(r)};return e}();ge(lt,Ot,{});b(Ot,{NaN:lt.NaN,MAX_VALUE:lt.MAX_VALUE,MIN_VALUE:lt.MIN_VALUE,NEGATIVE_INFINITY:lt.NEGATIVE_INFINITY,POSITIVE_INFINITY:lt.POSITIVE_INFINITY});Number=Ot;O.redefine(S,"Number",Ot)}var mt=Math.pow(2,53)-1;b(Number,{MAX_SAFE_INTEGER:mt,MIN_SAFE_INTEGER:-mt,EPSILON:2.220446049250313e-16,parseInt:S.parseInt,parseFloat:S.parseFloat,isFinite:B,isInteger:function isInteger(e){return B(e)&&te.ToInteger(e)===e},isSafeInteger:function isSafeInteger(e){return Number.isInteger(e)&&F(e)<=Number.MAX_SAFE_INTEGER},isNaN:V});h(Number,"parseInt",S.parseInt,Number.parseInt!==S.parseInt);if(![,1].find(function(e,t){return t===0})){X(Array.prototype,"find",Ue.find)}if([,1].findIndex(function(e,t){return t===0})!==0){X(Array.prototype,"findIndex",Ue.findIndex)}var wt=Function.bind.call(Function.bind,Object.prototype.propertyIsEnumerable);var jt=function ensureEnumerable(e,t){if(s&&wt(e,t)){Object.defineProperty(e,t,{enumerable:false})}};var St=function sliceArgs(){var e=Number(this);var t=arguments.length;var r=t-e;var n=new Array(r<0?0:r);for(var o=e;o<t;++o){n[o-e]=arguments[o]}return n};var Tt=function assignTo(e){return function assignToSource(t,r){t[r]=e[r];return t}};var It=function(e,t){var r=n(Object(t));var o;if(te.IsCallable(Object.getOwnPropertySymbols)){o=v(Object.getOwnPropertySymbols(Object(t)),wt(t))}return p(P(r,o||[]),Tt(t),e)};var Et={assign:function(e,t){var r=te.ToObject(e,"Cannot convert undefined or null to object");return p(te.Call(St,1,arguments),It,r)},is:function is(e,t){return te.SameValue(e,t)}};var Pt=Object.assign&&Object.preventExtensions&&function(){var e=Object.preventExtensions({1:2});try{Object.assign(e,"xy")}catch(t){return e[1]==="y"}}();if(Pt){X(Object,"assign",Et.assign)}b(Object,Et);if(s){var Mt={setPrototypeOf:function(e,r){var n;var o=function(e,t){if(!te.TypeIsObject(e)){throw new TypeError("cannot set prototype on a non-object")}if(!(t===null||te.TypeIsObject(t))){throw new TypeError("can only set prototype to an object or null"+t)}};var i=function(e,r){o(e,r);t(n,e,r);return e};try{n=e.getOwnPropertyDescriptor(e.prototype,r).set;t(n,{},null)}catch(a){if(e.prototype!=={}[r]){return}n=function(e){this[r]=e};i.polyfill=i(i({},null),e.prototype)instanceof e}return i}(Object,"__proto__")};b(Object,Mt)}if(Object.setPrototypeOf&&Object.getPrototypeOf&&Object.getPrototypeOf(Object.setPrototypeOf({},null))!==null&&Object.getPrototypeOf(Object.create(null))===null){(function(){var e=Object.create(null);var t=Object.getPrototypeOf,r=Object.setPrototypeOf;Object.getPrototypeOf=function(r){var n=t(r);return n===e?null:n};Object.setPrototypeOf=function(t,n){var o=n===null?e:n;return r(t,o)};Object.setPrototypeOf.polyfill=false})()}var Ct=!i(function(){Object.keys("foo")});if(!Ct){var xt=Object.keys;X(Object,"keys",function keys(e){return xt(te.ToObject(e))});n=Object.keys}var Nt=i(function(){Object.keys(/a/g)});if(Nt){var At=Object.keys;X(Object,"keys",function keys(e){if(K.regex(e)){var t=[];for(var r in e){if(z(e,r)){x(t,r)}}return t}return At(e)});n=Object.keys}if(Object.getOwnPropertyNames){var Rt=!i(function(){Object.getOwnPropertyNames("foo")});if(!Rt){var _t=typeof window==="object"?Object.getOwnPropertyNames(window):[];var kt=Object.getOwnPropertyNames;X(Object,"getOwnPropertyNames",function getOwnPropertyNames(e){var t=te.ToObject(e);if(g(t)==="[object Window]"){try{return kt(t)}catch(r){return P([],_t)}}return kt(t)})}}if(Object.getOwnPropertyDescriptor){var Ft=!i(function(){Object.getOwnPropertyDescriptor("foo","bar")});if(!Ft){var Lt=Object.getOwnPropertyDescriptor;X(Object,"getOwnPropertyDescriptor",function getOwnPropertyDescriptor(e,t){return Lt(te.ToObject(e),t)})}}if(Object.seal){var Dt=!i(function(){Object.seal("foo")});if(!Dt){var zt=Object.seal;X(Object,"seal",function seal(e){if(!K.object(e)){return e}return zt(e)})}}if(Object.isSealed){var qt=!i(function(){Object.isSealed("foo")});if(!qt){var Gt=Object.isSealed;X(Object,"isSealed",function isSealed(e){if(!K.object(e)){return true}return Gt(e)})}}if(Object.freeze){var Wt=!i(function(){Object.freeze("foo")});if(!Wt){var Ht=Object.freeze;X(Object,"freeze",function freeze(e){if(!K.object(e)){return e}return Ht(e)})}}if(Object.isFrozen){var Vt=!i(function(){Object.isFrozen("foo")});if(!Vt){var Bt=Object.isFrozen;X(Object,"isFrozen",function isFrozen(e){if(!K.object(e)){return true}return Bt(e)})}}if(Object.preventExtensions){var $t=!i(function(){Object.preventExtensions("foo")});if(!$t){var Ut=Object.preventExtensions;X(Object,"preventExtensions",function preventExtensions(e){if(!K.object(e)){return e}return Ut(e)})}}if(Object.isExtensible){var Jt=!i(function(){Object.isExtensible("foo")});if(!Jt){var Kt=Object.isExtensible;X(Object,"isExtensible",function isExtensible(e){if(!K.object(e)){return false}return Kt(e)})}}if(Object.getPrototypeOf){var Xt=!i(function(){Object.getPrototypeOf("foo")});if(!Xt){var Zt=Object.getPrototypeOf;X(Object,"getPrototypeOf",function getPrototypeOf(e){return Zt(te.ToObject(e))})}}var Yt=s&&function(){var e=Object.getOwnPropertyDescriptor(RegExp.prototype,"flags");return e&&te.IsCallable(e.get)}();if(s&&!Yt){var Qt=function flags(){if(!te.TypeIsObject(this)){throw new TypeError("Method called on incompatible type: must be an object.")}var e="";if(this.global){e+="g"}if(this.ignoreCase){e+="i"}if(this.multiline){e+="m"}if(this.unicode){e+="u"}if(this.sticky){e+="y"}return e};O.getter(RegExp.prototype,"flags",Qt)}var er=s&&a(function(){return String(new RegExp(/a/g,"i"))==="/a/i"});var tr=Z&&s&&function(){var e=/./;e[W.match]=false;return RegExp(e)===e}();var rr=a(function(){return RegExp.prototype.toString.call({source:"abc"})==="/abc/"});var nr=rr&&a(function(){return RegExp.prototype.toString.call({source:"a",flags:"b"})==="/a/b"});if(!rr||!nr){var or=RegExp.prototype.toString;h(RegExp.prototype,"toString",function toString(){var e=te.RequireObjectCoercible(this);if(K.regex(e)){return t(or,e)}var r=ee(e.source);var n=ee(e.flags);return"/"+r+"/"+n},true);O.preserveToString(RegExp.prototype.toString,or)}if(s&&(!er||tr)){var ir=Object.getOwnPropertyDescriptor(RegExp.prototype,"flags").get;var ar=Object.getOwnPropertyDescriptor(RegExp.prototype,"source")||{};var ur=function(){return this.source};var fr=te.IsCallable(ar.get)?ar.get:ur;var sr=RegExp;var cr=function(){return function RegExp(e,t){var r=te.IsRegExp(e);var n=this instanceof RegExp;if(!n&&r&&typeof t==="undefined"&&e.constructor===RegExp){return e}var o=e;var i=t;if(K.regex(e)){o=te.Call(fr,e);i=typeof t==="undefined"?te.Call(ir,e):t;return new RegExp(o,i)}else if(r){o=e.source;i=typeof t==="undefined"?e.flags:t}return new sr(e,t)}}();ge(sr,cr,{$input:true});RegExp=cr;O.redefine(S,"RegExp",cr)}if(s){var lr={input:"$_",lastMatch:"$&",lastParen:"$+",leftContext:"$`",rightContext:"$'"};l(n(lr),function(e){if(e in RegExp&&!(lr[e]in RegExp)){O.getter(RegExp,lr[e],function get(){return RegExp[e]})}})}Oe(RegExp);var pr=1/Number.EPSILON;var vr=function roundTiesToEven(e){return e+pr-pr};var yr=Math.pow(2,-23);var hr=Math.pow(2,127)*(2-yr);var br=Math.pow(2,-126);var gr=Number.prototype.clz;delete Number.prototype.clz;var dr={acosh:function acosh(e){var t=Number(e);if(Number.isNaN(t)||e<1){return NaN}if(t===1){return 0}if(t===Infinity){return t}return L(t/Math.E+D(t+1)*D(t-1)/Math.E)+1},asinh:function asinh(e){var t=Number(e);if(t===0||!T(t)){return t}return t<0?-Math.asinh(-t):L(t+D(t*t+1))},atanh:function atanh(e){var t=Number(e);if(Number.isNaN(t)||t<-1||t>1){return NaN}if(t===-1){return-Infinity}if(t===1){return Infinity}if(t===0){return t}return.5*L((1+t)/(1-t))},cbrt:function cbrt(e){var t=Number(e);if(t===0){return t}var r=t<0,n;if(r){t=-t}if(t===Infinity){n=Infinity}else{n=Math.exp(L(t)/3);n=(t/(n*n)+2*n)/3}return r?-n:n},clz32:function clz32(e){var t=Number(e);var r=te.ToUint32(t);if(r===0){return 32}return gr?te.Call(gr,r):31-k(L(r+.5)*Math.LOG2E)},cosh:function cosh(e){var t=Number(e);if(t===0){return 1}if(Number.isNaN(t)){return NaN}if(!T(t)){return Infinity}if(t<0){t=-t}if(t>21){return Math.exp(t)/2}return(Math.exp(t)+Math.exp(-t))/2},expm1:function expm1(e){var t=Number(e);if(t===-Infinity){return-1}if(!T(t)||t===0){return t}if(F(t)>.5){return Math.exp(t)-1}var r=t;var n=0;var o=1;while(n+r!==n){n+=r;o+=1;r*=t/o}return n},hypot:function hypot(e,t){var r=0;var n=0;for(var o=0;o<arguments.length;++o){var i=F(Number(arguments[o]));if(n<i){r*=n/i*(n/i);r+=1;n=i}else{r+=i>0?i/n*(i/n):i}}return n===Infinity?Infinity:n*D(r)},log2:function log2(e){return L(e)*Math.LOG2E},log10:function log10(e){return L(e)*Math.LOG10E},log1p:function log1p(e){var t=Number(e);if(t<-1||Number.isNaN(t)){return NaN}if(t===0||t===Infinity){return t}if(t===-1){return-Infinity}return 1+t-1===0?t:t*(L(1+t)/(1+t-1))},sign:function sign(e){var t=Number(e);if(t===0){return t}if(Number.isNaN(t)){return t}return t<0?-1:1},sinh:function sinh(e){var t=Number(e);if(!T(t)||t===0){return t}if(F(t)<1){return(Math.expm1(t)-Math.expm1(-t))/2}return(Math.exp(t-1)-Math.exp(-t-1))*Math.E/2},tanh:function tanh(e){var t=Number(e);if(Number.isNaN(t)||t===0){return t}if(t>=20){return 1}if(t<=-20){return-1}var r=Math.expm1(t);var n=Math.expm1(-t);if(r===Infinity){return 1}if(n===Infinity){return-1}return(r-n)/(Math.exp(t)+Math.exp(-t))},trunc:function trunc(e){var t=Number(e);return t<0?-k(-t):k(t)},imul:function imul(e,t){var r=te.ToUint32(e);var n=te.ToUint32(t);var o=r>>>16&65535;var i=r&65535;var a=n>>>16&65535;var u=n&65535;return i*u+(o*u+i*a<<16>>>0)|0},fround:function fround(e){var t=Number(e);if(t===0||t===Infinity||t===-Infinity||V(t)){return t}var r=Math.sign(t);var n=F(t);if(n<br){return r*vr(n/br/yr)*br*yr}var o=(1+yr/Number.EPSILON)*n;var i=o-(o-n);if(i>hr||V(i)){return r*Infinity}return r*i}};b(Math,dr);h(Math,"log1p",dr.log1p,Math.log1p(-1e-17)!==-1e-17);h(Math,"asinh",dr.asinh,Math.asinh(-1e7)!==-Math.asinh(1e7));h(Math,"tanh",dr.tanh,Math.tanh(-2e-17)!==-2e-17);h(Math,"acosh",dr.acosh,Math.acosh(Number.MAX_VALUE)===Infinity);h(Math,"cbrt",dr.cbrt,Math.abs(1-Math.cbrt(1e-300)/1e-100)/Number.EPSILON>8);h(Math,"sinh",dr.sinh,Math.sinh(-2e-17)!==-2e-17);var Or=Math.expm1(10);h(Math,"expm1",dr.expm1,Or>22025.465794806718||Or<22025.465794806718);
var mr=Math.round;var wr=Math.round(.5-Number.EPSILON/4)===0&&Math.round(-.5+Number.EPSILON/3.99)===1;var jr=pr+1;var Sr=2*pr-1;var Tr=[jr,Sr].every(function(e){return Math.round(e)===e});h(Math,"round",function round(e){var t=k(e);var r=t===-1?-0:t+1;return e-t<.5?t:r},!wr||!Tr);O.preserveToString(Math.round,mr);var Ir=Math.imul;if(Math.imul(4294967295,5)!==-5){Math.imul=dr.imul;O.preserveToString(Math.imul,Ir)}if(Math.imul.length!==2){X(Math,"imul",function imul(e,t){return te.Call(Ir,Math,arguments)})}var Er=function(){var e=S.setTimeout;if(typeof e!=="function"&&typeof e!=="object"){return}te.IsPromise=function(e){if(!te.TypeIsObject(e)){return false}if(typeof e._promise==="undefined"){return false}return true};var r=function(e){if(!te.IsConstructor(e)){throw new TypeError("Bad promise constructor")}var t=this;var r=function(e,r){if(t.resolve!==void 0||t.reject!==void 0){throw new TypeError("Bad Promise implementation!")}t.resolve=e;t.reject=r};t.resolve=void 0;t.reject=void 0;t.promise=new e(r);if(!(te.IsCallable(t.resolve)&&te.IsCallable(t.reject))){throw new TypeError("Bad promise constructor")}};var n;if(typeof window!=="undefined"&&te.IsCallable(window.postMessage)){n=function(){var e=[];var t="zero-timeout-message";var r=function(r){x(e,r);window.postMessage(t,"*")};var n=function(r){if(r.source===window&&r.data===t){r.stopPropagation();if(e.length===0){return}var n=A(e);n()}};window.addEventListener("message",n,true);return r}}var o=function(){var e=S.Promise;var t=e&&e.resolve&&e.resolve();return t&&function(e){return t.then(e)}};var i=te.IsCallable(S.setImmediate)?S.setImmediate:typeof process==="object"&&process.nextTick?process.nextTick:o()||(te.IsCallable(n)?n():function(t){e(t,0)});var a=function(e){return e};var u=function(e){throw e};var f=0;var s=1;var c=2;var l=0;var p=1;var v=2;var y={};var h=function(e,t,r){i(function(){g(e,t,r)})};var g=function(e,t,r){var n,o;if(t===y){return e(r)}try{n=e(r);o=t.resolve}catch(i){n=i;o=t.reject}o(n)};var d=function(e,t){var r=e._promise;var n=r.reactionLength;if(n>0){h(r.fulfillReactionHandler0,r.reactionCapability0,t);r.fulfillReactionHandler0=void 0;r.rejectReactions0=void 0;r.reactionCapability0=void 0;if(n>1){for(var o=1,i=0;o<n;o++,i+=3){h(r[i+l],r[i+v],t);e[i+l]=void 0;e[i+p]=void 0;e[i+v]=void 0}}}r.result=t;r.state=s;r.reactionLength=0};var O=function(e,t){var r=e._promise;var n=r.reactionLength;if(n>0){h(r.rejectReactionHandler0,r.reactionCapability0,t);r.fulfillReactionHandler0=void 0;r.rejectReactions0=void 0;r.reactionCapability0=void 0;if(n>1){for(var o=1,i=0;o<n;o++,i+=3){h(r[i+p],r[i+v],t);e[i+l]=void 0;e[i+p]=void 0;e[i+v]=void 0}}}r.result=t;r.state=c;r.reactionLength=0};var m=function(e){var t=false;var r=function(r){var n;if(t){return}t=true;if(r===e){return O(e,new TypeError("Self resolution"))}if(!te.TypeIsObject(r)){return d(e,r)}try{n=r.then}catch(o){return O(e,o)}if(!te.IsCallable(n)){return d(e,r)}i(function(){j(e,r,n)})};var n=function(r){if(t){return}t=true;return O(e,r)};return{resolve:r,reject:n}};var w=function(e,r,n,o){if(e===I){t(e,r,n,o,y)}else{t(e,r,n,o)}};var j=function(e,t,r){var n=m(e);var o=n.resolve;var i=n.reject;try{w(r,t,o,i)}catch(a){i(a)}};var T,I;var E=function(){var e=function Promise(t){if(!(this instanceof e)){throw new TypeError('Constructor Promise requires "new"')}if(this&&this._promise){throw new TypeError("Bad construction")}if(!te.IsCallable(t)){throw new TypeError("not a valid resolver")}var r=Se(this,e,T,{_promise:{result:void 0,state:f,reactionLength:0,fulfillReactionHandler0:void 0,rejectReactionHandler0:void 0,reactionCapability0:void 0}});var n=m(r);var o=n.reject;try{t(n.resolve,o)}catch(i){o(i)}return r};return e}();T=E.prototype;var P=function(e,t,r,n){var o=false;return function(i){if(o){return}o=true;t[e]=i;if(--n.count===0){var a=r.resolve;a(t)}}};var M=function(e,t,r){var n=e.iterator;var o=[],i={count:1},a,u;var f=0;while(true){try{a=te.IteratorStep(n);if(a===false){e.done=true;break}u=a.value}catch(s){e.done=true;throw s}o[f]=void 0;var c=t.resolve(u);var l=P(f,o,r,i);i.count+=1;w(c.then,c,l,r.reject);f+=1}if(--i.count===0){var p=r.resolve;p(o)}return r.promise};var C=function(e,t,r){var n=e.iterator,o,i,a;while(true){try{o=te.IteratorStep(n);if(o===false){e.done=true;break}i=o.value}catch(u){e.done=true;throw u}a=t.resolve(i);w(a.then,a,r.resolve,r.reject)}return r.promise};b(E,{all:function all(e){var t=this;if(!te.TypeIsObject(t)){throw new TypeError("Promise is not object")}var n=new r(t);var o,i;try{o=te.GetIterator(e);i={iterator:o,done:false};return M(i,t,n)}catch(a){var u=a;if(i&&!i.done){try{te.IteratorClose(o,true)}catch(f){u=f}}var s=n.reject;s(u);return n.promise}},race:function race(e){var t=this;if(!te.TypeIsObject(t)){throw new TypeError("Promise is not object")}var n=new r(t);var o,i;try{o=te.GetIterator(e);i={iterator:o,done:false};return C(i,t,n)}catch(a){var u=a;if(i&&!i.done){try{te.IteratorClose(o,true)}catch(f){u=f}}var s=n.reject;s(u);return n.promise}},reject:function reject(e){var t=this;if(!te.TypeIsObject(t)){throw new TypeError("Bad promise constructor")}var n=new r(t);var o=n.reject;o(e);return n.promise},resolve:function resolve(e){var t=this;if(!te.TypeIsObject(t)){throw new TypeError("Bad promise constructor")}if(te.IsPromise(e)){var n=e.constructor;if(n===t){return e}}var o=new r(t);var i=o.resolve;i(e);return o.promise}});b(T,{"catch":function(e){return this.then(null,e)},then:function then(e,t){var n=this;if(!te.IsPromise(n)){throw new TypeError("not a promise")}var o=te.SpeciesConstructor(n,E);var i;var b=arguments.length>2&&arguments[2]===y;if(b&&o===E){i=y}else{i=new r(o)}var g=te.IsCallable(e)?e:a;var d=te.IsCallable(t)?t:u;var O=n._promise;var m;if(O.state===f){if(O.reactionLength===0){O.fulfillReactionHandler0=g;O.rejectReactionHandler0=d;O.reactionCapability0=i}else{var w=3*(O.reactionLength-1);O[w+l]=g;O[w+p]=d;O[w+v]=i}O.reactionLength+=1}else if(O.state===s){m=O.result;h(g,i,m)}else if(O.state===c){m=O.result;h(d,i,m)}else{throw new TypeError("unexpected Promise state")}return i.promise}});y=new r(E);I=T.then;return E}();if(S.Promise){delete S.Promise.accept;delete S.Promise.defer;delete S.Promise.prototype.chain}if(typeof Er==="function"){b(S,{Promise:Er});var Pr=w(S.Promise,function(e){return e.resolve(42).then(function(){})instanceof e});var Mr=!i(function(){S.Promise.reject(42).then(null,5).then(null,G)});var Cr=i(function(){S.Promise.call(3,G)});var xr=function(e){var t=e.resolve(5);t.constructor={};var r=e.resolve(t);try{r.then(null,G).then(null,G)}catch(n){return true}return t===r}(S.Promise);var Nr=s&&function(){var e=0;var t=Object.defineProperty({},"then",{get:function(){e+=1}});Promise.resolve(t);return e===1}();var Ar=function BadResolverPromise(e){var t=new Promise(e);e(3,function(){});this.then=t.then;this.constructor=BadResolverPromise};Ar.prototype=Promise.prototype;Ar.all=Promise.all;var Rr=a(function(){return!!Ar.all([1,2])});if(!Pr||!Mr||!Cr||xr||!Nr||Rr){Promise=Er;X(S,"Promise",Er)}if(Promise.all.length!==1){var _r=Promise.all;X(Promise,"all",function all(e){return te.Call(_r,this,arguments)})}if(Promise.race.length!==1){var kr=Promise.race;X(Promise,"race",function race(e){return te.Call(kr,this,arguments)})}if(Promise.resolve.length!==1){var Fr=Promise.resolve;X(Promise,"resolve",function resolve(e){return te.Call(Fr,this,arguments)})}if(Promise.reject.length!==1){var Lr=Promise.reject;X(Promise,"reject",function reject(e){return te.Call(Lr,this,arguments)})}jt(Promise,"all");jt(Promise,"race");jt(Promise,"resolve");jt(Promise,"reject");Oe(Promise)}var Dr=function(e){var t=n(p(e,function(e,t){e[t]=true;return e},{}));return e.join(":")===t.join(":")};var zr=Dr(["z","a","bb"]);var qr=Dr(["z",1,"a","3",2]);if(s){var Gr=function fastkey(e){if(!zr){return null}if(typeof e==="undefined"||e===null){return"^"+te.ToString(e)}else if(typeof e==="string"){return"$"+e}else if(typeof e==="number"){if(!qr){return"n"+e}return e}else if(typeof e==="boolean"){return"b"+e}return null};var Wr=function emptyObject(){return Object.create?Object.create(null):{}};var Hr=function addIterableToMap(e,n,o){if(r(o)||K.string(o)){l(o,function(e){if(!te.TypeIsObject(e)){throw new TypeError("Iterator value "+e+" is not an entry object")}n.set(e[0],e[1])})}else if(o instanceof e){t(e.prototype.forEach,o,function(e,t){n.set(t,e)})}else{var i,a;if(o!==null&&typeof o!=="undefined"){a=n.set;if(!te.IsCallable(a)){throw new TypeError("bad map")}i=te.GetIterator(o)}if(typeof i!=="undefined"){while(true){var u=te.IteratorStep(i);if(u===false){break}var f=u.value;try{if(!te.TypeIsObject(f)){throw new TypeError("Iterator value "+f+" is not an entry object")}t(a,n,f[0],f[1])}catch(s){te.IteratorClose(i,true);throw s}}}}};var Vr=function addIterableToSet(e,n,o){if(r(o)||K.string(o)){l(o,function(e){n.add(e)})}else if(o instanceof e){t(e.prototype.forEach,o,function(e){n.add(e)})}else{var i,a;if(o!==null&&typeof o!=="undefined"){a=n.add;if(!te.IsCallable(a)){throw new TypeError("bad set")}i=te.GetIterator(o)}if(typeof i!=="undefined"){while(true){var u=te.IteratorStep(i);if(u===false){break}var f=u.value;try{t(a,n,f)}catch(s){te.IteratorClose(i,true);throw s}}}}};var Br={Map:function(){var e={};var r=function MapEntry(e,t){this.key=e;this.value=t;this.next=null;this.prev=null};r.prototype.isRemoved=function isRemoved(){return this.key===e};var n=function isMap(e){return!!e._es6map};var o=function requireMapSlot(e,t){if(!te.TypeIsObject(e)||!n(e)){throw new TypeError("Method Map.prototype."+t+" called on incompatible receiver "+te.ToString(e))}};var i=function MapIterator(e,t){o(e,"[[MapIterator]]");this.head=e._head;this.i=this.head;this.kind=t};i.prototype={next:function next(){var e=this.i,t=this.kind,r=this.head,n;if(typeof this.i==="undefined"){return{value:void 0,done:true}}while(e.isRemoved()&&e!==r){e=e.prev}while(e.next!==r){e=e.next;if(!e.isRemoved()){if(t==="key"){n=e.key}else if(t==="value"){n=e.value}else{n=[e.key,e.value]}this.i=e;return{value:n,done:false}}}this.i=void 0;return{value:void 0,done:true}}};me(i.prototype);var a;var u=function Map(){if(!(this instanceof Map)){throw new TypeError('Constructor Map requires "new"')}if(this&&this._es6map){throw new TypeError("Bad construction")}var e=Se(this,Map,a,{_es6map:true,_head:null,_storage:Wr(),_size:0});var t=new r(null,null);t.next=t.prev=t;e._head=t;if(arguments.length>0){Hr(Map,e,arguments[0])}return e};a=u.prototype;O.getter(a,"size",function(){if(typeof this._size==="undefined"){throw new TypeError("size method called on incompatible Map")}return this._size});b(a,{get:function get(e){o(this,"get");var t=Gr(e);if(t!==null){var r=this._storage[t];if(r){return r.value}else{return}}var n=this._head,i=n;while((i=i.next)!==n){if(te.SameValueZero(i.key,e)){return i.value}}},has:function has(e){o(this,"has");var t=Gr(e);if(t!==null){return typeof this._storage[t]!=="undefined"}var r=this._head,n=r;while((n=n.next)!==r){if(te.SameValueZero(n.key,e)){return true}}return false},set:function set(e,t){o(this,"set");var n=this._head,i=n,a;var u=Gr(e);if(u!==null){if(typeof this._storage[u]!=="undefined"){this._storage[u].value=t;return this}else{a=this._storage[u]=new r(e,t);i=n.prev}}while((i=i.next)!==n){if(te.SameValueZero(i.key,e)){i.value=t;return this}}a=a||new r(e,t);if(te.SameValue(-0,e)){a.key=+0}a.next=this._head;a.prev=this._head.prev;a.prev.next=a;a.next.prev=a;this._size+=1;return this},"delete":function(t){o(this,"delete");var r=this._head,n=r;var i=Gr(t);if(i!==null){if(typeof this._storage[i]==="undefined"){return false}n=this._storage[i].prev;delete this._storage[i]}while((n=n.next)!==r){if(te.SameValueZero(n.key,t)){n.key=n.value=e;n.prev.next=n.next;n.next.prev=n.prev;this._size-=1;return true}}return false},clear:function clear(){o(this,"clear");this._size=0;this._storage=Wr();var t=this._head,r=t,n=r.next;while((r=n)!==t){r.key=r.value=e;n=r.next;r.next=r.prev=t}t.next=t.prev=t},keys:function keys(){o(this,"keys");return new i(this,"key")},values:function values(){o(this,"values");return new i(this,"value")},entries:function entries(){o(this,"entries");return new i(this,"key+value")},forEach:function forEach(e){o(this,"forEach");var r=arguments.length>1?arguments[1]:null;var n=this.entries();for(var i=n.next();!i.done;i=n.next()){if(r){t(e,r,i.value[1],i.value[0],this)}else{e(i.value[1],i.value[0],this)}}}});me(a,a.entries);return u}(),Set:function(){var e=function isSet(e){return e._es6set&&typeof e._storage!=="undefined"};var r=function requireSetSlot(t,r){if(!te.TypeIsObject(t)||!e(t)){throw new TypeError("Set.prototype."+r+" called on incompatible receiver "+te.ToString(t))}};var o;var i=function Set(){if(!(this instanceof Set)){throw new TypeError('Constructor Set requires "new"')}if(this&&this._es6set){throw new TypeError("Bad construction")}var e=Se(this,Set,o,{_es6set:true,"[[SetData]]":null,_storage:Wr()});if(!e._es6set){throw new TypeError("bad set")}if(arguments.length>0){Vr(Set,e,arguments[0])}return e};o=i.prototype;var a=function(e){var t=e;if(t==="^null"){return null}else if(t==="^undefined"){return void 0}else{var r=t.charAt(0);if(r==="$"){return C(t,1)}else if(r==="n"){return+C(t,1)}else if(r==="b"){return t==="btrue"}}return+t};var u=function ensureMap(e){if(!e["[[SetData]]"]){var t=e["[[SetData]]"]=new Br.Map;l(n(e._storage),function(e){var r=a(e);t.set(r,r)});e["[[SetData]]"]=t}e._storage=null};O.getter(i.prototype,"size",function(){r(this,"size");if(this._storage){return n(this._storage).length}u(this);return this["[[SetData]]"].size});b(i.prototype,{has:function has(e){r(this,"has");var t;if(this._storage&&(t=Gr(e))!==null){return!!this._storage[t]}u(this);return this["[[SetData]]"].has(e)},add:function add(e){r(this,"add");var t;if(this._storage&&(t=Gr(e))!==null){this._storage[t]=true;return this}u(this);this["[[SetData]]"].set(e,e);return this},"delete":function(e){r(this,"delete");var t;if(this._storage&&(t=Gr(e))!==null){var n=z(this._storage,t);return delete this._storage[t]&&n}u(this);return this["[[SetData]]"]["delete"](e)},clear:function clear(){r(this,"clear");if(this._storage){this._storage=Wr()}if(this["[[SetData]]"]){this["[[SetData]]"].clear()}},values:function values(){r(this,"values");u(this);return this["[[SetData]]"].values()},entries:function entries(){r(this,"entries");u(this);return this["[[SetData]]"].entries()},forEach:function forEach(e){r(this,"forEach");var n=arguments.length>1?arguments[1]:null;var o=this;u(o);this["[[SetData]]"].forEach(function(r,i){if(n){t(e,n,i,i,o)}else{e(i,i,o)}})}});h(i.prototype,"keys",i.prototype.values,true);me(i.prototype,i.prototype.values);return i}()};if(S.Map||S.Set){var $r=a(function(){return new Map([[1,2]]).get(1)===2});if(!$r){var Ur=S.Map;S.Map=function Map(){if(!(this instanceof Map)){throw new TypeError('Constructor Map requires "new"')}var e=new Ur;if(arguments.length>0){Hr(Map,e,arguments[0])}delete e.constructor;Object.setPrototypeOf(e,S.Map.prototype);return e};S.Map.prototype=m(Ur.prototype);h(S.Map.prototype,"constructor",S.Map,true);O.preserveToString(S.Map,Ur)}var Jr=new Map;var Kr=function(){var e=new Map([[1,0],[2,0],[3,0],[4,0]]);e.set(-0,e);return e.get(0)===e&&e.get(-0)===e&&e.has(0)&&e.has(-0)}();var Xr=Jr.set(1,2)===Jr;if(!Kr||!Xr){var Zr=Map.prototype.set;X(Map.prototype,"set",function set(e,r){t(Zr,this,e===0?0:e,r);return this})}if(!Kr){var Yr=Map.prototype.get;var Qr=Map.prototype.has;b(Map.prototype,{get:function get(e){return t(Yr,this,e===0?0:e)},has:function has(e){return t(Qr,this,e===0?0:e)}},true);O.preserveToString(Map.prototype.get,Yr);O.preserveToString(Map.prototype.has,Qr)}var en=new Set;var tn=function(e){e["delete"](0);e.add(-0);return!e.has(0)}(en);var rn=en.add(1)===en;if(!tn||!rn){var nn=Set.prototype.add;Set.prototype.add=function add(e){t(nn,this,e===0?0:e);return this};O.preserveToString(Set.prototype.add,nn)}if(!tn){var on=Set.prototype.has;Set.prototype.has=function has(e){return t(on,this,e===0?0:e)};O.preserveToString(Set.prototype.has,on);var an=Set.prototype["delete"];Set.prototype["delete"]=function SetDelete(e){return t(an,this,e===0?0:e)};O.preserveToString(Set.prototype["delete"],an)}var un=w(S.Map,function(e){var t=new e([]);t.set(42,42);return t instanceof e});var fn=Object.setPrototypeOf&&!un;var sn=function(){try{return!(S.Map()instanceof S.Map)}catch(e){return e instanceof TypeError}}();if(S.Map.length!==0||fn||!sn){var cn=S.Map;S.Map=function Map(){if(!(this instanceof Map)){throw new TypeError('Constructor Map requires "new"')}var e=new cn;if(arguments.length>0){Hr(Map,e,arguments[0])}delete e.constructor;Object.setPrototypeOf(e,Map.prototype);return e};S.Map.prototype=cn.prototype;h(S.Map.prototype,"constructor",S.Map,true);O.preserveToString(S.Map,cn)}var ln=w(S.Set,function(e){var t=new e([]);t.add(42,42);return t instanceof e});var pn=Object.setPrototypeOf&&!ln;var vn=function(){try{return!(S.Set()instanceof S.Set)}catch(e){return e instanceof TypeError}}();if(S.Set.length!==0||pn||!vn){var yn=S.Set;S.Set=function Set(){if(!(this instanceof Set)){throw new TypeError('Constructor Set requires "new"')}var e=new yn;if(arguments.length>0){Vr(Set,e,arguments[0])}delete e.constructor;Object.setPrototypeOf(e,Set.prototype);return e};S.Set.prototype=yn.prototype;h(S.Set.prototype,"constructor",S.Set,true);O.preserveToString(S.Set,yn)}var hn=!a(function(){return(new Map).keys().next().done});if(typeof S.Map.prototype.clear!=="function"||(new S.Set).size!==0||(new S.Map).size!==0||typeof S.Map.prototype.keys!=="function"||typeof S.Set.prototype.keys!=="function"||typeof S.Map.prototype.forEach!=="function"||typeof S.Set.prototype.forEach!=="function"||u(S.Map)||u(S.Set)||typeof(new S.Map).keys().next!=="function"||hn||!un){b(S,{Map:Br.Map,Set:Br.Set},true)}if(S.Set.prototype.keys!==S.Set.prototype.values){h(S.Set.prototype,"keys",S.Set.prototype.values,true)}me(Object.getPrototypeOf((new S.Map).keys()));me(Object.getPrototypeOf((new S.Set).keys()));if(c&&S.Set.prototype.has.name!=="has"){var bn=S.Set.prototype.has;X(S.Set.prototype,"has",function has(e){return t(bn,this,e)})}}b(S,Br);Oe(S.Map);Oe(S.Set)}var gn=function throwUnlessTargetIsObject(e){if(!te.TypeIsObject(e)){throw new TypeError("target must be an object")}};var dn={apply:function apply(){return te.Call(te.Call,null,arguments)},construct:function construct(e,t){if(!te.IsConstructor(e)){throw new TypeError("First argument must be a constructor.")}var r=arguments.length>2?arguments[2]:e;if(!te.IsConstructor(r)){throw new TypeError("new.target must be a constructor.")}return te.Construct(e,t,r,"internal")},deleteProperty:function deleteProperty(e,t){gn(e);if(s){var r=Object.getOwnPropertyDescriptor(e,t);if(r&&!r.configurable){return false}}return delete e[t]},has:function has(e,t){gn(e);return t in e}};if(Object.getOwnPropertyNames){Object.assign(dn,{ownKeys:function ownKeys(e){gn(e);var t=Object.getOwnPropertyNames(e);if(te.IsCallable(Object.getOwnPropertySymbols)){N(t,Object.getOwnPropertySymbols(e))}return t}})}var On=function ConvertExceptionToBoolean(e){return!i(e)};if(Object.preventExtensions){Object.assign(dn,{isExtensible:function isExtensible(e){gn(e);return Object.isExtensible(e)},preventExtensions:function preventExtensions(e){gn(e);return On(function(){Object.preventExtensions(e)})}})}if(s){var mn=function get(e,t,r){var n=Object.getOwnPropertyDescriptor(e,t);if(!n){var o=Object.getPrototypeOf(e);if(o===null){return void 0}return mn(o,t,r)}if("value"in n){return n.value}if(n.get){return te.Call(n.get,r)}return void 0};var wn=function set(e,r,n,o){var i=Object.getOwnPropertyDescriptor(e,r);if(!i){var a=Object.getPrototypeOf(e);if(a!==null){return wn(a,r,n,o)}i={value:void 0,writable:true,enumerable:true,configurable:true}}if("value"in i){if(!i.writable){return false}if(!te.TypeIsObject(o)){return false}var u=Object.getOwnPropertyDescriptor(o,r);if(u){return Q.defineProperty(o,r,{value:n})}else{return Q.defineProperty(o,r,{value:n,writable:true,enumerable:true,configurable:true})}}if(i.set){t(i.set,o,n);return true}return false};Object.assign(dn,{defineProperty:function defineProperty(e,t,r){gn(e);return On(function(){Object.defineProperty(e,t,r)})},getOwnPropertyDescriptor:function getOwnPropertyDescriptor(e,t){gn(e);return Object.getOwnPropertyDescriptor(e,t)},get:function get(e,t){gn(e);var r=arguments.length>2?arguments[2]:e;return mn(e,t,r)},set:function set(e,t,r){gn(e);var n=arguments.length>3?arguments[3]:e;return wn(e,t,r,n)}})}if(Object.getPrototypeOf){var jn=Object.getPrototypeOf;dn.getPrototypeOf=function getPrototypeOf(e){gn(e);return jn(e)}}if(Object.setPrototypeOf&&dn.getPrototypeOf){var Sn=function(e,t){var r=t;while(r){if(e===r){return true}r=dn.getPrototypeOf(r)}return false};Object.assign(dn,{setPrototypeOf:function setPrototypeOf(e,t){gn(e);if(t!==null&&!te.TypeIsObject(t)){throw new TypeError("proto must be an object or null")}if(t===Q.getPrototypeOf(e)){return true}if(Q.isExtensible&&!Q.isExtensible(e)){return false}if(Sn(e,t)){return false}Object.setPrototypeOf(e,t);return true}})}var Tn=function(e,t){if(!te.IsCallable(S.Reflect[e])){h(S.Reflect,e,t)}else{var r=a(function(){S.Reflect[e](1);S.Reflect[e](NaN);S.Reflect[e](true);return true});if(r){X(S.Reflect,e,t)}}};Object.keys(dn).forEach(function(e){Tn(e,dn[e])});var In=S.Reflect.getPrototypeOf;if(c&&In&&In.name!=="getPrototypeOf"){X(S.Reflect,"getPrototypeOf",function getPrototypeOf(e){return t(In,S.Reflect,e)})}if(S.Reflect.setPrototypeOf){if(a(function(){S.Reflect.setPrototypeOf(1,{});return true})){X(S.Reflect,"setPrototypeOf",dn.setPrototypeOf)}}if(S.Reflect.defineProperty){if(!a(function(){var e=!S.Reflect.defineProperty(1,"test",{value:1});var t=typeof Object.preventExtensions!=="function"||!S.Reflect.defineProperty(Object.preventExtensions({}),"test",{});return e&&t})){X(S.Reflect,"defineProperty",dn.defineProperty)}}if(S.Reflect.construct){if(!a(function(){var e=function F(){};return S.Reflect.construct(function(){},[],e)instanceof e})){X(S.Reflect,"construct",dn.construct)}}if(String(new Date(NaN))!=="Invalid Date"){var En=Date.prototype.toString;var Pn=function toString(){var e=+this;if(e!==e){return"Invalid Date"}return te.Call(En,this)};X(Date.prototype,"toString",Pn)}var Mn={anchor:function anchor(e){return te.CreateHTML(this,"a","name",e)},big:function big(){return te.CreateHTML(this,"big","","")},blink:function blink(){return te.CreateHTML(this,"blink","","")},bold:function bold(){return te.CreateHTML(this,"b","","")},fixed:function fixed(){return te.CreateHTML(this,"tt","","")},fontcolor:function fontcolor(e){return te.CreateHTML(this,"font","color",e)},fontsize:function fontsize(e){return te.CreateHTML(this,"font","size",e)},italics:function italics(){return te.CreateHTML(this,"i","","")},link:function link(e){return te.CreateHTML(this,"a","href",e)},small:function small(){return te.CreateHTML(this,"small","","")},strike:function strike(){return te.CreateHTML(this,"strike","","")},sub:function sub(){return te.CreateHTML(this,"sub","","")},sup:function sub(){return te.CreateHTML(this,"sup","","")}};l(Object.keys(Mn),function(e){var r=String.prototype[e];var n=false;if(te.IsCallable(r)){var o=t(r,"",' " ');var i=P([],o.match(/"/g)).length;n=o!==o.toLowerCase()||i>2}else{n=true}if(n){X(String.prototype,e,Mn[e])}});var Cn=function(){if(!Z){return false}var e=typeof JSON==="object"&&typeof JSON.stringify==="function"?JSON.stringify:null;if(!e){return false}if(typeof e(W())!=="undefined"){return true}if(e([W()])!=="[null]"){return true}var t={a:W()};t[W()]=true;if(e(t)!=="{}"){return true}return false}();var xn=a(function(){if(!Z){return true}return JSON.stringify(Object(W()))==="{}"&&JSON.stringify([Object(W())])==="[{}]"});if(Cn||!xn){var Nn=JSON.stringify;X(JSON,"stringify",function stringify(e){if(typeof e==="symbol"){return}var n;if(arguments.length>1){n=arguments[1]}var o=[e];if(!r(n)){var i=te.IsCallable(n)?n:null;var a=function(e,r){var n=i?t(i,this,e,r):r;if(typeof n!=="symbol"){if(K.symbol(n)){return Tt({})(n)}else{return n}}};o.push(a)}else{o.push(n)}if(arguments.length>2){o.push(arguments[2])}return Nn.apply(this,o)})}return S});
//# sourceMappingURL=es6-shim.map
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var _Map = typeof Map === "function" ? Map : CreateMapPolyfill();
    var _Set = typeof Set === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    var __Metadata__ = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param targetKey (Optional) The property key to decorate.
      * @param targetDescriptor (Optional) The property descriptor for the target key
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class C {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     C = Reflect.decorate(decoratorsArray, C);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, C, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, C.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(C, "staticMethod",
      *         Reflect.decorate(decoratorsArray, C, "staticMethod",
      *             Object.getOwnPropertyDescriptor(C, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(C.prototype, "method",
      *         Reflect.decorate(decoratorsArray, C.prototype, "method",
      *             Object.getOwnPropertyDescriptor(C.prototype, "method")));
      *
      */
    function decorate(decorators, target, targetKey, targetDescriptor) {
        if (!IsUndefined(targetDescriptor)) {
            if (!IsArray(decorators)) {
                throw new TypeError();
            }
            else if (!IsObject(target)) {
                throw new TypeError();
            }
            else if (IsUndefined(targetKey)) {
                throw new TypeError();
            }
            else if (!IsObject(targetDescriptor)) {
                throw new TypeError();
            }
            targetKey = ToPropertyKey(targetKey);
            return DecoratePropertyWithDescriptor(decorators, target, targetKey, targetDescriptor);
        }
        else if (!IsUndefined(targetKey)) {
            if (!IsArray(decorators)) {
                throw new TypeError();
            }
            else if (!IsObject(target)) {
                throw new TypeError();
            }
            targetKey = ToPropertyKey(targetKey);
            return DecoratePropertyWithoutDescriptor(decorators, target, targetKey);
        }
        else {
            if (!IsArray(decorators)) {
                throw new TypeError();
            }
            else if (!IsConstructor(target)) {
                throw new TypeError();
            }
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class C {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class C {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class C {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class C {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class C {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, targetKey) {
            if (!IsUndefined(targetKey)) {
                if (!IsObject(target)) {
                    throw new TypeError();
                }
                targetKey = ToPropertyKey(targetKey);
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
            }
            else {
                if (!IsConstructor(target)) {
                    throw new TypeError();
                }
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, /*targetKey*/ undefined);
            }
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param targetKey (Optional) The property key for the target.
      * @example
      *
      *     class C {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, C);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, C, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, C.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, C, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, C.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param targetKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class C {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", C);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", C, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", C.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", C, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", C.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryHasMetadata(metadataKey, target, targetKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param targetKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class C {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", C);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", C, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", C.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", C, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", C.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryHasOwnMetadata(metadataKey, target, targetKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param targetKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class C {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", C);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", C, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", C.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", C, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", C.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryGetMetadata(metadataKey, target, targetKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param targetKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class C {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", C);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", C, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", C.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", C, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", C.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryGetOwnMetadata(metadataKey, target, targetKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param targetKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class C {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(C);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(C, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(C.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(C, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(C.prototype, "method");
      *
      */
    function getMetadataKeys(target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryMetadataKeys(target, targetKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param targetKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class C {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(C);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(C, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(C.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(C, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(C.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryOwnMetadataKeys(target, targetKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param targetKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class C {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", C);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", C, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", C.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", C, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", C.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        }
        else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#deletemetadata-metadatakey-p-
        var metadataMap = GetOrCreateMetadataMap(target, targetKey, /*create*/ false);
        if (IsUndefined(metadataMap)) {
            return false;
        }
        if (!metadataMap.delete(metadataKey)) {
            return false;
        }
        if (metadataMap.size > 0) {
            return true;
        }
        var targetMetadata = __Metadata__.get(target);
        targetMetadata.delete(targetKey);
        if (targetMetadata.size > 0) {
            return true;
        }
        __Metadata__.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated)) {
                if (!IsConstructor(decorated)) {
                    throw new TypeError();
                }
                target = decorated;
            }
        }
        return target;
    }
    function DecoratePropertyWithDescriptor(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated)) {
                if (!IsObject(decorated)) {
                    throw new TypeError();
                }
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function DecoratePropertyWithoutDescriptor(decorators, target, propertyKey) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            decorator(target, propertyKey);
        }
    }
    // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#getorcreatemetadatamap--o-p-create-
    function GetOrCreateMetadataMap(target, targetKey, create) {
        var targetMetadata = __Metadata__.get(target);
        if (!targetMetadata) {
            if (!create) {
                return undefined;
            }
            targetMetadata = new _Map();
            __Metadata__.set(target, targetMetadata);
        }
        var keyMetadata = targetMetadata.get(targetKey);
        if (!keyMetadata) {
            if (!create) {
                return undefined;
            }
            keyMetadata = new _Map();
            targetMetadata.set(targetKey, keyMetadata);
        }
        return keyMetadata;
    }
    // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinaryhasmetadata--metadatakey-o-p-
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn) {
            return true;
        }
        var parent = GetPrototypeOf(O);
        if (parent !== null) {
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        }
        return false;
    }
    // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinaryhasownmetadata--metadatakey-o-p-
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*create*/ false);
        if (metadataMap === undefined) {
            return false;
        }
        return Boolean(metadataMap.has(MetadataKey));
    }
    // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinarygetmetadata--metadatakey-o-p-
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn) {
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        }
        var parent = GetPrototypeOf(O);
        if (parent !== null) {
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        }
        return undefined;
    }
    // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinarygetownmetadata--metadatakey-o-p-
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*create*/ false);
        if (metadataMap === undefined) {
            return undefined;
        }
        return metadataMap.get(MetadataKey);
    }
    // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinarydefineownmetadata--metadatakey-metadatavalue-o-p-
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinarymetadatakeys--o-p-
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = GetPrototypeOf(O);
        if (parent === null) {
            return ownKeys;
        }
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0) {
            return ownKeys;
        }
        if (ownKeys.length <= 0) {
            return parentKeys;
        }
        var set = new _Set();
        var keys = [];
        for (var _i = 0; _i < ownKeys.length; _i++) {
            var key = ownKeys[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0; _a < parentKeys.length; _a++) {
            var key = parentKeys[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinaryownmetadatakeys--o-p-
    function OrdinaryOwnMetadataKeys(target, targetKey) {
        var metadataMap = GetOrCreateMetadataMap(target, targetKey, /*create*/ false);
        var keys = [];
        if (metadataMap) {
            metadataMap.forEach(function (_, key) { return keys.push(key); });
        }
        return keys;
    }
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
    function IsArray(x) {
        return Array.isArray(x);
    }
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
    function IsConstructor(x) {
        return typeof x === "function";
    }
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
    function ToPropertyKey(value) {
        if (IsSymbol(value)) {
            return value;
        }
        return String(value);
    }
    function GetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype) {
            return proto;
        }
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard. 
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype) {
            return proto;
        }
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype) {
            return proto;
        }
        // if the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function") {
            return proto;
        }
        // if we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O) {
            return proto;
        }
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        function Map() {
            this._keys = [];
            this._values = [];
            this._cache = cacheSentinel;
        }
        Map.prototype = {
            get size() {
                return this._keys.length;
            },
            has: function (key) {
                if (key === this._cache) {
                    return true;
                }
                if (this._find(key) >= 0) {
                    this._cache = key;
                    return true;
                }
                return false;
            },
            get: function (key) {
                var index = this._find(key);
                if (index >= 0) {
                    this._cache = key;
                    return this._values[index];
                }
                return undefined;
            },
            set: function (key, value) {
                this.delete(key);
                this._keys.push(key);
                this._values.push(value);
                this._cache = key;
                return this;
            },
            delete: function (key) {
                var index = this._find(key);
                if (index >= 0) {
                    this._keys.splice(index, 1);
                    this._values.splice(index, 1);
                    this._cache = cacheSentinel;
                    return true;
                }
                return false;
            },
            clear: function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cache = cacheSentinel;
            },
            forEach: function (callback, thisArg) {
                var size = this.size;
                for (var i = 0; i < size; ++i) {
                    var key = this._keys[i];
                    var value = this._values[i];
                    this._cache = key;
                    callback.call(this, value, key, this);
                }
            },
            _find: function (key) {
                var keys = this._keys;
                var size = keys.length;
                for (var i = 0; i < size; ++i) {
                    if (keys[i] === key) {
                        return i;
                    }
                }
                return -1;
            }
        };
        return Map;
    }
    // naive Set shim
    function CreateSetPolyfill() {
        var cacheSentinel = {};
        function Set() {
            this._map = new _Map();
        }
        Set.prototype = {
            get size() {
                return this._map.length;
            },
            has: function (value) {
                return this._map.has(value);
            },
            add: function (value) {
                this._map.set(value, value);
                return this;
            },
            delete: function (value) {
                return this._map.delete(value);
            },
            clear: function () {
                this._map.clear();
            },
            forEach: function (callback, thisArg) {
                this._map.forEach(callback, thisArg);
            }
        };
        return Set;
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var isNode = typeof global !== "undefined" && Object.prototype.toString.call(global.process) === '[object process]';
        var nodeCrypto = isNode && require("crypto");
        var hasOwn = Object.prototype.hasOwnProperty;
        var keys = {};
        var rootKey = CreateUniqueKey();
        function WeakMap() {
            this._key = CreateUniqueKey();
        }
        WeakMap.prototype = {
            has: function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                if (table) {
                    return this._key in table;
                }
                return false;
            },
            get: function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                if (table) {
                    return table[this._key];
                }
                return undefined;
            },
            set: function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            },
            delete: function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                if (table && this._key in table) {
                    return delete table[this._key];
                }
                return false;
            },
            clear: function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            }
        };
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i) {
                buffer[i] = Math.random() * 255 | 0;
            }
        }
        function GenRandomBytes(size) {
            if (nodeCrypto) {
                var data = nodeCrypto.randomBytes(size);
                return data;
            }
            else if (typeof Uint8Array === "function") {
                var data = new Uint8Array(size);
                if (typeof crypto !== "undefined") {
                    crypto.getRandomValues(data);
                }
                else if (typeof msCrypto !== "undefined") {
                    msCrypto.getRandomValues(data);
                }
                else {
                    FillRandomBytes(data, size);
                }
                return data;
            }
            else {
                var data = new Array(size);
                FillRandomBytes(data, size);
                return data;
            }
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8) {
                    result += "-";
                }
                if (byte < 16) {
                    result += "0";
                }
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
        function CreateUniqueKey() {
            var key;
            do {
                key = "@@WeakMap@@" + CreateUUID();
            } while (hasOwn.call(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create) {
                    return undefined;
                }
                Object.defineProperty(target, rootKey, { value: Object.create(null) });
            }
            return target[rootKey];
        }
        return WeakMap;
    }
    // hook global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    __global.Reflect[p] = Reflect[p];
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof window !== "undefined" ? window :
        typeof WorkerGlobalScope !== "undefined" ? self :
            typeof global !== "undefined" ? global :
                Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map

/*
 * SystemJS Polyfills for URL and Promise providing IE8+ Support
 */
!function(t){!function(e){"object"==typeof exports?module.exports=e():"function"==typeof t&&t.amd?t(e):"undefined"!=typeof window?window.Promise=e():"undefined"!=typeof global?global.Promise=e():"undefined"!=typeof self&&(self.Promise=e())}(function(){var t;return function e(t,n,o){function r(u,c){if(!n[u]){if(!t[u]){var f="function"==typeof require&&require;if(!c&&f)return f(u,!0);if(i)return i(u,!0);throw new Error("Cannot find module '"+u+"'")}var s=n[u]={exports:{}};t[u][0].call(s.exports,function(e){var n=t[u][1][e];return r(n?n:e)},s,s.exports,e,t,n,o)}return n[u].exports}for(var i="function"==typeof require&&require,u=0;u<o.length;u++)r(o[u]);return r}({1:[function(t,e,n){var o=t("../lib/decorators/unhandledRejection"),r=o(t("../lib/Promise"));e.exports="undefined"!=typeof global?global.Promise=r:"undefined"!=typeof self?self.Promise=r:r},{"../lib/Promise":2,"../lib/decorators/unhandledRejection":4}],2:[function(e,n,o){!function(t){"use strict";t(function(t){var e=t("./makePromise"),n=t("./Scheduler"),o=t("./env").asap;return e({scheduler:new n(o)})})}("function"==typeof t&&t.amd?t:function(t){n.exports=t(e)})},{"./Scheduler":3,"./env":5,"./makePromise":7}],3:[function(e,n,o){!function(t){"use strict";t(function(){function t(t){this._async=t,this._running=!1,this._queue=this,this._queueLen=0,this._afterQueue={},this._afterQueueLen=0;var e=this;this.drain=function(){e._drain()}}return t.prototype.enqueue=function(t){this._queue[this._queueLen++]=t,this.run()},t.prototype.afterQueue=function(t){this._afterQueue[this._afterQueueLen++]=t,this.run()},t.prototype.run=function(){this._running||(this._running=!0,this._async(this.drain))},t.prototype._drain=function(){for(var t=0;t<this._queueLen;++t)this._queue[t].run(),this._queue[t]=void 0;for(this._queueLen=0,this._running=!1,t=0;t<this._afterQueueLen;++t)this._afterQueue[t].run(),this._afterQueue[t]=void 0;this._afterQueueLen=0},t})}("function"==typeof t&&t.amd?t:function(t){n.exports=t()})},{}],4:[function(e,n,o){!function(t){"use strict";t(function(t){function e(t){throw t}function n(){}var o=t("../env").setTimer,r=t("../format");return function(t){function i(t){t.handled||(l.push(t),a("Potentially unhandled rejection ["+t.id+"] "+r.formatError(t.value)))}function u(t){var e=l.indexOf(t);e>=0&&(l.splice(e,1),h("Handled previous rejection ["+t.id+"] "+r.formatObject(t.value)))}function c(t,e){p.push(t,e),null===d&&(d=o(f,0))}function f(){for(d=null;p.length>0;)p.shift()(p.shift())}var s,a=n,h=n;"undefined"!=typeof console&&(s=console,a="undefined"!=typeof s.error?function(t){s.error(t)}:function(t){s.log(t)},h="undefined"!=typeof s.info?function(t){s.info(t)}:function(t){s.log(t)}),t.onPotentiallyUnhandledRejection=function(t){c(i,t)},t.onPotentiallyUnhandledRejectionHandled=function(t){c(u,t)},t.onFatalRejection=function(t){c(e,t.value)};var p=[],l=[],d=null;return t}})}("function"==typeof t&&t.amd?t:function(t){n.exports=t(e)})},{"../env":5,"../format":6}],5:[function(e,n,o){!function(t){"use strict";t(function(t){function e(){return"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process)}function n(){return"function"==typeof MutationObserver&&MutationObserver||"function"==typeof WebKitMutationObserver&&WebKitMutationObserver}function o(t){function e(){var t=n;n=void 0,t()}var n,o=document.createTextNode(""),r=new t(e);r.observe(o,{characterData:!0});var i=0;return function(t){n=t,o.data=i^=1}}var r,i="undefined"!=typeof setTimeout&&setTimeout,u=function(t,e){return setTimeout(t,e)},c=function(t){return clearTimeout(t)},f=function(t){return i(t,0)};if(e())f=function(t){return process.nextTick(t)};else if(r=n())f=o(r);else if(!i){var s=t,a=s("vertx");u=function(t,e){return a.setTimer(e,t)},c=a.cancelTimer,f=a.runOnLoop||a.runOnContext}return{setTimer:u,clearTimer:c,asap:f}})}("function"==typeof t&&t.amd?t:function(t){n.exports=t(e)})},{}],6:[function(e,n,o){!function(t){"use strict";t(function(){function t(t){var n="object"==typeof t&&null!==t&&(t.stack||t.message)?t.stack||t.message:e(t);return t instanceof Error?n:n+" (WARNING: non-Error used)"}function e(t){var e=String(t);return"[object Object]"===e&&"undefined"!=typeof JSON&&(e=n(t,e)),e}function n(t,e){try{return JSON.stringify(t)}catch(n){return e}}return{formatError:t,formatObject:e,tryStringify:n}})}("function"==typeof t&&t.amd?t:function(t){n.exports=t()})},{}],7:[function(e,n,o){!function(t){"use strict";t(function(){return function(t){function e(t,e){this._handler=t===_?e:n(t)}function n(t){function e(t){r.resolve(t)}function n(t){r.reject(t)}function o(t){r.notify(t)}var r=new b;try{t(e,n,o)}catch(i){n(i)}return r}function o(t){return k(t)?t:new e(_,new x(v(t)))}function r(t){return new e(_,new x(new P(t)))}function i(){return $}function u(){return new e(_,new b)}function c(t,e){var n=new b(t.receiver,t.join().context);return new e(_,n)}function f(t){return a(B,null,t)}function s(t,e){return a(M,t,e)}function a(t,n,o){function r(e,r,u){u.resolved||h(o,i,e,t(n,r,e),u)}function i(t,e,n){a[t]=e,0===--s&&n.become(new q(a))}for(var u,c="function"==typeof n?r:i,f=new b,s=o.length>>>0,a=new Array(s),p=0;p<o.length&&!f.resolved;++p)u=o[p],void 0!==u||p in o?h(o,c,p,u,f):--s;return 0===s&&f.become(new q(a)),new e(_,f)}function h(t,e,n,o,r){if(U(o)){var i=m(o),u=i.state();0===u?i.fold(e,n,void 0,r):u>0?e(n,i.value,r):(r.become(i),p(t,n+1,i))}else e(n,o,r)}function p(t,e,n){for(var o=e;o<t.length;++o)l(v(t[o]),n)}function l(t,e){if(t!==e){var n=t.state();0===n?t.visit(t,void 0,t._unreport):0>n&&t._unreport()}}function d(t){return"object"!=typeof t||null===t?r(new TypeError("non-iterable passed to race()")):0===t.length?i():1===t.length?o(t[0]):y(t)}function y(t){var n,o,r,i=new b;for(n=0;n<t.length;++n)if(o=t[n],void 0!==o||n in t){if(r=v(o),0!==r.state()){i.become(r),p(t,n+1,r);break}r.visit(i,i.resolve,i.reject)}return new e(_,i)}function v(t){return k(t)?t._handler.join():U(t)?j(t):new q(t)}function m(t){return k(t)?t._handler.join():j(t)}function j(t){try{var e=t.then;return"function"==typeof e?new g(e,t):new q(t)}catch(n){return new P(n)}}function _(){}function w(){}function b(t,n){e.createContext(this,n),this.consumers=void 0,this.receiver=t,this.handler=void 0,this.resolved=!1}function x(t){this.handler=t}function g(t,e){b.call(this),G.enqueue(new E(t,e,this))}function q(t){e.createContext(this),this.value=t}function P(t){e.createContext(this),this.id=++Y,this.value=t,this.handled=!1,this.reported=!1,this._report()}function R(t,e){this.rejection=t,this.context=e}function C(t){this.rejection=t}function O(){return new P(new TypeError("Promise cycle"))}function T(t,e){this.continuation=t,this.handler=e}function Q(t,e){this.handler=e,this.value=t}function E(t,e,n){this._then=t,this.thenable=e,this.resolver=n}function L(t,e,n,o,r){try{t.call(e,n,o,r)}catch(i){o(i)}}function S(t,e,n,o){this.f=t,this.z=e,this.c=n,this.to=o,this.resolver=X,this.receiver=this}function k(t){return t instanceof e}function U(t){return("object"==typeof t||"function"==typeof t)&&null!==t}function H(t,n,o,r){return"function"!=typeof t?r.become(n):(e.enterContext(n),F(t,n.value,o,r),void e.exitContext())}function N(t,n,o,r,i){return"function"!=typeof t?i.become(o):(e.enterContext(o),W(t,n,o.value,r,i),void e.exitContext())}function J(t,n,o,r,i){return"function"!=typeof t?i.notify(n):(e.enterContext(o),z(t,n,r,i),void e.exitContext())}function M(t,e,n){try{return t(e,n)}catch(o){return r(o)}}function F(t,e,n,o){try{o.become(v(t.call(n,e)))}catch(r){o.become(new P(r))}}function W(t,e,n,o,r){try{t.call(o,e,n,r)}catch(i){r.become(new P(i))}}function z(t,e,n,o){try{o.notify(t.call(n,e))}catch(r){o.notify(r)}}function A(t,e){e.prototype=V(t.prototype),e.prototype.constructor=e}function B(t,e){return e}function K(){}function D(){return"undefined"!=typeof process&&null!==process&&"function"==typeof process.emit?function(t,e){return"unhandledRejection"===t?process.emit(t,e.value,e):process.emit(t,e)}:"undefined"!=typeof self&&"function"==typeof CustomEvent?function(t,e,n){var o=!1;try{var r=new n("unhandledRejection");o=r instanceof n}catch(i){}return o?function(t,o){var r=new n(t,{detail:{reason:o.value,key:o},bubbles:!1,cancelable:!0});return!e.dispatchEvent(r)}:t}(K,self,CustomEvent):K}var G=t.scheduler,I=D(),V=Object.create||function(t){function e(){}return e.prototype=t,new e};e.resolve=o,e.reject=r,e.never=i,e._defer=u,e._handler=v,e.prototype.then=function(t,e,n){var o=this._handler,r=o.join().state();if("function"!=typeof t&&r>0||"function"!=typeof e&&0>r)return new this.constructor(_,o);var i=this._beget(),u=i._handler;return o.chain(u,o.receiver,t,e,n),i},e.prototype["catch"]=function(t){return this.then(void 0,t)},e.prototype._beget=function(){return c(this._handler,this.constructor)},e.all=f,e.race=d,e._traverse=s,e._visitRemaining=p,_.prototype.when=_.prototype.become=_.prototype.notify=_.prototype.fail=_.prototype._unreport=_.prototype._report=K,_.prototype._state=0,_.prototype.state=function(){return this._state},_.prototype.join=function(){for(var t=this;void 0!==t.handler;)t=t.handler;return t},_.prototype.chain=function(t,e,n,o,r){this.when({resolver:t,receiver:e,fulfilled:n,rejected:o,progress:r})},_.prototype.visit=function(t,e,n,o){this.chain(X,t,e,n,o)},_.prototype.fold=function(t,e,n,o){this.when(new S(t,e,n,o))},A(_,w),w.prototype.become=function(t){t.fail()};var X=new w;A(_,b),b.prototype._state=0,b.prototype.resolve=function(t){this.become(v(t))},b.prototype.reject=function(t){this.resolved||this.become(new P(t))},b.prototype.join=function(){if(!this.resolved)return this;for(var t=this;void 0!==t.handler;)if(t=t.handler,t===this)return this.handler=O();return t},b.prototype.run=function(){var t=this.consumers,e=this.handler;this.handler=this.handler.join(),this.consumers=void 0;for(var n=0;n<t.length;++n)e.when(t[n])},b.prototype.become=function(t){this.resolved||(this.resolved=!0,this.handler=t,void 0!==this.consumers&&G.enqueue(this),void 0!==this.context&&t._report(this.context))},b.prototype.when=function(t){this.resolved?G.enqueue(new T(t,this.handler)):void 0===this.consumers?this.consumers=[t]:this.consumers.push(t)},b.prototype.notify=function(t){this.resolved||G.enqueue(new Q(t,this))},b.prototype.fail=function(t){var e="undefined"==typeof t?this.context:t;this.resolved&&this.handler.join().fail(e)},b.prototype._report=function(t){this.resolved&&this.handler.join()._report(t)},b.prototype._unreport=function(){this.resolved&&this.handler.join()._unreport()},A(_,x),x.prototype.when=function(t){G.enqueue(new T(t,this))},x.prototype._report=function(t){this.join()._report(t)},x.prototype._unreport=function(){this.join()._unreport()},A(b,g),A(_,q),q.prototype._state=1,q.prototype.fold=function(t,e,n,o){N(t,e,this,n,o)},q.prototype.when=function(t){H(t.fulfilled,this,t.receiver,t.resolver)};var Y=0;A(_,P),P.prototype._state=-1,P.prototype.fold=function(t,e,n,o){o.become(this)},P.prototype.when=function(t){"function"==typeof t.rejected&&this._unreport(),H(t.rejected,this,t.receiver,t.resolver)},P.prototype._report=function(t){G.afterQueue(new R(this,t))},P.prototype._unreport=function(){this.handled||(this.handled=!0,G.afterQueue(new C(this)))},P.prototype.fail=function(t){this.reported=!0,I("unhandledRejection",this),e.onFatalRejection(this,void 0===t?this.context:t)},R.prototype.run=function(){this.rejection.handled||this.rejection.reported||(this.rejection.reported=!0,I("unhandledRejection",this.rejection)||e.onPotentiallyUnhandledRejection(this.rejection,this.context))},C.prototype.run=function(){this.rejection.reported&&(I("rejectionHandled",this.rejection)||e.onPotentiallyUnhandledRejectionHandled(this.rejection))},e.createContext=e.enterContext=e.exitContext=e.onPotentiallyUnhandledRejection=e.onPotentiallyUnhandledRejectionHandled=e.onFatalRejection=K;var Z=new _,$=new e(_,Z);return T.prototype.run=function(){this.handler.join().when(this.continuation)},Q.prototype.run=function(){var t=this.handler.consumers;if(void 0!==t)for(var e,n=0;n<t.length;++n)e=t[n],J(e.progress,this.value,this.handler,e.receiver,e.resolver)},E.prototype.run=function(){function t(t){o.resolve(t)}function e(t){o.reject(t)}function n(t){o.notify(t)}var o=this.resolver;L(this._then,this.thenable,t,e,n)},S.prototype.fulfilled=function(t){this.f.call(this.c,this.z,t,this.to)},S.prototype.rejected=function(t){this.to.reject(t)},S.prototype.progress=function(t){this.to.notify(t)},e}})}("function"==typeof t&&t.amd?t:function(t){n.exports=t()})},{}]},{},[1])(1)}),"undefined"!=typeof systemJSBootstrap&&systemJSBootstrap()}();
//# sourceMappingURL=system-polyfills.js.map
/*
 * SystemJS v0.19.27
 */
!function(){function e(){!function(e){function t(e,r){if("string"!=typeof e)throw new TypeError("URL must be a string");var n=String(e).replace(/^\s+|\s+$/g,"").match(/^([^:\/?#]+:)?(?:\/\/(?:([^:@\/?#]*)(?::([^:@\/?#]*))?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);if(!n)throw new RangeError("Invalid URL format");var a=n[1]||"",o=n[2]||"",i=n[3]||"",s=n[4]||"",l=n[5]||"",u=n[6]||"",d=n[7]||"",c=n[8]||"",f=n[9]||"";if(void 0!==r){var m=r instanceof t?r:new t(r),p=!a&&!s&&!o;!p||d||c||(c=m.search),p&&"/"!==d[0]&&(d=d?(!m.host&&!m.username||m.pathname?"":"/")+m.pathname.slice(0,m.pathname.lastIndexOf("/")+1)+d:m.pathname);var h=[];d.replace(/^(\.\.?(\/|$))+/,"").replace(/\/(\.(\/|$))+/g,"/").replace(/\/\.\.$/,"/../").replace(/\/?[^\/]*/g,function(e){"/.."===e?h.pop():h.push(e)}),d=h.join("").replace(/^\//,"/"===d[0]?"/":""),p&&(u=m.port,l=m.hostname,s=m.host,i=m.password,o=m.username),a||(a=m.protocol)}"file:"==a&&(d=d.replace(/\\/g,"/")),this.origin=s?a+(""!==a||""!==s?"//":"")+s:"",this.href=a+(a&&s||"file:"==a?"//":"")+(""!==o?o+(""!==i?":"+i:"")+"@":"")+s+d+c+f,this.protocol=a,this.username=o,this.password=i,this.host=s,this.hostname=l,this.port=u,this.pathname=d,this.search=c,this.hash=f}e.URLPolyfill=t}("undefined"!=typeof self?self:global),function(e){function t(e,t){if(!e.originalErr)for(var r=(e.stack||e.message||e).split("\n"),n=[],a=0;a<r.length;a++)("undefined"==typeof $__curScript||-1==r[a].indexOf($__curScript.src))&&n.push(r[a]);var o=(n?n.join("\n	"):e.message)+"\n	"+t;F||(o=o.replace(D?/file:\/\/\//g:/file:\/\//g,""));var i=C?new Error(o,e.fileName,e.lineNumber):new Error(o);return F?i.stack=null:i.stack=o,i.originalErr=e.originalErr||e,i}function r(e,r,n){try{new Function(e).call(n)}catch(a){throw t(a,"Evaluating "+r)}}function n(){}function a(t){this._loader={loaderObj:this,loads:[],modules:{},importPromises:{},moduleRecords:{}},q(this,"global",{get:function(){return e}})}function o(){a.call(this),this.paths={}}function i(e,t){var r,n="",a=0;for(var o in e){var i=o.split("*");if(i.length>2)throw new TypeError("Only one wildcard in a path is permitted");if(1==i.length){if(t==o)return e[o];if(t.substr(0,o.length-1)==o.substr(0,o.length-1)&&(t.length<o.length||t[o.length-1]==o[o.length-1])&&"/"==e[o][e[o].length-1])return e[o].substr(0,e[o].length-1)+(t.length>o.length?"/"+t.substr(o.length):"")}else{var s=i[0].length;s>=a&&t.substr(0,i[0].length)==i[0]&&t.substr(t.length-i[1].length)==i[1]&&(a=s,n=o,r=t.substr(i[0].length,t.length-i[1].length-i[0].length))}}var l=e[n];return"string"==typeof r&&(l=l.replace("*",r)),l}function s(){}function l(){o.call(this),V.call(this)}function u(){}function d(e,t){l.prototype[e]=t(l.prototype[e]||function(){})}function c(e){V=e(V||function(){})}function f(e){for(var t=[],r=[],n=0,a=e.length;a>n;n++){var o=J.call(t,e[n]);-1===o?(t.push(e[n]),r.push([n])):r[o].push(n)}return{names:t,indices:r}}function m(e){var t={};if("object"==typeof e||"function"==typeof e){var r=e&&e.hasOwnProperty;if(K)for(var n in e)h(t,e,n)||p(t,e,n,r);else for(var n in e)p(t,e,n,r)}return t["default"]=e,q(t,"__useDefault",{value:!0}),t}function p(e,t,r,n){(!n||t.hasOwnProperty(r))&&(e[r]=t[r])}function h(e,t,r){try{var n;return(n=Object.getOwnPropertyDescriptor(t,r))&&q(e,r,n),!0}catch(a){return!1}}function g(e,t,r){for(var n in t)r&&n in e||(e[n]=t[n]);return e}function v(e,t,r){for(var n in t){var a=t[n];n in e?a instanceof Array&&e[n]instanceof Array?e[n]=[].concat(r?a:e[n]).concat(r?e[n]:a):"object"==typeof a&&null!==a&&"object"==typeof e[n]?e[n]=g(g({},e[n]),a,r):r||(e[n]=a):e[n]=a}}function y(e){this.warnings&&"undefined"!=typeof console&&console.warn}function b(e,t){for(var r=e.split(".");r.length;)t=t[r.shift()];return t}function w(){if(te[this.baseURL])return te[this.baseURL];"/"!=this.baseURL[this.baseURL.length-1]&&(this.baseURL+="/");var e=new H(this.baseURL,U);return this.baseURL=e.href,te[this.baseURL]=e}function x(e,t){var r,n=0;for(var a in e)if(t.substr(0,a.length)==a&&(t.length==a.length||"/"==t[a.length])){var o=a.split("/").length;if(n>=o)continue;r=a,n=o}return r}function S(e){this.set("@system-env",this.newModule({browser:F,node:!!this._nodeRequire,production:e,"default":!0}))}function E(e){return("."!=e[0]||!!e[1]&&"/"!=e[1]&&"."!=e[1])&&"/"!=e[0]&&!e.match(ee)}function _(e,t){return t&&(t=t.replace(/#/g,"%05")),new H(e,t||re).href.replace(/%05/g,"#")}function j(e,t){return new H(t,w.call(e)).href}function k(e,t){if(!E(e))return _(e,t);var r=x(this.map,e);if(r&&(e=this.map[r]+e.substr(r.length),!E(e)))return _(e);if(this.has(e))return e;if("@node/"==e.substr(0,6)&&-1!=ne.indexOf(e.substr(6))){if(!this._nodeRequire)throw new TypeError("Error loading "+e+". Can only load node core modules in Node.");return this.set(e,this.newModule(m(this._nodeRequire(e.substr(6))))),e}var n=i(this.paths,e);return n&&!E(n)?_(n):j(this,n||e)}function R(e){var t=e.match(ie);return t&&"System.register"==e.substr(t[0].length,15)}function P(){return{name:null,deps:null,originalIndices:null,declare:null,execute:null,executingRequire:!1,declarative:!1,normalizedDeps:null,groupIndex:null,evaluated:!1,module:null,esModule:null,esmExports:!1}}function O(t){if("string"==typeof t)return b(t,e);if(!(t instanceof Array))throw new Error("Global exports must be a string or array.");for(var r={},n=!0,a=0;a<t.length;a++){var o=b(t[a],e);n&&(r["default"]=o,n=!1),r[t[a].split(".").pop()]=o}return r}function M(e){var t,r,n,n="~"==e[0],a=e.lastIndexOf("|");return-1!=a?(t=e.substr(a+1),r=e.substr(n,a-n)||"@system-env"):(t=null,r=e.substr(n)),{module:r,prop:t,negate:n}}function z(e){return(e.negate?"~":"")+e.module+(e.prop?"|"+e.prop:"")}function T(e,t,r){return this["import"](e.module,t).then(function(t){if(e.prop?t=b(e.prop,t):"object"==typeof t&&t+""=="Module"&&(t=t["default"]),r&&"boolean"!=typeof t)throw new TypeError("Condition "+z(e)+" did not resolve to a boolean.");return e.negate?!t:t})}function I(e,t){var r=e.match(le);if(!r)return Promise.resolve(e);var n=M(r[0].substr(2,r[0].length-3));return this.builder?this.normalize(n.module,t).then(function(t){return n.module=t,e.replace(le,"#{"+z(n)+"}")}):T.call(this,n,t,!1).then(function(r){if("string"!=typeof r)throw new TypeError("The condition value for "+e+" doesn't resolve to a string.");if(-1!=r.indexOf("/"))throw new TypeError("Unabled to interpolate conditional "+e+(t?" in "+t:"")+"\n	The condition value "+r+' cannot contain a "/" separator.');return e.replace(le,r)})}function L(e,t){var r=e.lastIndexOf("#?");if(-1==r)return Promise.resolve(e);var n=M(e.substr(r+2));return this.builder?this.normalize(n.module,t).then(function(t){return n.module=t,e.substr(0,r)+"#?"+z(n)}):T.call(this,n,t,!0).then(function(t){return t?e.substr(0,r):"@empty"})}var A="undefined"==typeof window&&"undefined"!=typeof self&&"undefined"!=typeof importScripts,F="undefined"!=typeof window&&"undefined"!=typeof document,D="undefined"!=typeof process&&"undefined"!=typeof process.platform&&!!process.platform.match(/^win/);e.console||(e.console={assert:function(){}});var q,J=Array.prototype.indexOf||function(e){for(var t=0,r=this.length;r>t;t++)if(this[t]===e)return t;return-1};!function(){try{Object.defineProperty({},"a",{})&&(q=Object.defineProperty)}catch(e){q=function(e,t,r){try{e[t]=r.value||r.get.call(e)}catch(n){}}}}();var U,C="_"==new Error(0,"_").fileName;if("undefined"!=typeof document&&document.getElementsByTagName){if(U=document.baseURI,!U){var N=document.getElementsByTagName("base");U=N[0]&&N[0].href||window.location.href}U=U.split("#")[0].split("?")[0],U=U.substr(0,U.lastIndexOf("/")+1)}else if("undefined"!=typeof process&&process.cwd)U="file://"+(D?"/":"")+process.cwd()+"/",D&&(U=U.replace(/\\/g,"/"));else{if("undefined"==typeof location)throw new TypeError("No environment baseURI");U=e.location.href}try{var $="test:"==new e.URL("test:///").protocol}catch(B){}var H=$?e.URL:e.URLPolyfill;q(n.prototype,"toString",{value:function(){return"Module"}}),function(){function o(e){return{status:"loading",name:e,linkSets:[],dependencies:[],metadata:{}}}function i(e,t,r){return new Promise(c({step:r.address?"fetch":"locate",loader:e,moduleName:t,moduleMetadata:r&&r.metadata||{},moduleSource:r.source,moduleAddress:r.address}))}function s(e,t,r,n){return new Promise(function(a,o){a(e.loaderObj.normalize(t,r,n))}).then(function(t){var r;if(e.modules[t])return r=o(t),r.status="linked",r.module=e.modules[t],r;for(var n=0,a=e.loads.length;a>n;n++)if(r=e.loads[n],r.name==t)return r;return r=o(t),e.loads.push(r),l(e,r),r})}function l(e,t){u(e,t,Promise.resolve().then(function(){return e.loaderObj.locate({name:t.name,metadata:t.metadata})}))}function u(e,t,r){d(e,t,r.then(function(r){return"loading"==t.status?(t.address=r,e.loaderObj.fetch({name:t.name,metadata:t.metadata,address:r})):void 0}))}function d(t,n,a){a.then(function(a){return"loading"==n.status?Promise.resolve(t.loaderObj.translate({name:n.name,metadata:n.metadata,address:n.address,source:a})).then(function(e){return n.source=e,t.loaderObj.instantiate({name:n.name,metadata:n.metadata,address:n.address,source:e})}).then(function(a){if(void 0===a)return n.address=n.address||"<Anonymous Module "+ ++_+">",n.isDeclarative=!0,E.call(t.loaderObj,n).then(function(t){var a=e.System,o=a.register;a.register=function(e,t,r){"string"!=typeof e&&(r=t,t=e),n.declare=r,n.depsList=t},r(t,n.address,{}),a.register=o});if("object"!=typeof a)throw TypeError("Invalid instantiate return value");n.depsList=a.deps||[],n.execute=a.execute,n.isDeclarative=!1}).then(function(){n.dependencies=[];for(var e=n.depsList,r=[],a=0,o=e.length;o>a;a++)(function(e,a){r.push(s(t,e,n.name,n.address).then(function(t){if(n.dependencies[a]={key:e,value:t.name},"linked"!=t.status)for(var r=n.linkSets.concat([]),o=0,i=r.length;i>o;o++)m(r[o],t)}))})(e[a],a);return Promise.all(r)}).then(function(){n.status="loaded";for(var e=n.linkSets.concat([]),t=0,r=e.length;r>t;t++)h(e[t],n)}):void 0})["catch"](function(e){n.status="failed",n.exception=e;for(var t=n.linkSets.concat([]),r=0,a=t.length;a>r;r++)g(t[r],n,e)})}function c(e){return function(t,r){var n=e.loader,a=e.moduleName,i=e.step;if(n.modules[a])throw new TypeError('"'+a+'" already exists in the module table');for(var s,c=0,m=n.loads.length;m>c;c++)if(n.loads[c].name==a&&(s=n.loads[c],"translate"!=i||s.source||(s.address=e.moduleAddress,d(n,s,Promise.resolve(e.moduleSource))),s.linkSets.length&&s.linkSets[0].loads[0].name==s.name))return s.linkSets[0].done.then(function(){t(s)});var p=s||o(a);p.metadata=e.moduleMetadata;var h=f(n,p);n.loads.push(p),t(h.done),"locate"==i?l(n,p):"fetch"==i?u(n,p,Promise.resolve(e.moduleAddress)):(p.address=e.moduleAddress,d(n,p,Promise.resolve(e.moduleSource)))}}function f(e,t){var r={loader:e,loads:[],startingLoad:t,loadingCount:0};return r.done=new Promise(function(e,t){r.resolve=e,r.reject=t}),m(r,t),r}function m(e,t){if("failed"!=t.status){for(var r=0,n=e.loads.length;n>r;r++)if(e.loads[r]==t)return;e.loads.push(t),t.linkSets.push(e),"loaded"!=t.status&&e.loadingCount++;for(var a=e.loader,r=0,n=t.dependencies.length;n>r;r++)if(t.dependencies[r]){var o=t.dependencies[r].value;if(!a.modules[o])for(var i=0,s=a.loads.length;s>i;i++)if(a.loads[i].name==o){m(e,a.loads[i]);break}}}}function p(e){var t=!1;try{w(e,function(r,n){g(e,r,n),t=!0})}catch(r){g(e,null,r),t=!0}return t}function h(e,t){if(e.loadingCount--,!(e.loadingCount>0)){var r=e.startingLoad;if(e.loader.loaderObj.execute===!1){for(var n=[].concat(e.loads),a=0,o=n.length;o>a;a++){var t=n[a];t.module=t.isDeclarative?{name:t.name,module:j({}),evaluated:!0}:{module:j({})},t.status="linked",v(e.loader,t)}return e.resolve(r)}var i=p(e);i||e.resolve(r)}}function g(e,r,n){var a=e.loader;e:if(r)if(e.loads[0].name==r.name)n=t(n,"Error loading "+r.name);else{for(var o=0;o<e.loads.length;o++)for(var i=e.loads[o],s=0;s<i.dependencies.length;s++){var l=i.dependencies[s];if(l.value==r.name){n=t(n,"Error loading "+r.name+' as "'+l.key+'" from '+i.name);break e}}n=t(n,"Error loading "+r.name+" from "+e.loads[0].name)}else n=t(n,"Error linking "+e.loads[0].name);for(var u=e.loads.concat([]),o=0,d=u.length;d>o;o++){var r=u[o];a.loaderObj.failed=a.loaderObj.failed||[],-1==J.call(a.loaderObj.failed,r)&&a.loaderObj.failed.push(r);var c=J.call(r.linkSets,e);if(r.linkSets.splice(c,1),0==r.linkSets.length){var f=J.call(e.loader.loads,r);-1!=f&&e.loader.loads.splice(f,1)}}e.reject(n)}function v(e,t){if(e.loaderObj.trace){e.loaderObj.loads||(e.loaderObj.loads={});var r={};t.dependencies.forEach(function(e){r[e.key]=e.value}),e.loaderObj.loads[t.name]={name:t.name,deps:t.dependencies.map(function(e){return e.key}),depMap:r,address:t.address,metadata:t.metadata,source:t.source,kind:t.isDeclarative?"declarative":"dynamic"}}t.name&&(e.modules[t.name]=t.module);var n=J.call(e.loads,t);-1!=n&&e.loads.splice(n,1);for(var a=0,o=t.linkSets.length;o>a;a++)n=J.call(t.linkSets[a].loads,t),-1!=n&&t.linkSets[a].loads.splice(n,1);t.linkSets.splice(0,t.linkSets.length)}function y(e,t,r){try{var a=t.execute()}catch(o){return void r(t,o)}return a&&a instanceof n?a:void r(t,new TypeError("Execution must define a Module instance"))}function b(e,t,r){var n=e._loader.importPromises;return n[t]=r.then(function(e){return n[t]=void 0,e},function(e){throw n[t]=void 0,e})}function w(e,t){var r=e.loader;if(e.loads.length)for(var n=e.loads.concat([]),a=0;a<n.length;a++){var o=n[a],i=y(e,o,t);if(!i)return;o.module={name:o.name,module:i},o.status="linked",v(r,o)}}function x(e,t){return t.module.module}function S(){}function E(){throw new TypeError("ES6 transpilation is only provided in the dev module loader build.")}var _=0;a.prototype={constructor:a,define:function(e,t,r){if(this._loader.importPromises[e])throw new TypeError("Module is already loading.");return b(this,e,new Promise(c({step:"translate",loader:this._loader,moduleName:e,moduleMetadata:r&&r.metadata||{},moduleSource:t,moduleAddress:r&&r.address})))},"delete":function(e){var t=this._loader;return delete t.importPromises[e],delete t.moduleRecords[e],t.modules[e]?delete t.modules[e]:!1},get:function(e){return this._loader.modules[e]?(S(this._loader.modules[e],[],this),this._loader.modules[e].module):void 0},has:function(e){return!!this._loader.modules[e]},"import":function(e,t,r){"object"==typeof t&&(t=t.name);var n=this;return Promise.resolve(n.normalize(e,t)).then(function(e){var t=n._loader;return t.modules[e]?(S(t.modules[e],[],t._loader),t.modules[e].module):t.importPromises[e]||b(n,e,i(t,e,{}).then(function(r){return delete t.importPromises[e],x(t,r)}))})},load:function(e){var t=this._loader;return t.modules[e]?Promise.resolve():t.importPromises[e]||b(this,e,new Promise(c({step:"locate",loader:t,moduleName:e,moduleMetadata:{},moduleSource:void 0,moduleAddress:void 0})).then(function(){delete t.importPromises[e]}))},module:function(e,t){var r=o();r.address=t&&t.address;var n=f(this._loader,r),a=Promise.resolve(e),i=this._loader,s=n.done.then(function(){return x(i,r)});return d(i,r,a),s},newModule:function(e){if("object"!=typeof e)throw new TypeError("Expected object");var t=new n,r=[];if(Object.getOwnPropertyNames&&null!=e)r=Object.getOwnPropertyNames(e);else for(var a in e)r.push(a);for(var o=0;o<r.length;o++)(function(r){q(t,r,{configurable:!1,enumerable:!0,get:function(){return e[r]},set:function(){throw new Error("Module exports cannot be changed externally.")}})})(r[o]);return Object.freeze&&Object.freeze(t),t},set:function(e,t){if(!(t instanceof n))throw new TypeError("Loader.set("+e+", module) must be a module");this._loader.modules[e]={module:t}},normalize:function(e,t,r){return e},locate:function(e){return e.name},fetch:function(e){},translate:function(e){return e.source},instantiate:function(e){}};var j=a.prototype.newModule}();var X;s.prototype=a.prototype,o.prototype=new s;var Z;if("undefined"!=typeof XMLHttpRequest)Z=function(e,t,r,n){function a(){r(i.responseText)}function o(){n(new Error("XHR error"+(i.status?" ("+i.status+(i.statusText?" "+i.statusText:"")+")":"")+" loading "+e))}var i=new XMLHttpRequest,s=!0,l=!1;if(!("withCredentials"in i)){var u=/^(\w+:)?\/\/([^\/]+)/.exec(e);u&&(s=u[2]===window.location.host,u[1]&&(s&=u[1]===window.location.protocol))}s||"undefined"==typeof XDomainRequest||(i=new XDomainRequest,i.onload=a,i.onerror=o,i.ontimeout=o,i.onprogress=function(){},i.timeout=0,l=!0),i.onreadystatechange=function(){4===i.readyState&&(0==i.status?i.responseText?a():(i.addEventListener("error",o),i.addEventListener("load",a)):200===i.status?a():o())},i.open("GET",e,!0),i.setRequestHeader&&(i.setRequestHeader("Accept","application/x-es-module, */*"),t&&("string"==typeof t&&i.setRequestHeader("Authorization",t),i.withCredentials=!0)),l?setTimeout(function(){i.send()},0):i.send(null)};else if("undefined"!=typeof require&&"undefined"!=typeof process){var G;Z=function(e,t,r,n){if("file:///"!=e.substr(0,8))throw new Error('Unable to fetch "'+e+'". Only file URLs of the form file:/// allowed running in Node.');return G=G||require("fs"),e=D?e.replace(/\//g,"\\").substr(8):e.substr(7),G.readFile(e,function(e,t){if(e)return n(e);var a=t+"";"\ufeff"===a[0]&&(a=a.substr(1)),r(a)})}}else{if("undefined"==typeof self||"undefined"==typeof self.fetch)throw new TypeError("No environment fetch API available.");Z=function(e,t,r,n){var a={headers:{Accept:"application/x-es-module, */*"}};t&&("string"==typeof t&&(a.headers.Authorization=t),a.credentials="include"),fetch(e,a).then(function(e){if(e.ok)return e.text();throw new Error("Fetch error: "+e.status+" "+e.statusText)}).then(r,n)}}o.prototype.fetch=function(e){return new Promise(function(t,r){Z(e.address,void 0,t,r)})};var W=function(){function t(t){var n=this;return Promise.resolve(e["typescript"==n.transpiler?"ts":n.transpiler]||(n.pluginLoader||n)["import"](n.transpiler)).then(function(e){e.__useDefault&&(e=e["default"]);var a;return a=e.Compiler?r:e.createLanguageService?i:o,"(function(__moduleName){"+a.call(n,t,e)+'\n})("'+t.name+'");\n//# sourceURL='+t.address+"!transpiled"})}function r(e,t){var r=this.traceurOptions||{};r.modules="instantiate",r.script=!1,void 0===r.sourceMaps&&(r.sourceMaps="inline"),r.filename=e.address,r.inputSourceMap=e.metadata.sourceMap,r.moduleName=!1;var a=new t.Compiler(r);return n(e.source,a,r.filename)}function n(e,t,r){try{return t.compile(e,r)}catch(n){if(n.length)throw n[0];throw n}}function o(e,t){var r=this.babelOptions||{};return r.modules="system",void 0===r.sourceMap&&(r.sourceMap="inline"),r.inputSourceMap=e.metadata.sourceMap,r.filename=e.address,r.code=!0,r.ast=!1,t.transform(e.source,r).code}function i(e,t){var r=this.typescriptOptions||{};return r.target=r.target||t.ScriptTarget.ES5,void 0===r.sourceMap&&(r.sourceMap=!0),r.sourceMap&&r.inlineSourceMap!==!1&&(r.inlineSourceMap=!0),r.module=t.ModuleKind.System,t.transpile(e.source,r,e.address)}return a.prototype.transpiler="traceur",t}();u.prototype=o.prototype,l.prototype=new u,l.prototype.constructor=l,l.prototype.instantiate=function(){};var V,K=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(B){K=!1}var Y,Q=["main","format","defaultExtension","meta","map","basePath","depCache"];!function(){function r(e){var t=e.source.lastIndexOf("\n"),r="global"!=e.metadata.format,n=e.metadata.sourceMap;if(n){if("object"!=typeof n)throw new TypeError("load.metadata.sourceMap must be set to an object.");n=JSON.stringify(n)}return(r?"(function(System, SystemJS) {":"")+e.source+(r?"\n})(System, System);":"")+("\n//# sourceURL="!=e.source.substr(t,15)?"\n//# sourceURL="+e.address+(n?"!transpiled":""):"")+(n&&s&&"\n//# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(n)))||"")}function n(t,r){i=r,0==c++&&(l=e.System),e.System=e.SystemJS=t}function a(){0==--c&&(e.System=e.SystemJS=l),i=void 0}function o(e){p||(p=document.head||document.body||document.documentElement);var o=document.createElement("script");o.text=r(e,!1);var i,s=window.onerror;if(window.onerror=function(r){i=t(r,"Evaluating "+e.address)},n(this,e),e.metadata.integrity&&o.setAttribute("integrity",e.metadata.integrity),e.metadata.nonce&&o.setAttribute("nonce",e.metadata.nonce),p.appendChild(o),p.removeChild(o),a(),window.onerror=s,i)throw i}var i,s="undefined"!=typeof btoa;d("pushRegister_",function(){return function(e){return i?(this.reduceRegister_(i,e),!0):!1}});var l,u,c=0;Y=function(e){if(e.source){if((e.metadata.integrity||e.metadata.nonce)&&f)return o.call(this,e);try{n(this,e),i=e,this._nodeRequire?(u=u||this._nodeRequire("vm"),u.runInThisContext(r(e))):(0,eval)(r(e)),a()}catch(s){throw a(),t(s,"Evaluating "+e.address)}}};var f=!1;if(F&&"undefined"!=typeof document&&document.getElementsByTagName){var m=document.getElementsByTagName("script");$__curScript=m[m.length-1],window.chrome&&window.chrome.extension||navigator.userAgent.match(/^Node\.js/)||(f=!0)}var p}();var ee=/^[^\/]+:\/\//,te={},re=new H(U);c(function(e){return function(){e.call(this),this.baseURL=U.substr(0,U.lastIndexOf("/")+1),this.map={},this.paths={},this.warnings=!1,this.defaultJSExtensions=!1,this.pluginFirst=!1,this.loaderErrorStack=!1,this.set("@empty",this.newModule({})),S.call(this,!1)}}),"undefined"==typeof require||"undefined"==typeof process||process.browser||(l.prototype._nodeRequire=require);var ne=["assert","buffer","child_process","cluster","console","constants","crypto","dgram","dns","domain","events","fs","http","https","module","net","os","path","process","punycode","querystring","readline","repl","stream","string_decoder","sys","timers","tls","tty","url","util","vm","zlib"];d("normalize",function(e){return function(e,t,r){var n=k.call(this,e,t);return r||!this.defaultJSExtensions||".js"==n.substr(n.length-3,3)||E(n)||(n+=".js"),n}});var ae="undefined"!=typeof XMLHttpRequest;d("locate",function(e){return function(t){return Promise.resolve(e.call(this,t)).then(function(e){return ae?e.replace(/#/g,"%23"):e})}}),d("fetch",function(){return function(e){return new Promise(function(t,r){Z(e.address,e.metadata.authorization,t,r)})}}),d("import",function(e){return function(t,r,n){return r&&r.name&&y.call(this,"SystemJS.import(name, { name: parentName }) is deprecated for SystemJS.import(name, parentName), while importing "+t+" from "+r.name),e.call(this,t,r,n).then(function(e){return e.__useDefault?e["default"]:e})}}),d("translate",function(e){return function(t){return"detect"==t.metadata.format&&(t.metadata.format=void 0),e.call(this,t)}}),d("instantiate",function(e){return function(e){if("json"==e.metadata.format&&!this.builder){var t=e.metadata.entry=P();t.deps=[],t.execute=function(){try{return JSON.parse(e.source)}catch(t){throw new Error("Invalid JSON file "+e.name)}}}}}),l.prototype.env="development";var oe;l.prototype.config=function(e){function t(e){for(var t in e)if(hasOwnProperty.call(e,t))return!0}var r=this;if("loaderErrorStack"in e&&(oe=$__curScript,e.loaderErrorStack?$__curScript=void 0:$__curScript=oe),"warnings"in e&&(r.warnings=e.warnings),e.transpilerRuntime===!1&&(r._loader.loadedTranspilerRuntime=!0),e.baseURL){if(t(r.packages)||t(r.meta)||t(r.depCache)||t(r.bundles)||t(r.packageConfigPaths))throw new TypeError("Incorrect configuration order. The baseURL must be configured with the first SystemJS.config call.");r.baseURL=e.baseURL,w.call(r)}if(e.defaultJSExtensions&&(r.defaultJSExtensions=e.defaultJSExtensions,y.call(r,"The defaultJSExtensions configuration option is deprecated, use packages configuration instead.")),e.pluginFirst&&(r.pluginFirst=e.pluginFirst),e.production&&S.call(r,!0),e.paths)for(var n in e.paths)r.paths[n]=e.paths[n];if(e.map){var a="";for(var n in e.map){var o=e.map[n];if("string"!=typeof o){a+=(a.length?", ":"")+'"'+n+'"';var i=r.defaultJSExtensions&&".js"!=n.substr(n.length-3,3),s=r.decanonicalize(n);i&&".js"==s.substr(s.length-3,3)&&(s=s.substr(0,s.length-3));var l="";for(var u in r.packages)s.substr(0,u.length)==u&&(!s[u.length]||"/"==s[u.length])&&l.split("/").length<u.split("/").length&&(l=u);l&&r.packages[l].main&&(s=s.substr(0,s.length-r.packages[l].main.length-1));var u=r.packages[s]=r.packages[s]||{};u.map=o}else r.map[n]=o}a&&y.call(r,"The map configuration for "+a+' uses object submaps, which is deprecated in global map.\nUpdate this to use package contextual map with configs like SystemJS.config({ packages: { "'+n+'": { map: {...} } } }).')}if(e.packageConfigPaths){for(var d=[],c=0;c<e.packageConfigPaths.length;c++){var f=e.packageConfigPaths[c],m=Math.max(f.lastIndexOf("*")+1,f.lastIndexOf("/")),i=r.defaultJSExtensions&&".js"!=f.substr(m-3,3),p=r.decanonicalize(f.substr(0,m));i&&".js"==p.substr(p.length-3,3)&&(p=p.substr(0,p.length-3)),d[c]=p+f.substr(m)}r.packageConfigPaths=d}if(e.bundles)for(var n in e.bundles){for(var h=[],c=0;c<e.bundles[n].length;c++){var i=r.defaultJSExtensions&&".js"!=e.bundles[n][c].substr(e.bundles[n][c].length-3,3),g=r.decanonicalize(e.bundles[n][c]);i&&".js"==g.substr(g.length-3,3)&&(g=g.substr(0,g.length-3)),h.push(g)}r.bundles[n]=h}if(e.packages)for(var n in e.packages){if(n.match(/^([^\/]+:)?\/\/$/))throw new TypeError('"'+n+'" is not a valid package name.');var s=k.call(r,n);"/"==s[s.length-1]&&(s=s.substr(0,s.length-1)),r.packages[s]=r.packages[s]||{};var u=e.packages[n];u.modules&&(y.call(r,"Package "+n+' is configured with "modules", which is deprecated as it has been renamed to "meta".'),u.meta=u.modules,delete u.modules),"object"==typeof u.main&&(u.map=u.map||{},u.map["./@main"]=u.main,u.main["default"]=u.main["default"]||"./",u.main="@main");for(var b in u)-1==J.call(Q,b)&&y.call(r,'"'+b+'" is not a valid package configuration option in package '+n);v(r.packages[s],u)}for(var x in e){var o=e[x];if("baseURL"!=x&&"map"!=x&&"packages"!=x&&"bundles"!=x&&"paths"!=x&&"warnings"!=x&&"packageConfigPaths"!=x&&"loaderErrorStack"!=x)if("object"!=typeof o||o instanceof Array)r[x]=o;else{r[x]=r[x]||{};for(var n in o)if("meta"==x&&"*"==n[0])r[x][n]=o[n];else if("meta"==x){var _=k.call(r,n);r.defaultJSExtensions&&".js"!=_.substr(_.length-3,3)&&!E(_)&&(_+=".js"),r[x][_]=o[n]}else if("depCache"==x){var i=r.defaultJSExtensions&&".js"!=n.substr(n.length-3,3),s=r.decanonicalize(n);i&&".js"==s.substr(s.length-3,3)&&(s=s.substr(0,s.length-3)),r[x][s]=o[n]}else r[x][n]=o[n]}}},function(){function e(e,t){var r,n,a=0;for(var o in e.packages)t.substr(0,o.length)!==o||t.length!==o.length&&"/"!==t[o.length]||(n=o.split("/").length,n>a&&(r=o,a=n));return r}function t(e,t,r,n,a){if(!n||"/"==n[n.length-1]||a||t.defaultExtension===!1)return n;if(n.match(le))return n;var o=!1;if(t.meta&&p(t.meta,n,function(e,t,r){return 0==r||e.lastIndexOf("*")!=e.length-1?o=!0:void 0}),!o&&e.meta&&p(e.meta,r+"/"+n,function(e,t,r){return 0==r||e.lastIndexOf("*")!=e.length-1?o=!0:void 0}),o)return n;var i="."+(t.defaultExtension||"js");return n.substr(n.length-i.length)!=i?n+i:n}function r(e,r,n,o,i){if(!o){if(!r.main)return n+(e.defaultJSExtensions?".js":"");o="./"==r.main.substr(0,2)?r.main.substr(2):r.main}if(r.map){var s="./"+o,l=x(r.map,s);if(l||(s="./"+t(e,r,n,o,i),s!="./"+o&&(l=x(r.map,s))),l)return a(e,r,n,l,s,i)}return n+"/"+t(e,r,n,o,i)}function n(e,t,r){if("."==e)throw new Error("Package "+r+' has a map entry for "." which is not permitted.');if(t.substr(0,e.length)==e&&"/"!=e[e.length-1]&&"/"==t[e.length])throw new Error("Package "+r+' has a recursive map for "'+e+'" which is not permitted.')}function a(e,r,a,o,i,s){var l=r.map[o];if("object"==typeof l)throw new Error("Synchronous conditional normalization not supported sync normalizing "+o+" in "+a);if(n(o,l,a),"string"!=typeof l&&(l=o=i),n(o,l,a),"."==l)l=a;else if("./"==l.substr(0,2))return a+"/"+t(e,r,a,l.substr(2)+i.substr(o.length),s);return e.normalizeSync(l+i.substr(o.length),a+"/")}function o(e,r,n,a,o){if(!a){if(!r.main)return Promise.resolve(n+(e.defaultJSExtensions?".js":""));a="./"==r.main.substr(0,2)?r.main.substr(2):r.main}var i,l;return r.map&&(i="./"+a,l=x(r.map,i),l||(i="./"+t(e,r,n,a,o),i!="./"+a&&(l=x(r.map,i)))),(l?s(e,r,n,l,i,o):Promise.resolve()).then(function(i){return i?Promise.resolve(i):Promise.resolve(n+"/"+t(e,r,n,a,o))})}function i(e,r,n,a,o,i,s){if("."==o)o=n;else if("./"==o.substr(0,2))return Promise.resolve(n+"/"+t(e,r,n,o.substr(2)+i.substr(a.length),s)).then(function(t){return I.call(e,t,n+"/")});return e.normalize(o+i.substr(a.length),n+"/")}function s(e,t,r,a,o,s){var l=t.map[a];return"string"==typeof l?(n(a,l,r),i(e,t,r,a,l,o,s)):e.builder?Promise.resolve(r+"/#:"+o):e["import"](t.map["@env"]||"@system-env",r).then(function(e){for(var t in l){var r="~"==t[0],n=b(r?t.substr(1):t,e);if(!r&&n||r&&!n)return l[t]}}).then(function(l){if(l){if("string"!=typeof l)throw new Error("Unable to map a package conditional to a package conditional.");return n(a,l,r),i(e,t,r,a,l,o,s)}})}function u(e){var t=e.lastIndexOf("*"),r=Math.max(t+1,e.lastIndexOf("/"));return{length:r,regEx:new RegExp("^("+e.substr(0,r).replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,"[^\\/]+")+")(\\/|$)"),wildcard:-1!=t}}function f(e,t){for(var r,n,a=!1,o=0;o<e.packageConfigPaths.length;o++){var i=e.packageConfigPaths[o],s=h[i]||(h[i]=u(i));if(!(t.length<s.length)){var l=t.match(s.regEx);!l||r&&(a&&s.wildcard||!(r.length<l[1].length))||(r=l[1],a=!s.wildcard,n=r+i.substr(s.length))}}return r?{packageName:r,configPath:n}:void 0}function m(e,t,r){var n=e.pluginLoader||e;return(n.meta[r]=n.meta[r]||{}).format="json",n.meta[r].loader=null,n.load(r).then(function(){var a=n.get(r)["default"];a.systemjs&&(a=a.systemjs),a.modules&&(a.meta=a.modules,y.call(e,"Package config file "+r+' is configured with "modules", which is deprecated as it has been renamed to "meta".'));for(var o in a)-1==J.call(Q,o)&&delete a[o];var i=e.packages[t]=e.packages[t]||{};if(v(i,a,!0),a.depCache){for(var s in a.depCache){var l;l="./"==s.substr(0,2)?t+"/"+s.substr(2):k.call(e,s),e.depCache[l]=(e.depCache[l]||[]).concat(a.depCache[s])}delete a.depCache}return"object"==typeof i.main&&(i.map=i.map||{},i.map["./@main"]=i.main,i.main["default"]=i.main["default"]||"./",i.main="@main"),i})}function p(e,t,r){var n;for(var a in e){var o="./"==a.substr(0,2)?"./":"";if(o&&(a=a.substr(2)),n=a.indexOf("*"),-1!==n&&a.substr(0,n)==t.substr(0,n)&&a.substr(n+1)==t.substr(t.length-a.length+n+1)&&r(a,e[o+a],a.split("/").length))return}var i=e[t]&&e.hasOwnProperty&&e.hasOwnProperty(t)?e[t]:e["./"+t];i&&r(i,i,0)}c(function(e){return function(){e.call(this),this.packages={},this.packageConfigPaths=[]}}),l.prototype.normalizeSync=l.prototype.decanonicalize=l.prototype.normalize,d("decanonicalize",function(t){return function(r,n){if(this.builder)return t.call(this,r,n,!0);var a=t.call(this,r,n);if(!this.defaultJSExtensions)return a;var o=e(this,a),i=this.packages[o],s=i&&i.defaultExtension;return void 0==s&&i&&i.meta&&p(i.meta,a.substr(o),function(e,t,r){return 0==r||e.lastIndexOf("*")!=e.length-1?(s=!1,!0):void 0}),(s===!1||s&&".js"!=s)&&".js"!=r.substr(r.length-3,3)&&".js"==a.substr(a.length-3,3)&&(a=a.substr(0,a.length-3)),a}}),d("normalizeSync",function(t){return function(n,o,i){y.call(this,"SystemJS.normalizeSync has been deprecated for SystemJS.decanonicalize.");var s=this;if(i=i===!0,o)var l=e(s,o)||s.defaultJSExtensions&&".js"==o.substr(o.length-3,3)&&e(s,o.substr(0,o.length-3));var u=l&&s.packages[l];if(u&&"."!=n[0]){var d=u.map,c=d&&x(d,n);if(c&&"string"==typeof d[c])return a(s,u,l,c,n,i)}var m=s.defaultJSExtensions&&".js"!=n.substr(n.length-3,3),p=t.call(s,n,o);m&&".js"!=p.substr(p.length-3,3)&&(m=!1),m&&(p=p.substr(0,p.length-3));var h=f(s,p),g=h&&h.packageName||e(s,p);if(!g)return p+(m?".js":"");var v=p.substr(g.length+1);return r(s,s.packages[g]||{},g,v,i)}}),d("normalize",function(t){return function(r,n,a){var i=this;return a=a===!0,Promise.resolve().then(function(){if(n)var t=e(i,n)||i.defaultJSExtensions&&".js"==n.substr(n.length-3,3)&&e(i,n.substr(0,n.length-3));var o=t&&i.packages[t];if(o&&"./"!=r.substr(0,2)){var l=o.map,u=l&&x(l,r);if(u)return s(i,o,t,u,r,a)}return Promise.resolve()}).then(function(s){if(s)return s;var l=i.defaultJSExtensions&&".js"!=r.substr(r.length-3,3),u=t.call(i,r,n);
l&&".js"!=u.substr(u.length-3,3)&&(l=!1),l&&(u=u.substr(0,u.length-3));var d=f(i,u),c=d&&d.packageName||e(i,u);if(!c)return Promise.resolve(u+(l?".js":""));var p=i.packages[c],h=p&&(p.configured||!d);return(h?Promise.resolve(p):m(i,c,d.configPath)).then(function(e){var t=u.substr(c.length+1);return o(i,e,c,t,a)})})}});var h={};d("locate",function(t){return function(r){var n=this;return Promise.resolve(t.call(this,r)).then(function(t){var a=e(n,r.name);if(a){var o=n.packages[a],i=r.name.substr(a.length+1);o.format&&(r.metadata.format=r.metadata.format||o.format);var s={};if(o.meta){var l=0;p(o.meta,i,function(e,t,r){r>l&&(l=r),v(s,t,r&&l>r)}),v(r.metadata,s)}}return t})}})}(),function(){function t(){if(i&&"interactive"===i.script.readyState)return i.load;for(var e=0;e<u.length;e++)if("interactive"==u[e].script.readyState)return i=u[e],i.load}function r(e,t){return new Promise(function(e,r){t.metadata.integrity&&r(new Error("Subresource integrity checking is not supported in web workers.")),s=t;try{importScripts(t.address)}catch(n){s=null,r(n)}s=null,t.metadata.entry||r(new Error(t.address+" did not call System.register or AMD define")),e("")})}if("undefined"!=typeof document)var n=document.getElementsByTagName("head")[0];var a,o,i,s=null,l=n&&function(){var e=document.createElement("script"),t="undefined"!=typeof opera&&"[object Opera]"===opera.toString();return e.attachEvent&&!(e.attachEvent.toString&&e.attachEvent.toString().indexOf("[native code")<0)&&!t}(),u=[],c=0,f=[];d("pushRegister_",function(e){return function(r){return e.call(this,r)?!1:(s?this.reduceRegister_(s,r):l?this.reduceRegister_(t(),r):c?f.push(r):this.reduceRegister_(null,r),!0)}}),d("fetch",function(t){return function(s){var d=this;return"json"!=s.metadata.format&&s.metadata.scriptLoad&&(F||A)?A?r(d,s):new Promise(function(t,r){function m(e){if(!g.readyState||"loaded"==g.readyState||"complete"==g.readyState){if(c--,s.metadata.entry||f.length){if(!l){for(var n=0;n<f.length;n++)d.reduceRegister_(s,f[n]);f=[]}}else d.reduceRegister_(s);h(),s.metadata.entry||s.metadata.bundle||r(new Error(s.name+" did not call System.register or AMD define. If loading a global module configure the global name via the meta exports property for script injection support.")),t("")}}function p(e){h(),r(new Error("Unable to load script "+s.address))}function h(){if(e.System=a,e.require=o,g.detachEvent){g.detachEvent("onreadystatechange",m);for(var t=0;t<u.length;t++)u[t].script==g&&(i&&i.script==g&&(i=null),u.splice(t,1))}else g.removeEventListener("load",m,!1),g.removeEventListener("error",p,!1);n.removeChild(g)}var g=document.createElement("script");g.async=!0,s.metadata.crossOrigin&&(g.crossOrigin=s.metadata.crossOrigin),s.metadata.integrity&&g.setAttribute("integrity",s.metadata.integrity),l?(g.attachEvent("onreadystatechange",m),u.push({script:g,load:s})):(g.addEventListener("load",m,!1),g.addEventListener("error",p,!1)),c++,a=e.System,o=e.require,g.src=s.address,n.appendChild(g)}):t.call(this,s)}})}();var ie=/^(\s*\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)*\s*/;!function(){function t(e,r,n){if(n[e.groupIndex]=n[e.groupIndex]||[],-1==J.call(n[e.groupIndex],e)){n[e.groupIndex].push(e);for(var a=0,o=e.normalizedDeps.length;o>a;a++){var i=e.normalizedDeps[a],s=r.defined[i];if(s&&!s.evaluated){var l=e.groupIndex+(s.declarative!=e.declarative);if(null===s.groupIndex||s.groupIndex<l){if(null!==s.groupIndex&&(n[s.groupIndex].splice(J.call(n[s.groupIndex],s),1),0==n[s.groupIndex].length))throw new Error("Mixed dependency cycle detected");s.groupIndex=l}t(s,r,n)}}}}function r(e,r){var n=r.defined[e];if(!n.module){n.groupIndex=0;var a=[];t(n,r,a);for(var o=!!n.declarative==a.length%2,s=a.length-1;s>=0;s--){for(var l=a[s],d=0;d<l.length;d++){var c=l[d];o?i(c,r):u(c,r)}o=!o}}}function a(){}function o(e,t){return t[e]||(t[e]={name:e,dependencies:[],exports:new a,importers:[]})}function i(t,r){if(!t.module){var n=r._loader.moduleRecords,a=t.module=o(t.name,n),s=t.module.exports,l=t.declare.call(e,function(e,t){if(a.locked=!0,"object"==typeof e)for(var r in e)s[r]=e[r];else s[e]=t;for(var n=0,o=a.importers.length;o>n;n++){var i=a.importers[n];if(!i.locked){var l=J.call(i.dependencies,a);i.setters[l](s)}}return a.locked=!1,t},{id:t.name});if(a.setters=l.setters,a.execute=l.execute,!a.setters||!a.execute)throw new TypeError("Invalid System.register form for "+t.name);for(var u=0,d=t.normalizedDeps.length;d>u;u++){var c,f=t.normalizedDeps[u],m=r.defined[f],p=n[f];p?c=p.exports:m&&!m.declarative?c=m.esModule:m?(i(m,r),p=m.module,c=p.exports):c=r.get(f),p&&p.importers?(p.importers.push(a),a.dependencies.push(p)):a.dependencies.push(null);for(var h=t.originalIndices[u],g=0,v=h.length;v>g;++g){var y=h[g];a.setters[y]&&a.setters[y](c)}}}}function s(e,t){var r,n=t.defined[e];if(n)n.declarative?p(e,[],t):n.evaluated||u(n,t),r=n.module.exports;else if(r=t.get(e),!r)throw new Error("Unable to load dependency "+e+".");return(!n||n.declarative)&&r&&r.__useDefault?r["default"]:r}function u(t,r){if(!t.module){var a={},o=t.module={exports:a,id:t.name};if(!t.executingRequire)for(var i=0,l=t.normalizedDeps.length;l>i;i++){var d=t.normalizedDeps[i],c=r.defined[d];c&&u(c,r)}t.evaluated=!0;var f=t.execute.call(e,function(e){for(var n=0,a=t.deps.length;a>n;n++)if(t.deps[n]==e)return s(t.normalizedDeps[n],r);var o=r.normalizeSync(e,t.name);if(-1!=J.call(t.normalizedDeps,o))return s(o,r);throw new Error("Module "+e+" not declared as a dependency of "+t.name)},a,o);f&&(o.exports=f),a=o.exports,a&&(a.__esModule||a instanceof n)?t.esModule=a:t.esmExports&&a!==e?t.esModule=m(a):t.esModule={"default":a}}}function p(t,r,n){var a=n.defined[t];if(a&&!a.evaluated&&a.declarative){r.push(t);for(var o=0,i=a.normalizedDeps.length;i>o;o++){var s=a.normalizedDeps[o];-1==J.call(r,s)&&(n.defined[s]?p(s,r,n):n.get(s))}a.evaluated||(a.evaluated=!0,a.module.execute.call(e))}}l.prototype.register=function(e,t,r){if("string"!=typeof e&&(r=t,t=e,e=null),"boolean"==typeof r)return this.registerDynamic.apply(this,arguments);var n=P();n.name=e&&(this.decanonicalize||this.normalize).call(this,e),n.declarative=!0,n.deps=t,n.declare=r,this.pushRegister_({amd:!1,entry:n})},l.prototype.registerDynamic=function(e,t,r,n){"string"!=typeof e&&(n=r,r=t,t=e,e=null);var a=P();a.name=e&&(this.decanonicalize||this.normalize).call(this,e),a.deps=t,a.execute=n,a.executingRequire=r,this.pushRegister_({amd:!1,entry:a})},d("reduceRegister_",function(){return function(e,t){if(t){var r=t.entry,n=e&&e.metadata;if(r.name&&(r.name in this.defined||(this.defined[r.name]=r),n&&(n.bundle=!0)),!r.name||e&&r.name==e.name){if(!n)throw new TypeError("Invalid System.register call. Anonymous System.register calls can only be made by modules loaded by SystemJS.import and not via script tags.");if(n.entry)throw"register"==n.format?new Error("Multiple anonymous System.register calls in module "+e.name+". If loading a bundle, ensure all the System.register calls are named."):new Error("Module "+e.name+" interpreted as "+n.format+" module format, but called System.register.");n.format||(n.format="register"),n.entry=r}}}}),c(function(e){return function(){e.call(this),this.defined={},this._loader.moduleRecords={}}}),q(a,"toString",{value:function(){return"Module"}}),d("delete",function(e){return function(t){return delete this._loader.moduleRecords[t],delete this.defined[t],e.call(this,t)}}),d("fetch",function(e){return function(t){return this.defined[t.name]?(t.metadata.format="defined",""):(t.metadata.deps=t.metadata.deps||[],e.call(this,t))}}),d("translate",function(e){return function(t){return t.metadata.deps=t.metadata.deps||[],Promise.resolve(e.call(this,t)).then(function(e){return("register"==t.metadata.format||!t.metadata.format&&R(t.source))&&(t.metadata.format="register"),e})}}),d("instantiate",function(e){return function(t){"detect"==t.metadata.format&&(t.metadata.format=void 0),e.call(this,t);var n,a=this;if(a.defined[t.name])n=a.defined[t.name],n.declarative||(n.deps=n.deps.concat(t.metadata.deps));else if(t.metadata.entry)n=t.metadata.entry,n.deps=n.deps.concat(t.metadata.deps);else if(!(a.builder&&t.metadata.bundle||"register"!=t.metadata.format&&"esm"!=t.metadata.format&&"es6"!=t.metadata.format)){if("undefined"!=typeof Y&&Y.call(a,t),!t.metadata.entry&&!t.metadata.bundle)throw new Error(t.name+" detected as "+t.metadata.format+" but didn't execute.");n=t.metadata.entry,n&&t.metadata.deps&&(n.deps=n.deps.concat(t.metadata.deps))}n||(n=P(),n.deps=t.metadata.deps,n.execute=function(){}),a.defined[t.name]=n;var o=f(n.deps);n.deps=o.names,n.originalIndices=o.indices,n.name=t.name,n.esmExports=t.metadata.esmExports!==!1;for(var i=[],s=0,l=n.deps.length;l>s;s++)i.push(Promise.resolve(a.normalize(n.deps[s],t.name)));return Promise.all(i).then(function(e){return n.normalizedDeps=e,{deps:n.deps,execute:function(){return r(t.name,a),p(t.name,[],a),a.defined[t.name]=void 0,a.newModule(n.declarative?n.module.exports:n.esModule)}}})}})}(),function(){var t=/(^\s*|[}\);\n]\s*)(import\s*(['"]|(\*\s+as\s+)?[^"'\(\)\n;]+\s*from\s*['"]|\{)|export\s+\*\s+from\s+["']|export\s*(\{|default|function|class|var|const|let|async\s+function))/,r=/\$traceurRuntime\s*\./,n=/babelHelpers\s*\./;d("translate",function(a){return function(o){var i=this;return a.call(i,o).then(function(a){if("esm"==o.metadata.format||"es6"==o.metadata.format||!o.metadata.format&&a.match(t)){if("es6"==o.metadata.format&&y.call(i,"Module "+o.name+' has metadata setting its format to "es6", which is deprecated.\nThis should be updated to "esm".'),o.metadata.format="esm",i.transpiler===!1){if(i.builder)return a;throw new TypeError("Unable to dynamically transpile ES module as SystemJS.transpiler set to false.")}return i._loader.loadedTranspiler=i._loader.loadedTranspiler||!1,i.pluginLoader&&(i.pluginLoader._loader.loadedTranspiler=i._loader.loadedTranspiler||!1),(i._loader.transpilerPromise||(i._loader.transpilerPromise=Promise.resolve(e["typescript"==i.transpiler?"ts":i.transpiler]||(i.pluginLoader||i)["import"](i.transpiler)))).then(function(e){return i._loader.loadedTranspilerRuntime=!0,e.translate?e==o.metadata.loaderModule?o.source:("string"==typeof o.metadata.sourceMap&&(o.metadata.sourceMap=JSON.parse(o.metadata.sourceMap)),Promise.resolve(e.translate.call(i,o)).then(function(e){var t=o.metadata.sourceMap;if(t&&"object"==typeof t){var r=o.name.split("!")[0];t.file=r+"!transpiled",(!t.sources||t.sources.length<=1)&&(t.sources=[r])}return"esm"==o.metadata.format&&!i.builder&&R(e)&&(o.metadata.format="register"),e})):(i.builder&&(o.metadata.originalSource=o.source),W.call(i,o).then(function(e){return o.metadata.sourceMap=void 0,e}))})}if(i.transpiler===!1)return a;if(i._loader.loadedTranspiler!==!1||"traceur"!=i.transpiler&&"typescript"!=i.transpiler&&"babel"!=i.transpiler||o.name!=i.normalizeSync(i.transpiler)||(a.length>100&&!o.metadata.format&&(o.metadata.format="global","traceur"===i.transpiler&&(o.metadata.exports="traceur"),"typescript"===i.transpiler&&(o.metadata.exports="ts")),i._loader.loadedTranspiler=!0),i._loader.loadedTranspilerRuntime===!1&&(o.name==i.normalizeSync("traceur-runtime")||o.name==i.normalizeSync("babel/external-helpers*"))&&(a.length>100&&(o.metadata.format=o.metadata.format||"global"),i._loader.loadedTranspilerRuntime=!0),("register"==o.metadata.format||o.metadata.bundle)&&i._loader.loadedTranspilerRuntime!==!0){if(!e.$traceurRuntime&&o.source.match(r))return i._loader.loadedTranspilerRuntime=i._loader.loadedTranspilerRuntime||!1,i["import"]("traceur-runtime").then(function(){return a});if(!e.babelHelpers&&o.source.match(n))return i._loader.loadedTranspilerRuntime=i._loader.loadedTranspilerRuntime||!1,i["import"]("babel/external-helpers").then(function(){return a})}return a})}})}();var se="undefined"!=typeof self?"self":"global";d("fetch",function(e){return function(t){return t.metadata.exports&&!t.metadata.format&&(t.metadata.format="global"),e.call(this,t)}}),d("instantiate",function(e){return function(t){var r=this;if(t.metadata.format||(t.metadata.format="global"),"global"==t.metadata.format&&!t.metadata.registered){var n=P();t.metadata.entry=n,n.deps=[];for(var a in t.metadata.globals){var o=t.metadata.globals[a];o&&n.deps.push(o)}n.execute=function(e,n,a){var o;if(t.metadata.globals){o={};for(var i in t.metadata.globals)t.metadata.globals[i]&&(o[i]=e(t.metadata.globals[i]))}var s=t.metadata.exports;s&&(t.source+="\n"+se+'["'+s+'"] = '+s+";");var l=r.get("@@global-helpers").prepareGlobal(a.id,s,o);return Y.call(r,t),l()}}return e.call(this,t)}}),d("reduceRegister_",function(e){return function(t,r){if(r||!t.metadata.exports)return e.call(this,t,r);t.metadata.format="global";var n=t.metadata.entry=P();n.deps=t.metadata.deps;var a=O(t.metadata.exports);n.execute=function(){return a}}}),c(function(t){return function(){function r(t){if(Object.keys)Object.keys(e).forEach(t);else for(var r in e)i.call(e,r)&&t(r)}function n(t){r(function(r){if(-1==J.call(s,r)){try{var n=e[r]}catch(a){s.push(r)}t(r,n)}})}var a=this;t.call(a);var o,i=Object.prototype.hasOwnProperty,s=["_g","sessionStorage","localStorage","clipboardData","frames","frameElement","external","mozAnimationStartTime","webkitStorageInfo","webkitIndexedDB","mozInnerScreenY","mozInnerScreenX"];a.set("@@global-helpers",a.newModule({prepareGlobal:function(t,r,a){var i=e.define;e.define=void 0;var s;if(a){s={};for(var l in a)s[l]=e[l],e[l]=a[l]}return r||(o={},n(function(e,t){o[e]=t})),function(){var t;if(r)t=O(r);else{t={};var a,l;n(function(e,r){o[e]!==r&&"undefined"!=typeof r&&(t[e]=r,"undefined"!=typeof a?l||a===r||(l=!0):a=r)}),t=l?t:a}if(s)for(var u in s)e[u]=s[u];return e.define=i,t}}}))}}),function(){function t(e){function t(e,t){for(var r=0;r<e.length;r++)if(e[r][0]<t.index&&e[r][1]>t.index)return!0;return!1}n.lastIndex=a.lastIndex=o.lastIndex=0;var r,i=[],s=[],l=[];if(e.length/e.split("\n").length<200){for(;r=o.exec(e);)s.push([r.index,r.index+r[0].length]);for(;r=a.exec(e);)t(s,r)||l.push([r.index,r.index+r[0].length])}for(;r=n.exec(e);)if(!t(s,r)&&!t(l,r)){var u=r[1].substr(1,r[1].length-2);if(u.match(/"|'/))continue;"/"==u[u.length-1]&&(u=u.substr(0,u.length-1)),i.push(u)}return i}var r=/(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF.])(exports\s*(\[['"]|\.)|module(\.exports|\['exports'\]|\["exports"\])\s*(\[['"]|[=,\.]))/,n=/(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF."'])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g,a=/(^|[^\\])(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,o=/("[^"\\\n\r]*(\\.[^"\\\n\r]*)*"|'[^'\\\n\r]*(\\.[^'\\\n\r]*)*')/g,i=/^\#\!.*/;d("instantiate",function(a){return function(o){var s=this;if(o.metadata.format||(r.lastIndex=0,n.lastIndex=0,(n.exec(o.source)||r.exec(o.source))&&(o.metadata.format="cjs")),"cjs"==o.metadata.format){var l=o.metadata.deps,u=o.metadata.cjsRequireDetection===!1?[]:t(o.source);for(var d in o.metadata.globals)o.metadata.globals[d]&&u.push(o.metadata.globals[d]);var c=P();o.metadata.entry=c,c.deps=u,c.executingRequire=!0,c.execute=function(t,r,n){function a(e){return"/"==e[e.length-1]&&(e=e.substr(0,e.length-1)),t.apply(this,arguments)}if(a.resolve=function(e){return s.get("@@cjs-helpers").requireResolve(e,n.id)},!o.metadata.cjsDeferDepsExecute)for(var u=0;u<l.length;u++)a(l[u]);var d=s.get("@@cjs-helpers").getPathVars(n.id),c={exports:r,args:[a,r,n,d.filename,d.dirname,e,e]},f="(function(require, exports, module, __filename, __dirname, global, GLOBAL";if(o.metadata.globals)for(var m in o.metadata.globals)c.args.push(a(o.metadata.globals[m])),f+=", "+m;var p=e.define;e.define=void 0,e.__cjsWrapper=c,o.source=f+") {"+o.source.replace(i,"")+"\n}).apply(__cjsWrapper.exports, __cjsWrapper.args);",Y.call(s,o),e.__cjsWrapper=void 0,e.define=p}}return a.call(s,o)}})}(),c(function(e){return function(){function t(e){return"file:///"==e.substr(0,8)?e.substr(7+!!D):n&&e.substr(0,n.length)==n?e.substr(n.length):e}var r=this;if(e.call(r),"undefined"!=typeof window&&"undefined"!=typeof document&&window.location)var n=location.protocol+"//"+location.hostname+(location.port?":"+location.port:"");r.set("@@cjs-helpers",r.newModule({requireResolve:function(e,n){return t(r.normalizeSync(e,n))},getPathVars:function(e){var r,n=e.lastIndexOf("!");r=-1!=n?e.substr(0,n):e;var a=r.split("/");return a.pop(),a=a.join("/"),{filename:t(r),dirname:t(a)}}}))}}),d("fetch",function(t){return function(r){return r.metadata.scriptLoad&&F&&(e.define=this.amdDefine),t.call(this,r)}}),c(function(t){return function(){function r(e,t){e=e.replace(i,"");var r=e.match(u),n=(r[1].split(",")[t]||"require").replace(c,""),a=f[n]||(f[n]=new RegExp(s+n+l,"g"));a.lastIndex=0;for(var o,d=[];o=a.exec(e);)d.push(o[2]||o[3]);return d}function n(e,t,r,a){if("object"==typeof e&&!(e instanceof Array))return n.apply(null,Array.prototype.splice.call(arguments,1,arguments.length-1));if("string"==typeof e&&"function"==typeof t&&(e=[e]),!(e instanceof Array)){if("string"==typeof e){var i=o.defaultJSExtensions&&".js"!=e.substr(e.length-3,3),s=o.decanonicalize(e,a);i&&".js"==s.substr(s.length-3,3)&&(s=s.substr(0,s.length-3));var l=o.get(s);if(!l)throw new Error('Module not already loaded loading "'+e+'" as '+s+(a?' from "'+a+'".':"."));return l.__useDefault?l["default"]:l}throw new TypeError("Invalid require")}for(var u=[],d=0;d<e.length;d++)u.push(o["import"](e[d],a));Promise.all(u).then(function(e){t&&t.apply(null,e)},r)}function a(t,a,i){function s(t,r,s){function c(e,r,a){return"string"==typeof e&&"function"!=typeof r?t(e):n.call(o,e,r,a,s.id)}for(var f=[],m=0;m<a.length;m++)f.push(t(a[m]));s.uri=s.id,s.config=function(){},-1!=d&&f.splice(d,0,s),-1!=u&&f.splice(u,0,r),-1!=l&&(c.toUrl=function(e){var t=o.defaultJSExtensions&&".js"!=e.substr(e.length-3,3),r=o.decanonicalize(e,s.id);return t&&".js"==r.substr(r.length-3,3)&&(r=r.substr(0,r.length-3)),r},f.splice(l,0,c));var p=e.require;e.require=n;var h=i.apply(-1==u?e:r,f);return e.require=p,"undefined"==typeof h&&s&&(h=s.exports),"undefined"!=typeof h?h:void 0}"string"!=typeof t&&(i=a,a=t,t=null),a instanceof Array||(i=a,a=["require","exports","module"].splice(0,i.length)),"function"!=typeof i&&(i=function(e){return function(){return e}}(i)),void 0===a[a.length-1]&&a.pop();var l,u,d;-1!=(l=J.call(a,"require"))&&(a.splice(l,1),t||(a=a.concat(r(i.toString(),l)))),-1!=(u=J.call(a,"exports"))&&a.splice(u,1),-1!=(d=J.call(a,"module"))&&a.splice(d,1);var c=P();c.name=t&&(o.decanonicalize||o.normalize).call(o,t),c.deps=a,c.execute=s,o.pushRegister_({amd:!0,entry:c})}var o=this;t.call(this);var i=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,s="(?:^|[^$_a-zA-Z\\xA0-\\uFFFF.])",l="\\s*\\(\\s*(\"([^\"]+)\"|'([^']+)')\\s*\\)",u=/\(([^\)]*)\)/,c=/^\s+|\s+$/g,f={};a.amd={},d("reduceRegister_",function(e){return function(t,r){if(!r||!r.amd)return e.call(this,t,r);var n=t&&t.metadata,a=r.entry;if(n)if(n.format&&"detect"!=n.format){if(!a.name&&"amd"!=n.format)throw new Error("AMD define called while executing "+n.format+" module "+t.name)}else n.format="amd";if(a.name)n&&(n.entry||n.bundle?n.entry&&n.entry.name&&(n.entry=void 0):n.entry=a,n.bundle=!0),a.name in this.defined||(this.defined[a.name]=a);else{if(!n)throw new TypeError("Unexpected anonymous AMD define.");if(n.entry&&!n.entry.name)throw new Error("Multiple anonymous defines in module "+t.name);n.entry=a}}}),o.amdDefine=a,o.amdRequire=n}}),function(){var t=/(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF.])define\s*\(\s*("[^"]+"\s*,\s*|'[^']+'\s*,\s*)?\s*(\[(\s*(("[^"]+"|'[^']+')\s*,|\/\/.*\r?\n|\/\*(.|\s)*?\*\/))*(\s*("[^"]+"|'[^']+')\s*,?)?(\s*(\/\/.*\r?\n|\/\*(.|\s)*?\*\/))*\s*\]|function\s*|{|[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*\))/;d("instantiate",function(r){return function(n){var a=this;if("amd"==n.metadata.format||!n.metadata.format&&n.source.match(t))if(n.metadata.format="amd",a.builder||a.execute===!1)n.metadata.execute=function(){return n.metadata.builderExecute.apply(this,arguments)};else{var o=e.define;e.define=this.amdDefine;try{Y.call(a,n)}finally{e.define=o}if(!n.metadata.entry&&!n.metadata.bundle)throw new TypeError("AMD module "+n.name+" did not define")}return r.call(a,n)}})}(),function(){function e(e,t){if(t){var r;if(e.pluginFirst){if(-1!=(r=t.lastIndexOf("!")))return t.substr(r+1)}else if(-1!=(r=t.indexOf("!")))return t.substr(0,r);return t}}function t(e,t){var r,n,a=t.lastIndexOf("!");return-1!=a?(e.pluginFirst?(r=t.substr(a+1),n=t.substr(0,a)):(r=t.substr(0,a),n=t.substr(a+1)||r.substr(r.lastIndexOf(".")+1)),{argument:r,plugin:n}):void 0}function r(e,t,r,n){return n&&".js"==t.substr(t.length-3,3)&&(t=t.substr(0,t.length-3)),e.pluginFirst?r+"!"+t:t+"!"+r}function n(e,t){return e.defaultJSExtensions&&".js"!=t.substr(t.length-3,3)}function a(a){return function(o,i,s){var l=this;i=e(this,i);var u=t(l,o);if(!u)return a.call(this,o,i,s);var d=l.normalizeSync(u.argument,i,!0),c=l.normalizeSync(u.plugin,i,!0);return r(l,d,c,n(l,u.argument))}}d("decanonicalize",a),d("normalizeSync",a),d("normalize",function(a){return function(o,i,s){var l=this;i=e(this,i);var u=t(l,o);return u?Promise.all([l.normalize(u.argument,i,!0),l.normalize(u.plugin,i)]).then(function(e){return r(l,e[0],e[1],n(l,u.argument))}):a.call(l,o,i,s)}}),d("locate",function(e){return function(t){var r,n=this,a=t.name;return n.pluginFirst?-1!=(r=a.indexOf("!"))&&(t.metadata.loader=a.substr(0,r),t.name=a.substr(r+1)):-1!=(r=a.lastIndexOf("!"))&&(t.metadata.loader=a.substr(r+1),t.name=a.substr(0,r)),e.call(n,t).then(function(e){return-1==r&&t.metadata.loader?n.normalize(t.metadata.loader,t.name).then(function(r){return t.metadata.loader=r,e}):e}).then(function(e){var r=t.metadata.loader;if(!r)return e;if(t.name==r)throw new Error("Plugin "+r+" cannot load itself, make sure it is excluded from any wildcard meta configuration via a custom loader: false rule.");if(n.defined&&n.defined[a])return e;var o=n.pluginLoader||n;return o["import"](r).then(function(r){return t.metadata.loaderModule=r,t.address=e,r.locate?r.locate.call(n,t):e})})}}),d("fetch",function(e){return function(t){var r=this;return t.metadata.loaderModule&&t.metadata.loaderModule.fetch&&"defined"!=t.metadata.format?(t.metadata.scriptLoad=!1,t.metadata.loaderModule.fetch.call(r,t,function(t){return e.call(r,t)})):e.call(r,t)}}),d("translate",function(e){return function(t){var r=this;return t.metadata.loaderModule&&t.metadata.loaderModule.translate&&"defined"!=t.metadata.format?Promise.resolve(t.metadata.loaderModule.translate.call(r,t)).then(function(n){var a=t.metadata.sourceMap;if(a){if("object"!=typeof a)throw new Error("load.metadata.sourceMap must be set to an object.");var o=t.name.split("!")[0];a.file=o+"!transpiled",(!a.sources||a.sources.length<=1)&&(a.sources=[o])}return"string"==typeof n?t.source=n:y.call(this,"Plugin "+t.metadata.loader+" should return the source in translate, instead of setting load.source directly. This support will be deprecated."),e.call(r,t)}):e.call(r,t)}}),d("instantiate",function(e){return function(t){var r=this,n=!1;return t.metadata.loaderModule&&t.metadata.loaderModule.instantiate&&!r.builder&&"defined"!=t.metadata.format?Promise.resolve(t.metadata.loaderModule.instantiate.call(r,t,function(t){if(n)throw new Error("Instantiate must only be called once.");return n=!0,e.call(r,t)})).then(function(a){return n?a:(t.metadata.entry=P(),t.metadata.entry.execute=function(){return a},t.metadata.entry.deps=t.metadata.deps,t.metadata.format="defined",e.call(r,t))}):e.call(r,t)}})}();var le=/#\{[^\}]+\}/;d("normalize",function(e){return function(t,r,n){var a=this;return L.call(a,t,r).then(function(t){return e.call(a,t,r,n)}).then(function(e){return I.call(a,e,r)})}}),function(){d("fetch",function(e){return function(t){var r=t.metadata.alias,n=t.metadata.deps||[];if(r){t.metadata.format="defined";var a=P();return this.defined[t.name]=a,a.declarative=!0,a.deps=n.concat([r]),a.declare=function(e){return{setters:[function(t){for(var r in t)e(r,t[r]);t.__useDefault&&(a.module.exports.__useDefault=!0)}],execute:function(){}}},""}return e.call(this,t)}})}(),function(){function e(e,t,r){for(var n,a=t.split(".");a.length>1;)n=a.shift(),e=e[n]=e[n]||{};n=a.shift(),n in e||(e[n]=r)}c(function(e){return function(){this.meta={},e.call(this)}}),d("locate",function(e){return function(t){var r,n=this.meta,a=t.name,o=0;for(var i in n)if(r=i.indexOf("*"),-1!==r&&i.substr(0,r)===a.substr(0,r)&&i.substr(r+1)===a.substr(a.length-i.length+r+1)){var s=i.split("/").length;s>o&&(o=s),v(t.metadata,n[i],o!=s)}return n[a]&&v(t.metadata,n[a]),e.call(this,t)}});var t=/^(\s*\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)+/,r=/\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\/\/[^\n]*|"[^"]+"\s*;?|'[^']+'\s*;?/g;d("translate",function(n){return function(a){var o=a.source.match(t);if(o)for(var i=o[0].match(r),s=0;s<i.length;s++){var l=i[s],u=l.length,d=l.substr(0,1);if(";"==l.substr(u-1,1)&&u--,'"'==d||"'"==d){var c=l.substr(1,l.length-3),f=c.substr(0,c.indexOf(" "));if(f){var m=c.substr(f.length+1,c.length-f.length-1);"[]"==f.substr(f.length-2,2)?(f=f.substr(0,f.length-2),a.metadata[f]=a.metadata[f]||[],a.metadata[f].push(m)):a.metadata[f]instanceof Array?(y.call(this,"Module "+a.name+' contains deprecated "deps '+m+'" meta syntax.\nThis should be updated to "deps[] '+m+'" for pushing to array meta.'),a.metadata[f].push(m)):e(a.metadata,f,m)}else a.metadata[c]=!0}}return n.call(this,a)}})}(),function(){c(function(e){return function(){e.call(this),this.bundles={},this._loader.loadedBundles={}}}),d("locate",function(e){return function(t){var r=this,n=!1;if(!(t.name in r.defined))for(var a in r.bundles){for(var o=0;o<r.bundles[a].length;o++){var i=r.bundles[a][o];if(i==t.name){n=!0;break}if(-1!=i.indexOf("*")){var s=i.split("*");if(2!=s.length){r.bundles[a].splice(o--,1);continue}if(t.name.substring(0,s[0].length)==s[0]&&t.name.substr(t.name.length-s[1].length,s[1].length)==s[1]&&-1==t.name.substr(s[0].length,t.name.length-s[1].length-s[0].length).indexOf("/")){n=!0;break}}}if(n)return r["import"](a).then(function(){return e.call(r,t)})}return e.call(r,t)}})}(),function(){c(function(e){return function(){e.call(this),this.depCache={}}}),d("locate",function(e){return function(t){var r=this,n=r.depCache[t.name];if(n)for(var a=0;a<n.length;a++)r["import"](n[a],t.name);return e.call(r,t)}})}(),X=new l,e.SystemJS=X,X.version="0.19.27 Standard","object"==typeof exports&&(module.exports=a),e.Reflect=e.Reflect||{},e.Reflect.Loader=e.Reflect.Loader||a,e.Reflect.global=e.Reflect.global||e,e.LoaderPolyfill=a,X||(X=new o,X.constructor=o),"object"==typeof exports&&(module.exports=X),e.System=X}("undefined"!=typeof self?self:global)}var t="undefined"==typeof Promise;if("undefined"!=typeof document){var r=document.getElementsByTagName("script");if($__curScript=r[r.length-1],t){var n=$__curScript.src,a=n.substr(0,n.lastIndexOf("/")+1);window.systemJSBootstrap=e,document.write('<script type="text/javascript" src="'+a+'system-polyfills.js"></script>')}else e()}else if("undefined"!=typeof importScripts){var a="";try{throw new Error("_")}catch(o){o.stack.replace(/(?:at|@).*(http.+):[\d]+:[\d]+/,function(e,t){$__curScript={src:t},a=t.replace(/\/[^\/]*$/,"/")})}t&&importScripts(a+"system-polyfills.js"),e()}else $__curScript="undefined"!=typeof __filename?{src:__filename}:null,e()}();
//# sourceMappingURL=system.js.map
