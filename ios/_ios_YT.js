import HTML from '../_ios_html.js';
export default class YT extends HTML{
	constructor(yt_api = "../src/plugins/YoutubeApi.js",iframe_id="_YT_"+Math.random().toString(36).substring(7)){
		super();
		this._ready = false;
		this._iframe_id = iframe_id;
		delete this._player;
		let self = this;
		this.createDiv(iframe_id);
		if(window.YT.ready) return this.createYT(iframe_id);
		YT.loadScript(yt_api,function() {
			self.createYT(iframe_id);
		});
	}
	createDiv(id){
		var div = document.createElement("div");
			div.id = id;
			div.style.opacity = 1; //IOS
			//div.style.pointerEvents = "none"; //IOS
			document.body.append(div);
	}
	createYT(id){
		let self = this;
		window.YT.ready(function() {
			this._player = new window.YT.Player(id, {
				height: "144",
				width: "100%",
				playerVars: {'autoplay':1,'controls': 0,'disablekb':1,'fs':0,'modestbranding':1,'playsinline':1},
				videoId: ""
			});
			/*this._player.addEventListener("onStateChange", function(evt) {
				if(evt.data == 5){
					this._player._myTimer = setInterval(function(){
						this._player.playVideo();
						console.log("tryin somethin");
					}.bind(this), 250);
				}
				if(evt.data == 1){
					clearInterval(this._player._myTimer); //stop calling updateTime
					this._publish('loaded');
				}
			}.bind(this));*/
			self._player.addEventListener("onStateChange", function(evt) {
				if(!self._player.ready){ //correctly loads the video
					if(evt.data == 5){
						self._player.setVolume(0);
						self._player.playVideo();
					}
					if(evt.data == 1){
						self._player.pauseVideo();
					}
					if(evt.data == 2){
						self._player.ready = true;
						self._player.setVolume(100);
						self._publish('loaded');
					}
					return;
				}
				switch(evt.data){
					case -1:
						//self._publish('abort'); //not really abort
						break;
					case 0:
						self._publish('ended');
						break;
					case 3: //no idea why but it works
					case 1:
						self._publish('play');
						break;
					case 2:
						self._publish('pause');
						break;
					case 5:
						self._publish('loaded');
						break;
				}
				if(evt.data == 1){ //PLAYING
					self._player._myTimer = setInterval(function(){
						self._publish('timeupdate');
					}, 250);
				}
				if(evt.data != 1){
					clearInterval(self._player._myTimer); //stop calling updateTime
				}
				
			});
			this._player.addEventListener("onError", function(evt) {
				this._publish('error');
			}.bind(this));
			this._player.addEventListener('onReady',function(evt){
				console.log("Youtube is ready");
				this._ready = true;
				this._publish('ready');
			}.bind(this));
		}.bind(this));
	}
	destroy(){
		document.getElementById(this._iframe_id).remove();
		clearInterval(this._player._myTimer); //stop calling updateTime
		delete this._iframe_id;
		super.destroy();
		return Promise.resolve();
	}
	load(track){
		this._player.ready = false;
		try{
			let id = YT.getYoutubeId(track.src);
			this._player.cueVideoById(id,0);
			return this.waitForEvent('loaded');
		}catch(error){
			this._publish('error');
			return Promise.reject('Invalid Url');
		}
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
		if(time >= this.getStatus().duration){
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
	waitForEvent(event) {
		if(event == 'ready'){
			return new Promise(function(resolve, reject) {
				let f = function(){return this._ready};
				this.wait(f.bind(this),false,resolve,50)
			}.bind(this));
		}
		return new Promise(function(resolve, reject) {
			this.subscribe(event,{callback:resolve,once:true,error:reject});
		}.bind(this));
	}
}
YT._id = "YT";
YT.Track = class Track extends HTML.Track{
	_parent = YT;
	constructor(obj){
		super(obj);
		this.filetype = "YT";
	}
}
YT.Track.fromJSON = function(json){
	return new YT.Track(JSON.parse(json));
}
YT.getYoutubeId = function(url){
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
