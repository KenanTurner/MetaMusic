//Taken and modified from https://www.youtube.com/iframe_api
export default function init(obj){
	var scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/3c3086a1\/www-widgetapi.vflset\/www-widgetapi.js';
	try {
		var ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", {
			createScriptURL: function(x) {
				return x
			}
		});
		scriptUrl = ttPolicy.createScriptURL(scriptUrl)
	} catch (e) {}
	if(!obj._YT) obj._YT = {
		loading: 0,
		loaded: 0
	};
	if(!obj._YTConfig) obj._YTConfig = {
		"host": "https://www.youtube.com"
	};
	let YT = obj._YT;
	let YTConfig = obj._YTConfig;
	if(!YT.loading) {
		YT.loading = 1;
		(function() {
			var l = [];
			YT.ready = function(f) {
				if(YT.loaded) f();
				else l.push(f)
			};
			window.onYTReady = function() {
				console.log("Youtube is ready");
				YT.loaded = 1;
				for(var i = 0; i < l.length; i++) try {
					l[i]()
				} catch (e$0) {}
			};
			YT.setConfig = function(c) {
				for(var k in c)
					if(c.hasOwnProperty(k)) YTConfig[k] = c[k]
			};
			var a = document.createElement("script");
			a.type = "text/javascript";
			a.id = "www-widgetapi-script";
			a.src = scriptUrl;
			a.async = true;
			var c = document.currentScript;
			if(c) {
				var n = c.nonce || c.getAttribute("nonce");
				if(n) a.setAttribute("nonce", n)
			}
			var b = document.getElementsByTagName("script")[0];
			b.parentNode.insertBefore(a, b)
		})()
	};
}