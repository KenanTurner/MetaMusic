import _Track from './plugins/custom.js';
import EventTarget from './event-target.js';
export default class HTML extends EventTarget{
	static Track = class Track extends _Track{
		constructor(obj){
			super(obj);
			this.filetype = "HTML"; //overriding
		}
		static fromJSON(json){
			return new HTML.Track(JSON.parse(json));
		}
	}
	constructor(){
		super();
		this._player = new Audio();
		
		let f = function(type){
			return function(){
				this._publish(type);
			}.bind(this);
		}.bind(this);
		this._player.addEventListener('play',f('play'));
		this._player.addEventListener('pause',f('pause'));
		this._player.addEventListener('ended',f('ended'));
		this._player.addEventListener('error',f('error'));
		this._player.addEventListener('timeupdate',f('timeupdate'));
		this._player.addEventListener('volumechange',f('volumechange'));
	}
	destroy(){
		//console.log("DESTROY!!!");
		if(this._player.constructor.name == "HTMLAudioElement") this._player.load();
		this._ready = false;
		delete this._player;
		delete this._subscribers;
		return Promise.resolve();
	}
	load(track){
		if(!this.constructor._validTrack(track)) throw new Error("Invalid Filetype");
		let f = function(){
			this._publish('loaded');
		}.bind(this);
		this._player.addEventListener('canplay',f,{once:true});
		this._player.src = track.src;
		return this.waitForEvent('loaded');
	}
	play(){
		if(!this._player.paused) return this._publish('play');
		let p = this.waitForEvent('play');
		this._player.play();
		return p;
	}
	pause(){
		if(this._player.paused) return this._publish('pause');
		let p = this.waitForEvent('pause');
		this._player.pause();
		return p;
	}
	seek(time){
		let f = function(){
			this._publish('timeupdate');
			let status = this.getStatus();
			if(status.time == status.duration) this._publish('ended');
		}.bind(this);
		this._player.addEventListener('seeked',f,{once:true});
		this._player.currentTime = time;
		return this.waitForEvent('timeupdate');
	}
	fastForward(time){
		return this.seek(this._player.currentTime + time);
	}
	setVolume(vol){
		this._player.volume = vol;
		return this.waitForEvent('volumechange');
	}
	stop(){
		let f = function(){
			this._publish('loaded');
		}.bind(this);
		this._player.addEventListener('canplay',f,{once:true});
		this._player.load();
		return this.waitForEvent('loaded');
		
		//this._player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
	}
	getStatus(){
		let data = {
			src:this._player.currentSrc,
			time:this._player.currentTime,
			duration:this._player.duration,
			volume:this._player.volume,
			paused:this._player.paused
		}
		return data;
	}
	wait(f,g,callback,step=50){
		if(f() != g) return callback();
		let self = this;
		setTimeout(function(){ self.wait(f,g,callback,step)}, step);
	}
	static _validTrack(track){
		let p = this.Track.prototype.isPrototypeOf(track);
		let f = this.name == track.filetype;
		return (p && f);
	}
	static _validURL(url){
		try{
			let tmp = new URL(url);
			let type = tmp.pathname.split('.').pop();
			type = type.toUpperCase();
			switch(type){
				case "WAV":
				case "MP3":
				case "MP4":
				case "M4A":
				case "AAC":
				case "ADTS":
				case "OGG":
				case "OGA":
				case "MOGG":
				case "FLAC":
				case "WEBM":
					return true;
			}
			return false;
		}catch(e){
			return false;
		}
	}
	//TODO _getHTMLAudioDuration
	//TODO upload class?
}
