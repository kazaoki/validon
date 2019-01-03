"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},__validonUrlPath=(document.currentScript?document.currentScript.src:document.getElementsByTagName("script")[document.getElementsByTagName("script").length-1].src).replace(new RegExp("^"+location.origin),"").replace(/[^\/]+$/,"");function Validon(e){var a=this;a.form=e.form,a.config=e.config,a.eachfire=e.eachfire||!1,a.errorgroup=e.errorgroup||"section",a.errorposition=e.errorposition||"append",a.errortag=e.errortag||'<div class="error">$message</div>',a.beforeFunc=e.beforeFunc,a.afterFunc=e.afterFunc,a.urlPath=__validonUrlPath;var r=window.onload||function(){if(a.form=document.querySelector(a.form),!a.form)return console.warn("Validon can not set up. Please set exists form query."),!1;if(!a.config)return console.warn("Validon can not set up. Please set config."),!1;var e=function(e){e.preventDefault?e.preventDefault():e.returnValue=!1,a.send()};if(a.form.addEventListener?a.form.addEventListener("submit",e,!1):a.form.attachEvent&&a.form.attachEvent("onsubmit",e),a.eachfire)for(var r=a.form.querySelectorAll("[name]"),t=0;t<r.length;t++)r[t].getAttribute("data-validon-on")||("radio"===r[t].type||"checkbox"===r[t].type||"SELECT"===r[t].tagName?r[t].setAttribute("data-validon-on","change"):r[t].setAttribute("data-validon-on","blur"));for(r=a.form.querySelectorAll("[data-validon-on]"),t=0;t<r.length;t++){var o=r[t],n=o.getAttribute("data-validon-on");o.addEventListener?o.addEventListener(n,function(e){a.send(this.name)},!1):o.attachEvent&&o.attachEvent("on"+n,function(e){a.send(e.srcElement.name)})}};window.onload=function(){r()}}Validon.prototype={send:function(e,s){for(var l=this,c={config:this.config,params:[]},r={},t=l.form.querySelectorAll("[name]"),o=0;o<t.length;o++){var n=t[o].getAttribute("name");if(void 0===r[n])if("radio"===t[o].type){var a=l.form.querySelectorAll('[name="'+n+'"]');for(o=0;o<a.length;o++)if(a[o].checked){r[n]=a[o].value;break}}else if("checkbox"===t[o].type){a=l.form.querySelectorAll('[name="'+n+'"]');for(r[n]=[],o=0;o<a.length;o++)a[o].checked&&r[n].push(a[o].value)}else if("SELECT"===t[o].tagName){a=l.form.querySelectorAll('[name="'+n+'"] option');for(r[n]=[],o=0;o<a.length;o++)a[o].selected&&r[n].push(a[o].value)}else r[n]=t[o].value}if(c.params=r,c.targets=[],c.isSubmit=!1,void 0===e)c.isSubmit=!0,c.targets=Object.keys(c.params);else if("string"==typeof e)c.targets.push(e);else if(e instanceof Array)for(o=0;o<e.length;o++)c.targets.push(e[o]);if(l.beforeFunc&&!1===l.beforeFunc(c))return!1;var i=new XMLHttpRequest;return i.onreadystatechange=function(){if(4===this.readyState&&200===this.status){if(c=this.response,void 0===this.response&&(c=JSON.parse(this.responseText)),!1===l.afterFunc(c))return!1;if(c.targets.length)for(var e=0;e<c.targets.length;e++){var r=c.targets[e],t=l.form.querySelector('[name="'+r+'"]'),o=l.form.querySelectorAll('[data-validon-errorholder="'+r+'"]');if(!o.length){for(var n=t.parentNode;n.tagName!==l.errorgroup.toUpperCase();)if(void 0===(n=n.parentNode).tagName){n=t.parentNode;break}(o=document.createElement("div")).setAttribute("data-validon-errorholder",r),"append"===l.errorposition?n.appendChild(o):"prepend"===l.errorposition&&n.insertBefore(o,n.childNodes[0]),o=new Array(o)}var a="";c.errors&&void 0!==c.errors[r]&&(a=l.errortag.replace(/\$message/,c.errors[r]));for(var i=0;i<o.length;i++)o[i].innerHTML=a}s&&(void 0===s||_typeof(s))&&s(c)}},i.open("POST",l.urlPath+"validon.php"),i.setRequestHeader("Content-Type","application/json"),i.responseType="json",i.send(JSON.stringify(c)),this}},Object.keys||(Object.keys=function(e){if(e!==Object(e))throw new TypeError("Object.keys called on a non-object");var r,t=[];for(r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.push(r);return t});
//# sourceMappingURL=validon.js.map
