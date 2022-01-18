```
	This file is part of the MetaMusic library (https://github.com/KenanTurner/MetaMusic)
    Copyright (C) 2022  Kenan Turner

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
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
		this._command_queue = []; //allows queuing of future commands
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
	async enqueue(f,...args){
		return new Promise(function(res,rej){
			let obj = {f:typeof(f)==='function'? f: this[f].bind(this),res,rej,args};
			this._command_queue.push(obj);
			if(this._command_queue.length === 1) this.dequeue();
		}.bind(this))
	}
	async dequeue(){
		if(this._command_queue.length === 0) return;
		let obj = this._command_queue[0];
		try{
			let e = await obj.f(...obj.args);
			obj.res(e);
		}catch(e){
			obj.rej(e);
		}finally{
			this._command_queue.shift();
			return this.dequeue();
		}
	}
	async clear(){
		if(this._command_queue.length === 0) return;
		this._command_queue.length = 1;
		await this.enqueue(function(){});
	}
	//to enable future features
	static supported_features = {};
}