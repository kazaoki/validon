"use strict";var validon__urlPath=(document.currentScript?document.currentScript.src:document.getElementsByTagName("script")[document.getElementsByTagName("script").length-1].src).replace(new RegExp("^"+location.origin),"").replace(/[^\/]+$/,""),validon__windowOnload=window.onload||function(){for(var t=document.querySelectorAll("form"),e=0;e<t.length;e++){var n=t[e];n.getAttribute("data-validon-config")&&(n.addEventListener?n.addEventListener("submit",validon__submitCheck,!1):n.attachEvent&&n.attachEvent("onsubmit",validon__submitCheck))}};function validon__submitCheck(t){t.preventDefault?t.preventDefault():t.returnValue=!1;var e=t.srcElement,n={config:e.getAttribute("data-validon-config"),each:e.getAttribute("data-validon-each"),errortag:e.getAttribute("data-validon-errortag")||'<div class="error">$message</div>',position:e.getAttribute("data-validon-position")||"append"},a=new XMLHttpRequest;a.onreadystatechange=function(){4===this.readyState&&200===this.status&&console.log(this.responseText)},a.open("POST",validon__urlPath+"valid.php"),a.setRequestHeader("Content-Type","application/json"),a.send(JSON.stringify(n))}window.onload=function(){validon__windowOnload()};
//# sourceMappingURL=valid.js.map
