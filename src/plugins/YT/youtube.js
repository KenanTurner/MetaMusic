import HTML from '../../html.js';
export default class YT extends HTML{
	static Track = class Track extends HTML.Track{
		constructor(obj){
			super(obj);
			this.filetype = "YT";
		}
		static fromJSON(json){
			return new YT.Track(JSON.parse(json));
		}
	}
	constructor(yt_api = "../../src/plugins/YT/YoutubeApi.js",iframe_id="_YT_"+Math.random().toString(36).substring(7)){
		super();
		this._ready = false;
		this._iframe_id = iframe_id;
		delete this._player;
		ModuleManager.importScript([yt_api]).then(function(){
			this._createYT(iframe_id);
		}.bind(this),function(){
			throw new Error("Failed to load YoutubeApi.js");
		}.bind(this));
	}
	_createYT(){
		var div = document.createElement("div");
			div.id = this._iframe_id;
			div.style.display = "none";
			div.style.pointerEvents = "none";
			document.body.append(div);
		let player_vars = {
			height: "144",
			width: "100%",
			playerVars: {'controls': 0,'disablekb':1,'fs':0,'modestbranding':1,'playsinline':1},
			videoId: ""
		}
		window.YT.ready(function() {
			let f = function(g){
				return function(evt){
					return this[g](evt);
				}.bind(this);
			}.bind(this)
			this._player = new window.YT.Player(this._iframe_id, player_vars);
			this._player.addEventListener("onStateChange", f('_onLoad'));
			this._player.addEventListener("onStateChange", f('_onTimeUpdate'));
			this._player.addEventListener("onStateChange", f('_onStateChange'));
			this._player.addEventListener("onError", f('_onError'));
			this._player.addEventListener('onReady', f('_onReady'));
		}.bind(this));
	}
	
	_onLoad(evt){
		if(this._player.ready) return; //correctly loads the video
		switch(evt.data){
			case 5:
				this._player.setVolume(0);
				this._player.playVideo();
				break;
			case 1:
				this._player.pauseVideo();
				break;
			case 2:
				this._player.ready = true;
				this._player.setVolume(100);
				this._publish('loaded');
				break;
		}
	}
	_onTimeUpdate(evt){
		if(evt.data == 1){ //PLAYING
			this._player._myTimer = setInterval(function(){
				this._publish('timeupdate');
			}.bind(this), 250);
		}
		if(evt.data != 1){
			clearInterval(this._player._myTimer); //stop calling updateTime
		}
	}
	_onStateChange(evt){
		if(!this._player.ready) return; //correctly loads the video
		switch(evt.data){
			case -1:
				//self._publish('abort'); //not really abort
				break;
			case 0:
				this._publish('ended');
				break;
			case 3: //no idea why but it works
			case 1:
				this._publish('play');
				break;
			case 2:
				this._publish('pause');
				break;
			/*case 3:
				//self._publish('buffering'); //buffering
				break;*/
			case 5:
				this._publish('loaded');
				break;
		}
	}
	_onError(evt){
		this._publish('error');
	}
	_onReady(evt){
		console.log("Youtube is ready");
		this._ready = true;
		this._publish('ready');
	}
	load(track){
		if(!this.constructor._validTrack(track)) throw new Error("Invalid Filetype");
		this._player.ready = false;
		let p = this.waitForEvent('loaded');
		try{
			let id = YT.getYoutubeId(track.src);
			this._player.cueVideoById(id,0);
		}catch(error){
			this._publish('error');
		}
		return p;
	}
	pause(){
		if(this._player.getPlayerState() == 2) return Promise.resolve();
		this._player.pauseVideo();
		return this.waitForEvent('pause');
	}
	play(){
		if(this._player.getPlayerState() == 1) return Promise.resolve();
		this._player.playVideo();
		return this.waitForEvent('play');
	}
	seek(time){
		this._player.seekTo(time,true);
		let self = this;
		if(time >= this.getStatus().duration){ //?????
			return this.waitForEvent('ended');
		}
		let f = function(){
			return self.getStatus().time;
		}
		let g = this.getStatus().time;
		let c = function(){
			self._publish('timeupdate');
		};
		if(time == g) return c();
		this.wait(f,g,c,50);
		return this.waitForEvent('timeupdate');
	}
	fastForward(time){
		time += this._player.getCurrentTime();
		return this.seek(time);
	}
	setVolume(vol){
		if(vol>1) vol=1;
		if(vol<0) vol=0;
		this._player.setVolume(vol*100);
		let self = this;
		let f = function(){
			return self.getStatus().volume;
		}
		let g = this.getStatus().volume;
		let c = function(){
			self._publish('volumechange');
		};
		if(vol == g) return c();
		this.wait(f,g,c,5);
		return this.waitForEvent('volumechange');
	}
	stop(){
		return this.pause()
		.then(this.chain('seek',0));
	}
	getStatus(){
		let data = {
			src:this._player.getVideoUrl(),
			time:this._player.getCurrentTime(),
			duration:this._player.getDuration(),
			volume:this._player.getVolume()/100,
			paused:this._player.getPlayerState()!=1
		}
		return data;
	}
	destroy(){
		this._player.destroy();
		document.getElementById(this._iframe_id).remove();
		clearInterval(this._player._myTimer); //stop calling updateTime
		delete this._iframe_id;
		return super.destroy();
	}
	static getYoutubeId(url){
		try{
			let tmp = new URL(url);
			if(tmp.hostname == "www.youtube.com" || tmp.hostname == "youtu.be"){
				if(tmp.pathname == "/watch"){
					let index = tmp.search.indexOf("?v=");
					return tmp.search.substr(index+3,11);
				}else{
					return tmp.pathname.substr(1,11);
				}
			}
			throw new Error("Invalid url");
		}catch(e){
			throw new Error("Invalid url");
		}
	}
	static _validURL(url){
		try{
			let tmp = new URL(url);
			if(tmp.hostname == "www.youtube.com" || tmp.hostname == "youtu.be") return true;
			return false;
		}catch(e){
			return false;
		}
	}
}

