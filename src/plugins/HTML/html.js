import Player from '../../player.js';
export default class HTML extends Player{
	static Track = class Track extends Player.Track{
		constructor(obj){
			super(obj);
			this.filetype = "HTML"; //overriding
		}
		static fromJSON(json){
			return new HTML.Track(JSON.parse(json));
		}
	}
	constructor(){
		super(true);
		this._player = new Audio();
		
		let f = function(type){
			return function(){
				this.publish(new this.constructor.Event(type));
			}.bind(this);
		}.bind(this);
		this._player.addEventListener('play',f('play'));
		this._player.addEventListener('pause',f('pause'));
		this._player.addEventListener('ended',f('ended'));
		this._player.addEventListener('error',f('error'));
		this._player.addEventListener('timeupdate',f('timeupdate'));
		this._player.addEventListener('volumechange',f('volumechange'));
	}
	async destroy(){
		this._player.src = '';
		this._player.load();
		return super.destroy();
	}
	async load(track){
		if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype");
		let f = function(){
			this.publish(new this.constructor.Event('loaded'));
		}.bind(this);
		this._player.addEventListener('canplay',f,{once:true});
		this._player.src = track.src;
		return this.waitForEvent('loaded');
	}
	async play(){
		let status = await this.getStatus();
		if(!status.paused) return this.publish(new this.constructor.Event('play'));
		let p = this.waitForEvent('play');
		this._player.play();
		return p;
	}
	async pause(){
		let status = await this.getStatus();
		if(status.paused) return this.publish(new this.constructor.Event('pause'));
		let p = this.waitForEvent('pause');
		this._player.pause();
		return p;
	}
	async seek(time){
		this._player.currentTime = time;
		return this.waitForEvent('timeupdate');
	}
	async fastForward(time){
		let status = await this.getStatus();
		return this.seek(status.time + time);
	}
	async setVolume(vol){
		let status = await this.getStatus();
		if(status.volume == vol) return this.publish(new this.constructor.Event('volumechange'));
		this._player.volume = vol;
		return this.waitForEvent('volumechange');
	}
	async setMuted(bool){
		let status = await this.getStatus();
		let p = this.waitForEvent('volumechange');
		this._player.muted = bool;
		if(status.muted == bool) return this.publish(new this.constructor.Event('volumechange'));
		return p;
	}
	async stop(){
		await this.pause();
		await this.seek(0);
		return this.publish(new this.constructor.Event('stop'));
	}
	async getStatus(){
		let obj = {};
		obj.src = this._player.currentSrc;
		obj.time = this._player.currentTime;
		obj.duration = this._player.duration;
		obj.volume = this._player.volume;
		obj.paused = this._player.paused;
		obj.muted = this._player.muted;
		return obj;
	}
}
