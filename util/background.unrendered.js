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
