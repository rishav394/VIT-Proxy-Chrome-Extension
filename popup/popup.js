import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './popup.scss';

var checkBox = document.getElementById('myonoffswitch');

chrome.proxy.settings.get({ incognito: false }, function(config) {
	if (config.levelOfControl == 'controlled_by_this_extension') {
		checkBox.checked = true;
	} else {
		checkBox.checked = false;
	}
});

function myFunction() {
	chrome.runtime.sendMessage({ proxy: checkBox.checked });
}

checkBox.onclick = myFunction;
