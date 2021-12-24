import init from './iframe-api.js';
import Player from '../../player.js';
export default class SC extends Player{
	static Track = class Track extends Player.Track{
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
	constructor(is_ready=false){
		super(is_ready);
		this._iframe_id = "_SC_"+Math.random().toString(36).substring(7);
		if(!this.constructor._SC) init(this.constructor);
		this._createSC();
	}
	async _createSC(src){
		var div = document.createElement("iframe");
			div.id = this._iframe_id;
			div.style.display = "none";
			div.style.width = "100%";
			div.style.height = "144";
			div.scrolling = "no";
			div.frameborder = "no";
			div.allow = "autoplay";
			div.src = "https://w.soundcloud.com/player/?url="+src;
		document.body.append(div);
		
		this._iframe = div;
		this._player = this.constructor._SC.Widget(div);
		let SC = window.SC //Grab SC from global scope
		await new Promise(function(res,rej){
			this._player.bind(SC.Widget.Events.READY,res);
		}.bind(this));
		this._addEventListeners();
		this._ready = true;
		this.publish(new this.constructor.Event("ready"));
		if(!src) console.log('Soundcloud is ready');
	}
	_addEventListeners(){
		let SC = window.SC //Grab SC from global scope
		this._player.bind(SC.Widget.Events.PLAY_PROGRESS, function() {
			this.publish(new this.constructor.Event("timeupdate"));
		}.bind(this));
		this._player.bind(SC.Widget.Events.PLAY, function() {
			this.publish(new this.constructor.Event("play"));
		}.bind(this));
		this._player.bind(SC.Widget.Events.PAUSE, function() {
			this.publish(new this.constructor.Event("pause"));
		}.bind(this));
		this._player.bind(SC.Widget.Events.SEEK, function() {
			this.publish(new this.constructor.Event("timeupdate"));
		}.bind(this));
		this._player.bind(SC.Widget.Events.FINISH, function() {
			this.publish(new this.constructor.Event("ended"));
		}.bind(this));
		this._player.bind(SC.Widget.Events.ERROR, function() {
			this.publish(new this.constructor.Event("error"));
		}.bind(this));
	}
	async load(track){
		if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype");
		let status = await this.getStatus();
		let p = this.waitForEvent('loaded');
		await new Promise(function(res,rej){
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
				callback: res,
			}
			this._player.load(track.src,o);
		}.bind(this));
		this.publish(new this.constructor.Event("loaded"));
		return p;
	}
	async play(){
		let p = this.waitForEvent('play');
		this._player.play();
		return p;
	}
	async pause(){
		let status = await this.getStatus();
		let p = this.waitForEvent('pause');
		if(status.paused) return this.publish(new this.constructor.Event('pause'));
		this._player.pause();
		return p;
	}
	async seek(time){
		let status = await this.getStatus();
		let p = this.waitForEvent('timeupdate');
		this._player.seekTo(time*1000);
		if(time >= status.duration && status.paused){
			this.publish(new this.constructor.Event('ended'));
		}
		if(time === status.time) this.publish(new this.constructor.Event('timeupdate'));
		return p;
	}
	async setVolume(vol){
		let status = await this.getStatus();
		let p = this.waitForEvent('volumechange');
		this._player.setVolume(vol*100);
		if(vol !== status.volume){
			await this.waitForChange(this.getStatus.bind(this),status.volume,50,'volume');
		}
		this.publish(new this.constructor.Event('volumechange'));
		return p;
	}
	async waitForChange(f,value,step=50,...args){
		let result = await f(...args);
		if(result !== value) return result;
		await new Promise(function(res,rej){
			setTimeout(res, step);
		})
		return this.waitForChange(f,value,step,...args);
	}
	async destroy(){
		let p = await super.destroy();
		this._iframe.remove();
		delete this._iframe_id;
		return p;
	}
	async getStatus(){
		let f = function(f){
			return new Promise(function(res,rej){
				this._player[f](res);
			}.bind(this));
		}.bind(this);
		let vol = f('getVolume');
		let time = f('getPosition');
		let dur = f('getDuration');
		let paused = f('isPaused');
		let s = f('getCurrentSound');
		let arr = await Promise.all([vol,time,dur,paused,s])
		let data = {};
		data['volume'] = arr[0]/100;
		data['time'] = arr[1]/1000;
		data['duration'] = arr[2]/1000;
		data['paused'] = arr[3];
		data['src'] = arr[4]? arr[4].permalink_url:'';
		data['muted'] = false;
		return data;
	}
	/*
	static _validURL(url){
		try{
			let tmp = new URL(url);
			if(tmp.hostname == "soundcloud.com") return true;
			return false;
		}catch(e){
			return false;
		}
	}*/
}
