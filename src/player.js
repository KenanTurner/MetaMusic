import _Track from './track.js';
import EventTarget from './event-target.js';
export default class Player extends EventTarget{
	static Track = class Track extends _Track{
		constructor(obj){
			super(obj);
			this.filetype = "DEFAULT"; //overriding
		}
		static fromJSON(json){
			return new Player.Track(JSON.parse(json));
		}
	}
	constructor(is_ready=true){
		super(is_ready);
		this._player = {
			'src':'',
			'time':0.0,
			'duration':0.0,
			'volume':1.0,
			'paused':true,
			'muted':false,
		}
	}
	async destroy(){
		let p = await this.publish(new this.constructor.Event("destroy"));
		this._ready = false;
		Object.values(this._subscribers).forEach(function(arr){
			arr.length = 0; //Removes all event listeners
		});
		return p;
	}
	async load(track){
		//if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype");
		let p = this.waitForEvent('loaded');
		try{
			await fetch(track.src);
			this._player.src = track.src;
			this.publish(new this.constructor.Event("loaded"));
		}catch(e){
			this.publish(new this.constructor.Event("error"));
		}
		return p;
	}
	async play(){
		this._player.paused = false;
		return this.publish(new this.constructor.Event("play"));
	}
	async pause(){
		this._player.paused = true;
		return this.publish(new this.constructor.Event("pause"));
	}
	async seek(time){
		let status = await this.getStatus();
		this._player.time = time;
		let p = this.publish(new this.constructor.Event("timeupdate"));
		if(time >= status.duration) this.publish(new this.constructor.Event("ended"));
		return p;
	}
	async fastForward(time){
		let status = await this.getStatus();
		return this.seek(status.time + time);
	}
	async setVolume(vol){
		this._player.volume = vol;
		return this.publish(new this.constructor.Event("volumechange"));
	}
	async setMuted(bool){
		this._player.muted = bool == true;
		return this.publish(new this.constructor.Event("volumechange"));
	}
	async stop(){
		await this.pause();
		await this.seek(0);
		return this.publish(new this.constructor.Event("stop"));
	}
	async getStatus(){
		return this._player;
	}
	async publish(event){
		event.status = await this.getStatus();
		return super.publish(event);
	}
	static isValidTrack(track){
		let p = this.Track.prototype.isPrototypeOf(track);
		let f = this.name === track.filetype;
		return (p && f);
	}
	//Boring upload stuff
	static hasTrackUpload(){
		return false;
	}
	static hasAlbumUpload(){
		return false;
	}
	static isValidTrackURL(url){
		return false;
	}
	static isValidAlbumURL(url){
		return false;
	}
	static async fetchTrack(url){
		return Promise.reject();
	}
	static async fetchAlbum(url){
		return Promise.reject();
	}
}