
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
	validon.beforeFunc = opt.beforeFunc
	validon.afterFunc  = opt.afterFunc

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
				validon.validon()
			}, false);
		} else if (validon.form.attachEvent) {
			validon.form.attachEvent('onsubmit', function(e){
				(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
				validon.validon()
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
				elem.addEventListener(eventName, function(e){ validon.validon(this.name) }, false)
			} else if (elem.attachEvent) {
				elem.attachEvent('on'+eventName, function(e){ validon.validon(e.srcElement.name) })
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
	validon: function(args){
		var validon = this
		var json = {
			config: this.config
		};

		// 値まとめ
		json.params = []
		var params = {}
		var elems = validon.form.querySelectorAll('[name]')
		for(var i=0; i<elems.length; i++) {
			var name = elems[i].getAttribute('name')
			if('undefined'!==typeof params[name]) continue
			if(elems[i].type==='radio') {
				var lump = validon.form.querySelectorAll('[name="'+name+'"]')
				for(i=0; i<lump.length; i++) {
					if(lump[i].checked) {
						params[name] = lump[i].value
						break
					}
				}
			} else if(elems[i].type==='checkbox') {
				var lump = validon.form.querySelectorAll('[name="'+name+'"]')
				params[name] = []
				for(i=0; i<lump.length; i++) {
					if(lump[i].checked) {
						params[name].push(lump[i].value)
					}
				}
			} else if(elems[i].tagName==='SELECT') {
				var lump = validon.form.querySelectorAll('[name="'+name+'"] option')
				params[name] = []
				for(i=0; i<lump.length; i++) {
					if(lump[i].selected) {
						params[name].push(lump[i].value)
					}
				}
			} else {
				params[name] = elems[i].value
			}
		}
		json.params = params

		// 対象要素まとめ
		json.targets = []
		if(typeof args ==='undefined') {
			// submitバリデートの場合全ての値
			json.targets = Object.keys(json.params)
		} else if(typeof args ==='string') {
			// 個別バリデート：単体の場合（要素ごとのバリデート発火など）
			json.targets.push(args)
		} else if(args instanceof Array) {
			// 個別バリデート：複数の場合（直接jsからvalidate()実行など）
			for(var i=0; i<args.length; i++) {
				json.targets.push(args[i])
			}
		}

		// フック：beforeFunc
		if(validon.beforeFunc) validon.beforeFunc(json)

		// Ajax
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if(4===this.readyState && 200===this.status) {
				json = this.response
				if(typeof this.response ==='undefined') {
					json = JSON.parse(this.responseText)
				}

				// フック：afterFunc
				if(validon.beforeFunc) validon.afterFunc(json)
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
