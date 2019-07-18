"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},__validonUrlPath=(document.currentScript?document.currentScript.src:document.getElementsByTagName("script")[document.getElementsByTagName("script").length-1].src).replace(new RegExp("^"+location.origin),"").replace(/[^\/]+$/,"");function Validon(e){var s=this;s.form=e.form,s.config=e.config,s.eachfire=e.eachfire||!1,s.errorgroup=e.errorgroup||"section",s.errorposition=e.errorposition||"append",s.errortag=e.errortag||'<div class="error">$message</div>',s.startFunc=e.startFunc,s.beforeFunc=e.beforeFunc,s.afterFunc=e.afterFunc,s.finishFunc=e.finishFunc,s.urlPath=__validonUrlPath;var t=window.onload||function(){if(s.form=document.querySelector(s.form),!s.form)return console.warn("Validon can not set up. Please set exists form query."),!1;if(!s.config)return console.warn("Validon can not set up. Please set config."),!1;s.form.style.pointerEvents="";var e=function(e){e.preventDefault?e.preventDefault():e.returnValue=!1,s.send()};if(s.form.addEventListener?s.form.addEventListener("submit",e,!1):s.form.attachEvent&&s.form.attachEvent("onsubmit",e),s.eachfire||s.form.querySelectorAll("[data-validon-on]").length)for(var t=s.eachfire?s.form.querySelectorAll("[name]"):s.form.querySelectorAll("[data-validon-on]"),r=0;r<t.length;r++){var n=t[r].getAttribute("data-validon-on");n||(n="radio"===t[r].type||"checkbox"===t[r].type||"file"===t[r].type||"SELECT"===t[r].tagName?"change":"blur");for(var o=n.split(/\s*\,\s*/),a=0;a<o.length;a++){var i=o[a];t[r].addEventListener?t[r].addEventListener(i,function(e){s.send(this.name)},!1):t[r].attachEvent&&t[r].attachEvent("on"+i,function(e){s.send(e.srcElement.name)})}}};window.onload=function(){t()}}function objectMerge(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=r in e?"[object Object]"===Object.prototype.toString.call(e[r])&&"[object Object]"===Object.prototype.toString.call(t[r])?objectMerge(e[r],t[r]):"[object Array]"===Object.prototype.toString.call(e[r])&&"[object Array]"===Object.prototype.toString.call(t[r])?t[r].concat(e[r]):t[r]:t[r]);return e}Validon.prototype={send:function(e,f){var l=this,u={config:this.config};if(l.startFunc&&"function"==typeof l.startFunc&&!1===l.startFunc(u))return!1;void 0===e&&(l.form.style.pointerEvents="none"),u.params=[];for(var t={},r=l.form.querySelectorAll("[name]"),n=!!window.File,o=0;o<r.length;o++){var a,i=r[o].getAttribute("name");if((a=i.match(/^(.+?)\[(.*)\]$/))?a[2].length?"object"!==_typeof(t[a[1]])&&(t[a[1]]=new Object):"object"!==_typeof(t[a[1]])&&(t[a[1]]=new Array):t[i]="","radio"===r[o].type||"checkbox"===r[o].type)r[o].checked&&this.paramSet(t,i,r[o].value);else if("SELECT"===r[o].tagName)for(var s=l.form.querySelectorAll('[name="'+i+'"] option'),c=0;c<s.length;c++)s[c].selected&&this.paramSet(t,i,s[c].value);else if("file"===r[o].type&&n){if(r[o].files.length){var p=new Array;for(c=0;c<r[o].files.length;c++)p.push({name:r[o].files[c].name,type:r[o].files[c].type,size:r[o].files[c].size});1===p.length&&(p=p[0]),this.paramSet(t,i,p)}}else this.paramSet(t,i,r[o].value)}if(u.params=t,u.targets=[],u.isSubmit=!1,void 0===e)u.isSubmit=!0,u.targets=Object.keys(u.params);else if("string"==typeof e)u.targets.push(e);else if(e instanceof Array)for(o=0;o<e.length;o++)u.targets.push(e[o]);if(l.beforeFunc&&"function"==typeof l.beforeFunc&&!1===l.beforeFunc(u))return void 0===e&&(l.form.style.pointerEvents=""),!1;var d=new XMLHttpRequest;return d.onreadystatechange=function(){if(4===this.readyState&&200===this.status){if(void 0!==(u=this.response)&&"string"!=typeof u||(u=JSON.parse(this.responseText)),l.afterFunc&&"function"==typeof l.afterFunc&&!1===l.afterFunc(u))return void 0===n&&(l.form.style.pointerEvents=""),!1;if(u.changes&&u.changes.length)for(var e=0;e<u.changes.length;e++){var t=u.changes[e];if("INPUT"!==(a=l.form.querySelector('[name="'+t+'"]')).tagName||"radio"!==a.getAttribute("type")&&"checkbox"!==a.getAttribute("type"))if("SELECT"===a.tagName){var r=a.querySelectorAll("option");for(o=0;o<r.length;o++)r[o].selected=-1!==u.params[t].indexOf(r[o].value)}else a.value=u.params[t];else for(var n=l.form.querySelectorAll('[name="'+t+'"]'),o=0;o<n.length;o++)n[o].checked=-1!==u.params[t].indexOf(n[o].value)}if(u.targets&&u.targets.length)for(e=0;e<u.targets.length;e++){t=u.targets[e];var a=l.form.querySelector('[name="'+t+'"]'),i=l.form.querySelectorAll('[data-validon-errorholder="'+t+'"]');if(!i.length){for(var s=a.parentNode;s.tagName!==l.errorgroup.toUpperCase();)if(void 0===(s=s.parentNode).tagName){s=a.parentNode;break}(i=document.createElement("div")).setAttribute("data-validon-errorholder",t),"append"===l.errorposition?s.appendChild(i):"prepend"===l.errorposition&&s.insertBefore(i,s.childNodes[0]),i=new Array(i)}var c="";u.errors&&void 0!==u.errors[t]&&(c=l.errortag.replace(/\$message/,u.errors[t]));for(o=0;o<i.length;o++)i[o].innerHTML=c}if(f&&"function"==typeof f&&f(u),l.finishFunc&&"function"==typeof l.finishFunc&&!1===l.finishFunc(u))return void 0===n&&(l.form.style.pointerEvents=""),!1;!u.errors&&u.isSubmit?l.form.submit():void 0===n&&(l.form.style.pointerEvents="")}},d.open("POST",l.urlPath+"validon.php"),d.setRequestHeader("Content-Type","application/json"),d.responseType="json",d.send(JSON.stringify(u)),this},paramSet:function(e,t,r){var n=t.replace(/\[.*$/,""),o=objectMerge({data:function e(t,r){var n,o;return(n=t.match(/^.*?\[(.*?)\](.*)$/))?(n[1].length?(o=new Object)[n[1]]=n[2]?e(n[2],r):r:(o=new Array).push(n[2]?e(n[2],r):r),o):r}(t,r)},{data:e[n]});e[n]=o.data}},Object.keys||(Object.keys=function(e){if(e!==Object(e))throw new TypeError("Object.keys called on a non-object");var t,r=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&r.push(t);return r}),Array.prototype.indexOf||(Array.prototype.indexOf=function(a,i,s){return function(e,t){if(null==this)throw TypeError("Array.prototype.indexOf called on null or undefined");var r=a(this),n=r.length>>>0,o=s(0|t,n);if(o<0)o=i(0,n+o);else if(n<=o)return-1;if(void 0===e){for(;o!==n;++o)if(void 0===r[o]&&o in r)return o}else if(e!=e){for(;o!==n;++o)if(r[o]!=r[o])return o}else for(;o!==n;++o)if(r[o]===e)return o;return-1}}(Object,Math.max,Math.min));
//# sourceMappingURL=validon.js.map
