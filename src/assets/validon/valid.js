
/**
 * set url path
 */
var validon__urlPath = (
	document.currentScript
		? document.currentScript.src
		: document.getElementsByTagName('script')[document.getElementsByTagName('script').length-1].src
	)
	.replace(new RegExp('^'+location.origin), '')
	.replace(/[^\/]+$/, '')
;

/**
 * onLoad
 */
var validon__windowOnload = window.onload || function () {
	var forms = document.querySelectorAll('form');
	for (var i = 0; i < forms.length; i++) {
		var form = forms[i]
		if (form.getAttribute('data-validon-config')) {
			if (form.addEventListener) {
				form.addEventListener('submit', validon__submitCheck, false);
			} else if (form.attachEvent) {
				form.attachEvent('onsubmit', validon__submitCheck)
			}
		}
	}
};
window.onload = function () { validon__windowOnload(); };

/**
 * check at submit
 */
function validon__submitCheck(event) {
	(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
	var form = event.srcElement
	var validon = {
		config: form.getAttribute('data-validon-config'),
		each: form.getAttribute('data-validon-each'),
		errortag: form.getAttribute('data-validon-errortag') || '<div class="error">$message</div>',
		position: form.getAttribute('data-validon-position') || 'append'
	}
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(4===this.readyState && 200===this.status) {

			console.log(this.responseText);

		}
	}
	xhr.open('POST', validon__urlPath+'valid.php');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(validon));

}
