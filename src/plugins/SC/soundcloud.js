let _sc_api = function(){
	//taken and modified from https://w.soundcloud.com/player/api.js
	this._SC="object"==typeof this._SC?this._SC:{};this._SC.Widget=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){var r,o,i,u=n(1),a=n(2),c=n(3),s=u.api,l=u.bridge,d=[],f=[],p=/^http(?:s?)/;function E(e){var t,n;for(t=0,n=f.length;t<n&&!1!==e(f[t]);t++);}function v(e){return e.contentWindow?e.contentWindow:e.contentDocument&&"parentWindow"in e.contentDocument?e.contentDocument.parentWindow:null}function _(e){var t,n=[];for(t in e)e.hasOwnProperty(t)&&n.push(e[t]);return n}function S(e,t,n){n.callbacks[e]=n.callbacks[e]||[],n.callbacks[e].push(t)}function h(e,t){var n=!0;return t.callbacks[e]=[],E((function(t){if((t.callbacks[e]||[]).length)return n=!1,!1})),n}function y(e,t,n){var r,o,i=v(n);if(!i.postMessage)return!1;r=n.getAttribute("src").split("?")[0],o=JSON.stringify({method:e,value:t}),"//"===r.substr(0,2)&&(r=window.location.protocol+r),r=r.replace(/http:\/\/(w|wt).soundcloud.com/,"https://$1.soundcloud.com"),i.postMessage(o,r)}function b(e){var t;return E((function(n){if(n.instance===e)return t=n,!1})),t}function g(e){var t;return E((function(n){if(v(n.element)===e)return t=n,!1})),t}function m(e,t){return function(n){var r,o=!!((r=n)&&r.constructor&&r.call&&r.apply),i=b(this),u=!o&&t?n:null,a=o&&!t?n:null;return a&&S(e,a,i),y(e,u,i.element),this}}function R(e,t,n){var r,o,i;for(r=0,o=t.length;r<o;r++)e[i=t[r]]=m(i,n)}function O(e,t,n){return e+"?url="+t+"&"+function(e){var t,n,r=[];for(t in e)e.hasOwnProperty(t)&&(n=e[t],r.push(t+"="+("start_track"===t?parseInt(n,10):n?"true":"false")));return r.join("&")}(n)}function w(e,t,n){var r,o,i=e.callbacks[t]||[];for(r=0,o=i.length;r<o;r++)i[r].apply(e.instance,n);(function(e){var t,n=!1;for(t in a)if(a.hasOwnProperty(t)&&a[t]===e){n=!0;break}return n}(t)||t===s.READY)&&(e.callbacks[t]=[])}function A(e){var t,n,r,o,i;try{n=JSON.parse(e.data)}catch(e){return!1}return t=g(e.source),r=n.method,o=n.value,(!t||P(e.origin)===P(t.domain))&&(t?(r===s.READY&&(t.isReady=!0,w(t,"__LATE_BINDING__"),h("__LATE_BINDING__",t)),r!==s.PLAY||t.playEventFired||(t.playEventFired=!0),r!==s.PLAY_PROGRESS||t.playEventFired||(t.playEventFired=!0,w(t,s.PLAY,[o])),i=[],void 0!==o&&i.push(o),void w(t,r,i)):(r===s.READY&&d.push(e.source),!1))}function P(e){return e.replace(p,"")}window.addEventListener?window.addEventListener("message",A,!1):window.attachEvent("onmessage",A),e.exports=i=function(e,t,n){var i;if((""===(i=e)||i&&i.charCodeAt&&i.substr)&&(e=document.getElementById(e)),!function(e){return!(!e||1!==e.nodeType||"IFRAME"!==e.nodeName.toUpperCase())}(e))throw new Error("SC.Widget function should be given either iframe element or a string specifying id attribute of iframe element.");t&&(n=n||{},e.src=O("http://wt.soundcloud.test:9200/",t,n));var u,a,c=g(v(e));return c&&c.instance?c.instance:(u=d.indexOf(v(e))>-1,a=new r(e),f.push(new o(a,e,u)),a)},i.Events=s,window.SC=window.SC||{},window.SC.Widget=i,o=function(e,t,n){this.instance=e,this.element=t,this.domain=function(e){var t,n,r,o="";"//"===e.substr(0,2)&&(e=window.location.protocol+e);for(r=e.split("/"),t=0,n=r.length;t<n&&t<3;t++)o+=r[t],t<2&&(o+="/");return o}(t.getAttribute("src")),this.isReady=!!n,this.callbacks={}},(r=function(){}).prototype={constructor:r,load:function(e,t){if(e){t=t||{};var n=this,r=b(this),o=r.element,i=o.src,u=i.substr(0,i.indexOf("?"));r.isReady=!1,r.playEventFired=!1,o.onload=function(){n.bind(s.READY,(function(){var e,n=r.callbacks;for(e in n)n.hasOwnProperty(e)&&e!==s.READY&&y(l.ADD_LISTENER,e,r.element);t.callback&&t.callback()}))},o.src=O(u,e,t)}},bind:function(e,t){var n=this,r=b(this);return r&&r.element&&(e===s.READY&&r.isReady?setTimeout(t,1):r.isReady?(S(e,t,r),y(l.ADD_LISTENER,e,r.element)):S("__LATE_BINDING__",(function(){n.bind(e,t)}),r)),this},unbind:function(e){var t,n=b(this);n&&n.element&&(t=h(e,n),e!==s.READY&&t&&y(l.REMOVE_LISTENER,e,n.element))}},R(r.prototype,_(a)),R(r.prototype,_(c),!0)},function(e,t){t.api={LOAD_PROGRESS:"loadProgress",PLAY_PROGRESS:"playProgress",PLAY:"play",PAUSE:"pause",FINISH:"finish",SEEK:"seek",READY:"ready",OPEN_SHARE_PANEL:"sharePanelOpened",CLICK_DOWNLOAD:"downloadClicked",CLICK_BUY:"buyClicked",ERROR:"error"},t.bridge={REMOVE_LISTENER:"removeEventListener",ADD_LISTENER:"addEventListener"}},function(e,t){e.exports={GET_VOLUME:"getVolume",GET_DURATION:"getDuration",GET_POSITION:"getPosition",GET_SOUNDS:"getSounds",GET_CURRENT_SOUND:"getCurrentSound",GET_CURRENT_SOUND_INDEX:"getCurrentSoundIndex",IS_PAUSED:"isPaused"}},function(e,t){e.exports={PLAY:"play",PAUSE:"pause",TOGGLE:"toggle",SEEK_TO:"seekTo",SET_VOLUME:"setVolume",NEXT:"next",PREV:"prev",SKIP:"skip"}}]);
}
import HTML from '../HTML/html.js';
export default class SC extends HTML{
	static Track = class Track extends HTML.Track{
		constructor(obj){
			super(obj);
			this.filetype = "SC";
		}
		toJSON(){
			return super.toJSON();
		}
		static fromJSON(json){
			return new SC.Track(JSON.parse(json));
		}
	}
	constructor(iframe_id="_SC_"+Math.random().toString(36).substring(7)){
		super();
		this._ready = false;
		this._iframe_id = iframe_id;
		delete this._player;
		_sc_api.call(this);
		this._createSC(iframe_id);
	}
	_createSC(iframe_id){
		var div = document.createElement("iframe");
			div.id = iframe_id;
			div.style.display = "none";
			div.style.width = "100%";
			div.style.height = "144";
			div.scrolling = "no";
			div.frameborder = "no";
			div.allow = "autoplay";
			div.src = "https://w.soundcloud.com/player/?url=;";
		document.body.append(div);
		let SC = window.SC //Grab SC from global scope
		this._player = SC.Widget(iframe_id);
		this._player.bind(SC.Widget.Events.READY, function() {
			this._ready = true;
			this._publish('ready');
		}.bind(this));
		this._player.bind(SC.Widget.Events.PLAY_PROGRESS, function() {
			this._publish('timeupdate');
		}.bind(this));
		this._player.bind(SC.Widget.Events.PLAY, function() {
			this._publish('play');
		}.bind(this));
		this._player.bind(SC.Widget.Events.PAUSE, function() {
			this._publish('pause');
		}.bind(this));
		this._player.bind(SC.Widget.Events.SEEK, function() {
			this._publish('timeupdate');
		}.bind(this));
		this._player.bind(SC.Widget.Events.FINISH, function() {
			this._publish('ended');
		}.bind(this));
		this._player.bind(SC.Widget.Events.ERROR, function() {
			this._publish('error');
		}.bind(this));
		console.log('Soundcloud is ready');
	}
	load(track){
		if(!this.constructor._validTrack(track)) throw new Error("Invalid Filetype");
		let p = this.waitForEvent('loaded');
		let vol = this._async('getVolume');
		let f = function(){
			p.then(function(e){ //TODO error handling?
				return vol.then(function(v){
					return this.setVolume(v/100).then(function(){return e});
				}.bind(this));
			}.bind(this)).then(function(e){
				return e; //TODO return the newer event?
			});
			this._publish('loaded');
		}.bind(this);
		let o = {
			auto_play: false,
			buying: false,
			sharing: false,
			download: false,
			show_artwork: false,
			show_playcount: false,
			show_user: false,
			show_comments: false,
			hide_related: true,
			visual: false,
			start_track: 0,
			callback: f,
		}
		this._player.load(track.src,o);
		return p;
	}
	pause(){
		this._player.pause();
		return this._async('isPaused')
		.then(function(p){
			if(!p) return this.waitForEvent('pause');
			return Promise.resolve();
		}.bind(this))
	}
	play(){
		this._player.play();
		return this.waitForEvent('play');
	}
	stop(){
		return this.pause()
		.then(this.chain('seek',0));
	}
	seek(time){
		return this.getStatus()
		.then(function(obj){
			this._player.seekTo(time*1000);
			if(time >= obj.duration && obj.paused){
				this._publish('ended');
			}
			//TODO this solution is terrible but it works
			return new Promise(function(res){
				setTimeout(res,10); //just wait 10 ms
			})
		}.bind(this))
	}
	fastForward(time){
		return this._async('getPosition')
		.then(function(ctime){
			return this.seek(ctime/1000+time);
		}.bind(this))
		//return this.seek(this._player.currentTime + time);
	}
	setVolume(vol){
		this._player.setVolume(vol*100);
		let f = function(v){
			if(v == vol*100){
				let e = this._publish('volumechange');
				return e;
			}
			return this._async('getVolume').then(f);
		}.bind(this);
		return this._async('getVolume').then(f);
	}
	getStatus(){
		let vol = this._async('getVolume');
		let time = this._async('getPosition');
		let dur = this._async('getDuration');
		let paused = this._async('isPaused');
		let s = this._async('getCurrentSound');
		return Promise.all([vol,time,dur,paused,s]).then(function(arr){
			let data = {
				volume:arr[0]/100,
				time:arr[1]/1000,
				duration:arr[2]/1000,
				paused:arr[3],
				src:arr[4],
			}
			if(arr[4]) data['src'] = arr[4].permalink_url;
			return Promise.resolve(data);
		});
	}
	_async(f){
		return new Promise(function(res,rej){
			this._player[f](res);
		}.bind(this));
	}
	destroy(){
		document.getElementById(this._iframe_id).remove();
		delete this._iframe_id;
		return super.destroy();
	}
	static _validURL(url){
		try{
			let tmp = new URL(url);
			if(tmp.hostname == "soundcloud.com") return true;
			return false;
		}catch(e){
			return false;
		}
	}
}
