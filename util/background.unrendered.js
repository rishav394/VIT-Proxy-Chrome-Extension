const config = {
	mode: 'fixed_servers',
	rules: {
		singleProxy: {
			host: 'env.HOST',
			port: env.PORT,
		},
		bypassList: [
			'http://phc.prontonetworks.com/cgi-bin/authlogin',
			'http://phc.prontonetworks.com/cgi-bin/authlogout',
		],
	},
};

const connected = () => {
	chrome.browserAction.setIcon({
		path: 'images/icons8_Connected_128px.png',
	});
	chrome.browserAction.setBadgeText({ text: 'ON' });
};

const disconnected = () => {
	chrome.browserAction.setIcon({
		path: 'images/icons8_Disconnected_128px.png',
	});
	chrome.browserAction.setBadgeText({
		text: '',
	});
};

const getProxySetIcon = () => {
	trialCheck();
	chrome.proxy.settings.get({ incognito: false }, function(config) {
		if (config.levelOfControl == 'controlled_by_this_extension') {
			connected();
		} else {
			disconnected();
		}
	});
};

chrome.browserAction.setBadgeBackgroundColor({
	color: '#4688F1',
});

chrome.runtime.onStartup.addListener(getProxySetIcon);
chrome.runtime.onInstalled.addListener(getProxySetIcon);

chrome.runtime.onMessage.addListener((request) => {
	if (request.proxy) {
		chrome.proxy.settings.set({ value: config }, connected());
	} else {
		chrome.proxy.settings.clear({}, disconnected());
	}
});

const trialCheck = () => {
	var TRIAL_PERIOD_DAYS = 1;

	function verify(license) {
		var licenseStatus;
		if (license.result && license.accessLevel == 'FULL') {
			console.log('Fully paid & properly licensed.');
			licenseStatus = 'FULL';
		} else if (license.result && license.accessLevel == 'FREE_TRIAL') {
			var daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
			daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
			if (daysAgoLicenseIssued <= TRIAL_PERIOD_DAYS) {
				console.log('Free trial, still within trial period');
				licenseStatus = 'FREE_TRIAL';
			} else {
				console.log('Free trial, trial period expired.');
				licenseStatus = 'FREE_TRIAL_EXPIRED';
			}
		} else {
			console.log('No license ever issued.');
			licenseStatus = 'NONE';
		}
	}

	chrome.identity.getAuthToken({ interactive: true }, function(token) {
		let init = {
			method: 'GET',
			async: true,
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			contentType: 'json',
		};
		var CWS_LICENSE_API_URL =
			'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';
		var req = new XMLHttpRequest();
		req.open('GET', CWS_LICENSE_API_URL + chrome.runtime.id);
		req.setRequestHeader('Authorization', 'Bearer ' + token);
		req.onreadystatechange = function() {
			if (req.readyState == 4) {
				var license = JSON.parse(req.responseText);
				verify(license);
			}
		};
		req.send();
	});
};
