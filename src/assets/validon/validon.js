
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
	validon.form          = opt.form
	validon.config        = opt.config
	validon.eachfire      = opt.eachfire || false
	validon.errorgroup    = opt.errorgroup || 'section'
	validon.errorposition = opt.errorposition || 'append'
	validon.errortag      = opt.errortag || '<div class="error">$message</div>'
	validon.startFunc     = opt.startFunc  // 開始してすぐ実行する関数
	validon.beforeFunc    = opt.beforeFunc // json送信直前に実行する関数
	validon.afterFunc     = opt.afterFunc  // json受信直後に実行する関数
	validon.finishFunc    = opt.finishFunc // 処理完了後に実行する関数

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

		// 対象フォームがクリック不可になっていたら困るので戻し
		validon.form.style.pointerEvents = null

		// submitイベント登録
		var submitEvent = function(event){
			(event.preventDefault) ? event.preventDefault() : event.returnValue = false
			validon.send()
		}
		if (validon.form.addEventListener) {
			validon.form.addEventListener('submit', submitEvent, false)
		} else if (validon.form.attachEvent) {
			validon.form.attachEvent('onsubmit', submitEvent)
		}

		// 要素ごとのイベント発火が有効の場合、各要素に `onChange` が登録され都度バリデートされるようになる。
		// ※要素ごとに設定も可能（例： data-validon-on='change,keydown' ← カンマで複数指定可
		if(validon.eachfire) {
			var elems = validon.form.querySelectorAll('[name]')
			for(var i=0; i<elems.length; i++) {
				var eventName = elems[i].getAttribute('data-validon-on')
				if(!eventName) {
					if(
						elems[i].type==='radio' ||
						elems[i].type==='checkbox' ||
						elems[i].type==='file' ||
						elems[i].tagName==='SELECT'
					) {
						eventName = 'change'
					} else {
						eventName = 'blur'
					}
				}
				var eventNames = eventName.split(/\s*\,\s*/)
				for(var j=0; j<eventNames.length; j++) {
					var event = eventNames[j];
					if (elems[i].addEventListener) {
						elems[i].addEventListener(event, function(e){ validon.send(this.name) }, false)
					} else if (elems[i].attachEvent) {
						elems[i].attachEvent('on'+event, function(e){ validon.send(e.srcElement.name) })
					}
				}
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
	 * PHPにデータを送信してバリデート実行
	 *
	 * - 引数空ならsubmit実行（全要素をバリデート対象にする
	 * - 引数に文字列が入っている場合はnameとしてバリデート対象にする
	 * - 引数に複数の文字列が配列で入っている場合は複数のnameとしてバリデート対象にする
	 */
	send: function(elems, callback){
		var validon = this
		var json = {
			config: this.config
		};

		// フック：startFunc
		if(validon.startFunc && 'function' === typeof validon.startFunc) {
			if(false === validon.startFunc(json)) return false
		}

		// submit中は要素を全てクリックできないように
		if(typeof elems === 'undefined') validon.form.style.pointerEvents = 'none'

		// 値まとめ
		json.params = []
		var params = {}
		var elements = validon.form.querySelectorAll('[name]')
		var hasFileApi = !!window.File;
		for(var i=0; i<elements.length; i++) {
			var name = elements[i].getAttribute('name')
			if('undefined'!==typeof params[name]) continue
			// ラジオボタン
			if(elements[i].type==='radio') {
				var lump = validon.form.querySelectorAll('[name="'+name+'"]')
				for(var j=0; j<lump.length; j++) {
					if(lump[j].checked) {
						params[name] = lump[j].value
						break
					}
				}
			}
			// チェックボックス
			else if(elements[i].type==='checkbox') {
				var lump = validon.form.querySelectorAll('[name="'+name+'"]')
				params[name] = []
				for(var j=0; j<lump.length; j++) {
					if(lump[j].checked) {
						params[name].push(lump[j].value)
					}
				}
			}
			// セレクトプルダウン
			else if(elements[i].tagName==='SELECT') {
				var lump = validon.form.querySelectorAll('[name="'+name+'"] option')
				params[name] = []
				for(var j=0; j<lump.length; j++) {
					if(lump[j].selected) {
						params[name].push(lump[j].value)
					}
				}
			}
			// ファイル選択（FileAPIが使用できる場合は name,type,size をセットする）
			else if(elements[i].type==='file' && hasFileApi) {
				var element = validon.form.querySelector('[name="'+name+'"]')
				var files = new Array();
				for(var j=0; j<element.files.length; j++){
					files.push({
						name: element.files[j]['name'],
						type: element.files[j]['type'],
						size: element.files[j]['size'],
					})
				}
				if(name.match(/\]$/)) {
					params[name] = files
				} else {
					params[name] = files[0]
				}
			}
			// その他の要素
			else {
				params[name] = elements[i].value
			}
		}
		json.params = params

		// 対象要素まとめ
		json.targets = []
		json.isSubmit = false
		if(typeof elems === 'undefined') {
			// submitバリデートの場合全ての値
			json.isSubmit = true
			json.targets = Object.keys(json.params)
		} else if(typeof elems ==='string') {
			// 個別バリデート：単体の場合（要素ごとのバリデート発火など）
			json.targets.push(elems)
		} else if(elems instanceof Array) {
			// 個別バリデート：複数の場合（直接jsからvalidate()実行など）
			for(var i=0; i<elems.length; i++) {
				json.targets.push(elems[i])
			}
		}

		// フック：beforeFunc
		if(validon.beforeFunc && 'function' === typeof validon.beforeFunc) {
			if(false === validon.beforeFunc(json)) return false
		}

		// Ajax
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if(4 === this.readyState) {
				if(200 === this.status) {
					json = this.response
					if('undefined' === typeof this.response) {
						json = JSON.parse(this.responseText)
					}

					// フック：afterFunc
					if(validon.afterFunc && 'function' === typeof validon.afterFunc) {
						if(false === validon.afterFunc(json)) return false
					}

					// ターゲットのみ値の変更があれば反映する
					if(json.changes && json.changes.length) {
						for(var i=0; i<json.changes.length; i++) {
							var name = json.changes[i]
							var elem = validon.form.querySelector('[name="'+name+'"]')
							if(
								'INPUT' === elem.tagName &&
								('checkdradiobox' === elem.getAttribute('type') || 'checkbox' === elem.getAttribute('type'))
							) {
								var elems = validon.form.querySelectorAll('[name="'+name+'"]')
								for(var j=0; j<elems.length; j++) {
									elems[j].checked = -1 !== json.params[name].indexOf(elems[j].value)
								}
							} else if('SELECT' === elem.tagName) {
								var options = elem.querySelectorAll('option')
								for(var j=0; j<options.length; j++) {
									options[j].selected = -1 !== json.params[name].indexOf(options[j].value)
								}
							} else {
								elem.value = json.params[name]
							}
						}
					}

					// ターゲットのみエラーがあれば反映する
					if(json.targets && json.targets.length) {
						for(var i=0; i<json.targets.length; i++) {
							var name = json.targets[i]
							var elem = validon.form.querySelector('[name="'+name+'"]')
							var errorholder = validon.form.querySelectorAll('[data-validon-errorholder="'+name+'"]')
							if(!errorholder.length) {
								var parent = elem.parentNode
								while (parent.tagName !== validon.errorgroup.toUpperCase()) {
									parent = parent.parentNode;
									if('undefined' === typeof parent.tagName) {
										parent = elem.parentNode
										break
									}
								}
								errorholder = document.createElement('div')
								errorholder.setAttribute('data-validon-errorholder', name)
								if(validon.errorposition === 'append') {
									parent.appendChild(errorholder)
								} else if(validon.errorposition === 'prepend') {
									parent.insertBefore(errorholder, parent.childNodes[0]);
								}
								errorholder = new Array(errorholder)
							}
							var message = ''
							if(json.errors && 'undefined' !== typeof json.errors[name]) {
								message = validon.errortag.replace(/\$message/, json.errors[name])
							}
							for(var j=0; j<errorholder.length; j++) {
								errorholder[j].innerHTML = message
							}
						}
					}

					// 第二引数に関数が指定されていたらここで実行
					if(callback && 'function' === typeof callback) {
						callback(json)
					}

					// フック：finsihFunc
					if(validon.finishFunc && 'function' === typeof validon.finishFunc) {
						if(false === validon.finishFunc(json)) return false
					}

					// エラーが一つも無ければsubmitする（isSubmit時のみ）
					if(!json.errors && json.isSubmit) validon.form.submit()
					else {
						// エラーがある場合はsubmit中のクリック不可を戻す
						if(typeof elems === 'undefined') validon.form.style.pointerEvents = null
					}
				}
			}
		}
		xhr.open('POST', validon.urlPath+'validon.php')
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.responseType = 'json'
		xhr.send(JSON.stringify(json))

		return this
	}
}

/**
 * Object.keys Polyfill
 * http://tokenposts.blogspot.com/2012/04/javascript-objectkeys-browser.html
 */
if (!Object.keys) Object.keys = function(o) {
	if (o !== Object(o))
		throw new TypeError('Object.keys called on a non-object');
	var k=[],p;
	for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
	return k;
}

/**
 * Array.indexOf Polyfill
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
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
