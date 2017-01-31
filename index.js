(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nsd"] = factory();
	else
		root["nsd"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(1));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Deferred_1 = __webpack_require__(2);
	var helpers_1 = __webpack_require__(3);
	var CryptoClient = (function () {
	    function CryptoClient(options) {
	        /**
	         * Текущая открытая сессия
	         * @readonly
	         */
	        this.session = null;
	        var _a = this.settings = helpers_1.getOptions(options, CryptoClient.settings), noSsl = _a.noSsl, port = _a.port;
	        this.baseUrl = (noSsl ? 'http' : 'https') + '://127.0.0.1:' + port + '/api/csp';
	    }
	    /**
	     * Возвращает список установленных справочников сертификатов: 'GOST' и/или 'RSA'
	     */
	    CryptoClient.prototype.getTypes = function () {
	        var promise = helpers_1.send(this.baseUrl + '/types', null);
	        return this.settings.transformPromise(promise);
	    };
	    /**
	     * Открывает сессию. Пытается открыть существующую сессию, если указан {@type ICryptoSessionId индентификатор}.
	     * Затем пытается открыть новую сессию, если указаны {@type ICryptoSessionParams параметры}.
	     * @param args идентификатор и/или параметры сессии
	     * @returns открытая сессия
	     */
	    CryptoClient.prototype.open = function (args) {
	        var _this = this;
	        this.session = null;
	        var promise = this.sessionPromise = helpers_1.send(this.baseUrl + '/open', args, function (res) {
	            return _this.session = {
	                id: res.id,
	                type: res.type,
	                profile: res.profile
	            };
	        });
	        promise.then(null, function () {
	            _this.sessionPromise = null;
	        });
	        return this.settings.transformPromise(promise);
	    };
	    /**
	     * Закрывает сессию
	     * @returns закрытая сессия
	     */
	    CryptoClient.prototype.close = function () {
	        var _this = this;
	        return this.send('/close', null, function (res) {
	            _this.sessionPromise = null;
	            _this.session = null;
	            return {
	                id: res.id,
	                type: res.type,
	                profile: res.profile
	            };
	        });
	    };
	    CryptoClient.prototype.pack = function (files, options) {
	        var _this = this;
	        var arr = new Array(files.length);
	        var deferred = new Deferred_1.Deferred();
	        var sendRequest = function () {
	            _this.send('/pack', {
	                files: arr,
	                options: options
	            }).then(function (x) { return deferred.resolve(x); }, function (x) { return deferred.reject(x); });
	        };
	        var resolveFile = (function (cur, len) {
	            return function () {
	                if (++cur !== len)
	                    return;
	                sendRequest();
	            };
	        })(0, files.length);
	        var rejectFile = function (err) {
	            rejectFile = function () { };
	            deferred.reject(err);
	        };
	        files.forEach(function (file, index) {
	            helpers_1.toCrutchBlob(file).then(function (b) {
	                arr[index] = {
	                    name: file.name,
	                    content: b.content,
	                    encoding: b.encoding
	                };
	                resolveFile();
	            }, rejectFile);
	        });
	        return this.settings.transformPromise(deferred);
	    };
	    CryptoClient.prototype.unpack = function (buffer) {
	        var _this = this;
	        var deferred = new Deferred_1.Deferred();
	        helpers_1.toCrutchBlob(buffer).then(function (b) {
	            return _this.send('/unpack', {
	                data: b
	            }).then(function (x) { return deferred.resolve(x); }, function (x) { return deferred.reject(x); });
	        }, function (x) { return deferred.reject(x); });
	        return this.settings.transformPromise(deferred);
	    };
	    CryptoClient.prototype.getCerts = function () {
	        return this.send('/certs', null);
	    };
	    CryptoClient.prototype.sign = function (data, options) {
	        var _this = this;
	        var deferred = new Deferred_1.Deferred();
	        helpers_1.toCrutchBlob(data).then(function (b) {
	            return _this.send('/sign', {
	                data: b,
	                options: helpers_1.getOptions(options, {
	                    pkcs7: false,
	                    detached: false,
	                    sendCertificate: false,
	                    sendChain: false
	                })
	            }).then(function (x) { return deferred.resolve(x); }, function (x) { return deferred.reject(x); });
	        }, function (x) { return deferred.reject(x); });
	        return this.settings.transformPromise(deferred);
	    };
	    CryptoClient.prototype.getHeadCert = function () {
	        return this.send('/head', null);
	    };
	    CryptoClient.prototype.send = function (path, data, success) {
	        var _this = this;
	        return this.whenSession(function () {
	            if (data == null) {
	                data = _this.session.id;
	            }
	            else {
	                data.id = _this.session.id;
	            }
	            return helpers_1.send(_this.baseUrl + path, data, success);
	        });
	    };
	    CryptoClient.prototype.whenSession = function (func) {
	        var deferred = new Deferred_1.Deferred();
	        if (this.sessionPromise) {
	            this.sessionPromise.then(function () {
	                func().then(function (x) { return deferred.resolve(x); }, function (x) { return deferred.reject(x); }, function (x) { return deferred.notify(x); });
	            }, noSession);
	        }
	        else {
	            noSession();
	        }
	        function noSession() {
	            deferred.reject({
	                code: 'E_NO_SESSION',
	                message: 'There is no active session'
	            });
	        }
	        return this.settings.transformPromise(deferred);
	    };
	    return CryptoClient;
	}());
	CryptoClient.settings = {
	    port: 48737,
	    useFileApi: false,
	    transformPromise: function (promise) { return promise; },
	    noSsl: false
	};
	exports.CryptoClient = CryptoClient;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var Deferred = (function () {
	    function Deferred() {
	        this.handlers = [];
	        this.resolution = -1;
	    }
	    Deferred.prototype.then = function (done, fail, progress) {
	        this.handlers.push([done, fail, progress]);
	        if (this.resolution < 0)
	            return;
	        this.handle(this.resolution);
	    };
	    Deferred.prototype.resolve = function (result) {
	        this.result = result;
	        this.handle(this.resolution = 0);
	    };
	    Deferred.prototype.reject = function (error) {
	        this.result = error;
	        this.handle(this.resolution = 1);
	    };
	    Deferred.prototype.notify = function (progress) {
	        for (var i = 0; i < this.handlers.length; ++i) {
	            var handler = this.handlers[i][2];
	            if (handler)
	                handler.call(null, progress);
	        }
	    };
	    Deferred.prototype.handle = function (funcIndex) {
	        while (this.handlers.length) {
	            var handler = this.handlers.shift()[funcIndex];
	            if (handler)
	                handler.call(null, this.result);
	        }
	    };
	    return Deferred;
	}());
	exports.Deferred = Deferred;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Deferred_1 = __webpack_require__(2);
	/**
	 * Конвертирует {@type Blob} в строку {@type ICrutchBlob}, строку оставляет как есть
	 * @param data
	 */
	function toCrutchBlob(data) {
	    if (window['Blob'] && data instanceof Blob) {
	        return blobToCrutchBlob(data);
	    }
	    var deferred = new Deferred_1.Deferred();
	    deferred.resolve(data);
	    return deferred;
	}
	exports.toCrutchBlob = toCrutchBlob;
	function blobToCrutchBlob(blob) {
	    var deferred = new Deferred_1.Deferred();
	    var reader = new FileReader();
	    reader.onload = function () {
	        var str = (this.result || '').replace(/^data:(.{0,99},)?/, '');
	        deferred.resolve({
	            content: str,
	            encoding: 'base64'
	        });
	    };
	    reader.onerror = function () {
	        deferred.reject({
	            code: 'E_INVALID_DATA',
	            message: 'Cannot convert Blob to base64',
	            args: {
	                originalError: this.error
	            }
	        });
	    };
	    reader.readAsDataURL(blob);
	    return deferred;
	}
	function send(url, data, success) {
	    var deferred = new Deferred_1.Deferred();
	    try {
	        var xhr_1 = new XHR();
	        xhr_1.onload = function () {
	            var response = JSON.parse(xhr_1.responseText);
	            var xhrStatus = response.status;
	            var res = response.content;
	            if (xhrStatus > 0 && xhrStatus < 400) {
	                deferred.resolve(success ? success(res) : res);
	            }
	            else {
	                deferred.reject(res);
	            }
	        };
	        xhr_1.onerror = function () {
	            deferred.reject({
	                code: 'E_CONNECTION_ERROR',
	                message: 'Cannot connect to server'
	            });
	        };
	        xhr_1.open('POST', url);
	        xhr_1.send(JSON.stringify(data));
	    }
	    catch (e) {
	        deferred.reject({
	            code: 'E_CONNECTION_ERROR',
	            message: e.message
	        });
	    }
	    return deferred;
	}
	exports.send = send;
	function getOptions(vals, defs) {
	    var opts = {};
	    vals = vals || {};
	    Object.keys(defs).forEach(function (key) {
	        var val = vals[key];
	        opts[key] = val === undefined ? defs[key] : val;
	    });
	    return opts;
	}
	exports.getOptions = getOptions;
	var XHR = /MSIE [89]/i.test(navigator.userAgent) ? XDomainRequest : XMLHttpRequest;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map