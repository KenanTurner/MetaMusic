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
		if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype");
		return this.publish(new this.constructor.Event("load"));
	}
	async play(){
		return this.publish(new this.constructor.Event("play"));
	}
	async pause(){
		return this.publish(new this.constructor.Event("pause"));
	}
	async seek(time){
		return this.publish(new this.constructor.Event("seek"));
	}
	async fastForward(time){
		return this.publish(new this.constructor.Event("fastforward"));
	}
	async setVolume(vol){
		return this.publish(new this.constructor.Event("volumechange"));
	}
	async stop(){
		return this.publish(new this.constructor.Event("stop"));
	}
	async getStatus(){
		return {
			'src':'',
			'time':0.0,
			'duration':0.0,
			'volume':0.0,
			'paused':true,
			'muted':false,
		}
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
