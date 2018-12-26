
/**
 * set url path
 */
var __validonUrlPath = (
	document.currentScript
		? document.currentScript.src
		: document.getElementsByTagName('script')[document.getElementsByTagName('script').length-1].src
	)
	.replace(new RegExp('^'+location.origin), '')
	.replace(/[^\/]+$/, '')
;

/**
 * コンストラクタ
 */
function Validon(opt)
{
	var validon = this;

	// オプションセット
	validon.form       = opt.form
	validon.config     = opt.config
	validon.eachfire   = opt.eachfire || false
	validon.errortag   = opt.errortag || '<div class="error">$message</div>'
	validon.position   = opt.position || 'append'
	validon.beforeFunc = opt.beforeFunc || 'append'
	validon.afterFunc  = opt.afterFunc || 'append'

	// URLパス設定
	validon.urlPath = __validonUrlPath

	// オンロードセット
	var windowOnload = window.onload || function () {

		// 設定チェック
		validon.form = document.querySelector(validon.form)
		if(!validon.form){
			console.warn('Validon can not set up. Please set exists form query.')
			return false
		}
		if(!validon.config){
			console.warn('Validon can not set up. Please set config.')
			return false
		}

		// submitイベント登録
		if (validon.form.addEventListener) {
			validon.form.addEventListener('submit', function(e){
				(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
				validon.validate()
			}, false);
		} else if (validon.form.attachEvent) {
			validon.form.attachEvent('onsubmit', function(e){
				(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
				validon.validate()
			})
		}

		// 要素ごとのイベント発火の標準設定（ラジオ、チェックボックス、プルダウンはonChange、それ以外はonBlurとす）
		// 個別に指定したい場合は data-validon-on が優先になる。
		if(validon.eachfire) {
			var elems = validon.form.querySelectorAll('[name]')
			for(var i=0; i<elems.length; i++) {
				if(elems[i].getAttribute('data-validon-on')) continue
				if(elems[i].type==='radio' || elems[i].type==='checkbox' || elems[i].tagName==='SELECT') {
					elems[i].setAttribute('data-validon-on', 'change')
				} else {
					elems[i].setAttribute('data-validon-on', 'blur')
				}
			}
		}

		// 個別イベント登録
		var elems = validon.form.querySelectorAll('[data-validon-on]')
		for(var i=0; i<elems.length; i++) {
			var elem = elems[i]
			var eventName = elem.getAttribute('data-validon-on')
			if (elem.addEventListener) {
				elem.addEventListener(eventName, function(e){ validon.validate(this.name) }, false)
			} else if (elem.attachEvent) {
				elem.attachEvent('on'+eventName, function(e){ validon.validate(e.srcElement.name) })
			}
		}
	};
	window.onload = function () { windowOnload(); };
}

/**
 * メソッド
 */
Validon.prototype = {

	/**
	 * バリデート実行
	 *
	 * - 引数空ならsubmit実行（全要素をバリデート対象にする
	 * - 引数に文字列が入っている場合はnameとしてバリデート対象にする
	 * - 引数に複数の文字列が配列で入っている場合は複数のnameとしてバリデート対象にする
	 */
	validate: function(args){
		var validon = this
		var json = [];

		// データまとめ
		json.target = []
		if(typeof args ==='undefined') {
			// submitバリデートの場合全ての値
			var elems = validon.form.querySelectorAll('[name]')
			for(var i=0; i<elems.length; i++) {
				json.target.push(elems[i].name)
			}
		} else if(typeof args ==='string') {
			// 個別バリデート：単体の場合（要素ごとのバリデート発火など）
			json.target.push(args)
		} else if(args instanceof Array) {
			// 個別バリデート：複数の場合（直接jsからvalidate()実行など）
			for(var i=0; i<args.length; i++) {
				json.target.push(args[i])
			}
		}
		// 重複除去
		json.target = json.target.filter(function (x, i, self) {
			return self.indexOf(x) === i;
		});

		// フック：beforeFunc
		if(validon.beforeFunc) validon.beforeFunc(json)

		// Ajax
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(4===this.readyState && 200===this.status) {

				console.log(this.responseText);

				// フック：afterFunc
				if(validon.beforeFunc) validon.afterFunc(json)

			}
		}
		xhr.open('POST', validon.urlPath+'valid.php');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(json));



		return this
	}
}

/**
 * filterのPolyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Polyfill
 */
if (!Array.prototype.filter) {
	Array.prototype.filter = function (func, thisArg) {
		'use strict';
		if (!((typeof func === 'Function' || typeof func === 'function') && this))
			throw new TypeError();
		var len = this.length >>> 0,
			res = new Array(len), // preallocate array
			t = this, c = 0, i = -1;
		if (thisArg === undefined) {
			while (++i !== len) {
				// checks to see if the key was set
				if (i in this) {
					if (func(t[i], i, t)) {
						res[c++] = t[i];
					}
				}
			}
		}
		else {
			while (++i !== len) {
				// checks to see if the key was set
				if (i in this) {
					if (func.call(thisArg, t[i], i, t)) {
						res[c++] = t[i];
					}
				}
			}
		}
		res.length = c; // shrink down array to proper size
		return res;
	};
}

/**
 * indexOfのPolyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
 */
if (!Array.prototype.indexOf) Array.prototype.indexOf = (function (Object, max, min) {
	"use strict";
	return function indexOf(member, fromIndex) {
		if (this === null || this === undefined) throw TypeError("Array.prototype.indexOf called on null or undefined");
		var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);
		if (i < 0) i = max(0, Len + i); else if (i >= Len) return -1;
		if (member === void 0) {
			for (; i !== Len; ++i) if (that[i] === void 0 && i in that) return i; // undefined
		} else if (member !== member) {
			for (; i !== Len; ++i) if (that[i] !== that[i]) return i; // NaN
		} else for (; i !== Len; ++i) if (that[i] === member) return i; // all else
		return -1; // if the value was not found, then return -1
	};
})(Object, Math.max, Math.min);

/**
 * lastIndexOfのPolyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf#Polyfill
 */
if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function (searchElement /*, fromIndex*/) {
		'use strict';
		if (this === void 0 || this === null) {
			throw new TypeError();
		}
		var n, k,
			t = Object(this),
			len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		n = len - 1;
		if (arguments.length > 1) {
			n = Number(arguments[1]);
			if (n != n) {
				n = 0;
			}
			else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	};
}
