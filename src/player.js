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
	constructor(){
		super();
		//Add event listeners
	}
	async destroy(){
		this._ready = false;
		delete this._subscribers;
		return Promise.resolve();
	}
	async load(track){
		if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype");
		return Promise.resolve();
	}
	async play(){
		return Promise.resolve();
	}
	async pause(){
		return Promise.resolve();
	}
	async seek(time){
		return Promise.resolve();
	}
	async fastForward(time){
		return Promise.resolve();
	}
	async setVolume(vol){
		return Promise.resolve();
	}
	async stop(){
		return Promise.resolve();
	}
	async getStatus(){
		return Promise.resolve({});
	}
	static isValidTrack(track){
		let p = this.Track.prototype.isPrototypeOf(track);
		let f = this.name === track.filetype;
		return (p && f);
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
	//TODO _getHTMLAudioDuration
	//TODO upload class?
}
