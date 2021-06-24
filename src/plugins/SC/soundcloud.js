import HTML from '../../html.js';
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
	constructor(sc_api = "../../src/plugins/SC/SoundcloudApi.js",iframe_id="_SC_"+Math.random().toString(36).substring(7)){
		super();
		this._ready = false;
		this._iframe_id = iframe_id;
		delete this._player;
		ModuleManager.importScript([sc_api]).then(function(){
			this._createSC(iframe_id);
		}.bind(this),function(){
			throw new Error("Failed to load SoundcloudApi.js");
		}.bind(this));
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
		this._player.seekTo(time*1000);
		return this.waitForEvent('timeupdate')
		.then(this.chain('getStatus'))
		.then(function(obj){
			if(time >= obj.duration && obj.paused){
				this._publish('ended');
			}
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
