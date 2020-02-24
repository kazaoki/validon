"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var __validonUrlPath=(document.currentScript?document.currentScript.src:document.querySelector("script[src$=validon\\.js]").src).replace(new RegExp("^"+location.origin),"").replace(/[^\/]+$/,"");function Validon(e){var s=this;s.form=e.form,s.config=e.config,s.eachfire=e.eachfire||!1,s.errorgroup=e.errorgroup||"section",s.errorposition=e.errorposition||"append",s.errortag=e.errortag||'<div class="error">$message</div>',s.loadedFunc=e.loadedFunc,s.startFunc=e.startFunc,s.beforeFunc=e.beforeFunc,s.afterFunc=e.afterFunc,s.finishFunc=e.finishFunc,s.urlPath=__validonUrlPath;var t=window.onload||function(){if(s.form=document.querySelector(s.form),!s.form)return console.warn("Validon can not set up. Please set exists form query."),!1;if(!s.config)return console.warn("Validon can not set up. Please set config."),!1;s.form.style.pointerEvents="";function e(e){e.preventDefault?e.preventDefault():e.returnValue=!1,s.send()}if(s.form.addEventListener?s.form.addEventListener("submit",e,!1):s.form.attachEvent&&s.form.attachEvent("onsubmit",e),s.submitEvent=e,s.eachfire||s.form.querySelectorAll("[data-validon-on]").length)for(var t=s.eachfire?s.form.querySelectorAll("[name]"):s.form.querySelectorAll("[data-validon-on]"),r=0;r<t.length;r++)for(var o=t[r].getAttribute("data-validon-on"),n=(o=o||("radio"===t[r].type||"checkbox"===t[r].type||"file"===t[r].type||"SELECT"===t[r].tagName?"change":"blur")).split(/\s*\,\s*/),a=0;a<n.length;a++){var i=n[a];t[r].addEventListener?t[r].addEventListener(i,function(e){s.send(e.target.name)},!1):t[r].attachEvent&&t[r].attachEvent("on"+i,function(e){s.send(e.srcElement.name)})}return(!s.loadedFunc||"function"!=typeof s.loadedFunc||!1!==s.loadedFunc())&&void 0};window.onload=function(){t()},window.onerror=function(e,t,r,o,n){s.form.hasOwnProperty("style")&&(s.form.style.pointerEvents="")}}function objectMerge(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=r in e?"[object Object]"===Object.prototype.toString.call(e[r])&&"[object Object]"===Object.prototype.toString.call(t[r])?objectMerge(e[r],t[r]):"[object Array]"===Object.prototype.toString.call(e[r])&&"[object Array]"===Object.prototype.toString.call(t[r])?t[r].concat(e[r]):e[r]:t[r]);return e}Validon.prototype={send:function(e,v){var y=this,h={config:this.config};if(y.startFunc&&"function"==typeof y.startFunc&&!1===y.startFunc(h))return!1;void 0===e&&(y.form.style.pointerEvents="none"),h.params=[];for(var t={},r=y.form.querySelectorAll("[name]"),o=!!window.File,n=0;n<r.length;n++){var a,i=r[n].getAttribute("name");if((a=i.match(/^(.+?)\[(.*)\]$/))?a[2].length?"object"!==_typeof(t[a[1]])&&(t[a[1]]=new Object):"object"!==_typeof(t[a[1]])&&(t[a[1]]=new Array):void 0===t[i]&&(t[i]=""),"radio"===r[n].type||"checkbox"===r[n].type)r[n].checked&&this.paramSet(t,i,r[n].value);else if("SELECT"===r[n].tagName)""!==r[n].options[r[n].options.selectedIndex].value&&this.paramSet(t,i,r[n].options[r[n].options.selectedIndex].value);else if("file"===r[n].type&&o){if(r[n].files.length){for(var s=new Array,l=0;l<r[n].files.length;l++)s.push({name:r[n].files[l].name,type:r[n].files[l].type,size:r[n].files[l].size});1===s.length&&(s=s[0]),this.paramSet(t,i,s)}}else this.paramSet(t,i,r[n].value)}if(h.params=t,h.targets=[],h.isSubmit=!1,void 0===e)h.isSubmit=!0,h.targets=Object.keys(h.params);else if("string"==typeof e)h.targets.push(e);else if(e instanceof Array)for(n=0;n<e.length;n++)h.targets.push(e[n]);if(y.beforeFunc&&"function"==typeof y.beforeFunc&&!1===y.beforeFunc(h))return void 0===e&&(y.form.style.pointerEvents=""),!1;var c=new XMLHttpRequest;return c.onreadystatechange=function(){if(4===this.readyState)if(200===this.status){if(void 0!==(h=this.response)&&"string"!=typeof h||(h=JSON.parse(this.responseText)),y.afterFunc&&"function"==typeof y.afterFunc&&!1===y.afterFunc(h))return void 0===o&&(y.form.style.pointerEvents=""),!1;if(h.changes&&h.changes.length)for(var e=0;e<h.changes.length;e++){var t=h.changes[e];if(f=y.form.querySelector('[name="'+t+'"]'))if("INPUT"!==f.tagName||"radio"!==f.getAttribute("type")&&"checkbox"!==f.getAttribute("type"))if("SELECT"===f.tagName){var r=f.querySelectorAll("option");for(n=0;n<r.length;n++)r[n].selected=-1!==h.params[t].indexOf(r[n].value)}else f.value=h.params[t];else for(var o=y.form.querySelectorAll('[name="'+t+'"]'),n=0;n<o.length;n++)o[n].checked=-1!==h.params[t].indexOf(o[n].value)}if(h.targets&&h.targets.length){var a=h.targets;for(var e in a)for(var i in h.errors)i.match(new RegExp("^"+a[e]+"\\["))&&a.push(i);for(e=0;e<a.length;e++){var s=t=a[e],l=t.replace(/\[.*?\]/,""),c=y.form.querySelectorAll('[data-validon-errorholder="'+t+'"]');if(c.length||(t=l,(c=y.form.querySelectorAll('[data-validon-errorholder="'+t+'"]')).length||(t=l+"[]",c=y.form.querySelectorAll('[data-validon-errorholder="'+t+'"]'))),!c.length){var f;if(!(f=y.form.querySelector('[name="'+l+'"]'))&&!(f=y.form.querySelector('[name^="'+l+'["]')))continue;for(var u=f.parentNode;u.tagName!==y.errorgroup.toUpperCase();)if(void 0===(u=u.parentNode).tagName){u=f.parentNode;break}(c=document.createElement("div")).setAttribute("data-validon-errorholder",l),"append"===y.errorposition?u.appendChild(c):"prepend"===y.errorposition&&u.insertBefore(c,u.childNodes[0]),c=new Array(c)}var p="";h.errors&&void 0!==h.errors[l]&&(p=y.errortag.replace(/\$message/,h.errors[l]));for(n=0;n<c.length;n++)c[n].innerHTML=p;var d=s.match(/\[([^\[\]])+\]/);if(d){i=l+"["+d[1]+"]";var m=h.errors[i];m&&m.length&&(document.querySelector('[data-validon-errorholder="'+i+'"]').innerHTML=y.errortag.replace(/\$message/,m))}}}if(v&&"function"==typeof v&&v(h),y.finishFunc&&"function"==typeof y.finishFunc&&!1===y.finishFunc(h))return void 0===o&&(y.form.style.pointerEvents=""),!1;!Object.keys(h.errors).length&&h.isSubmit?y.form.submit():void 0===o&&(y.form.style.pointerEvents="")}else console.warn("Validon: "+this.status+" error return by validation.")},c.open("POST",y.urlPath+"validon.php"),c.setRequestHeader("Content-Type","application/json"),c.responseType="json",c.send(JSON.stringify(h)),this},paramSet:function(e,t,r){var o=t.replace(/\[.*$/,""),n=objectMerge({data:function e(t,r){var o,n;return(o=t.match(/^.*?\[(.*?)\](.*)$/))?(o[1].length?(n=new Object)[o[1]]=o[2]?e(o[2],r):r:(n=new Array).push(o[2]?e(o[2],r):r),n):r}(t,r)},{data:e[o]});e[o]=n.data},back:function(e){console.log(e),validon.form.action=e,validon.form.removeEventListener?validon.form.removeEventListener("submit",validon.submitEvent,!1):validon.form.attachEvent&&validon.form.detachEvent("onsubmit",validon.submitEvent),validon.form.submit()}},Object.keys||(Object.keys=function(e){if(e!==Object(e))throw new TypeError("Object.keys called on a non-object");var t,r=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&r.push(t);return r}),Array.prototype.indexOf||(Array.prototype.indexOf=function(a,i,s){return function(e,t){if(null==this)throw TypeError("Array.prototype.indexOf called on null or undefined");var r=a(this),o=r.length>>>0,n=s(0|t,o);if(n<0)n=i(0,o+n);else if(o<=n)return-1;if(void 0===e){for(;n!==o;++n)if(void 0===r[n]&&n in r)return n}else if(e!=e){for(;n!==o;++n)if(r[n]!=r[n])return n}else for(;n!==o;++n)if(r[n]===e)return n;return-1}}(Object,Math.max,Math.min));
//# sourceMappingURL=validon.js.map
