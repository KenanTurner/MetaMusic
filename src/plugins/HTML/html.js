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
		let p = this.waitForEvent('loaded');
		this._player.addEventListener('canplay',f,{once:true});
		this._player.src = track.src;
		return p;
	}
	async play(){
		let status = await this.getStatus();
		let p = this.waitForEvent('play');
		if(!status.paused) this.publish(new this.constructor.Event('play'));
		this._player.play();
		return p;
	}
	async pause(){
		let status = await this.getStatus();
		let p = this.waitForEvent('pause');
		if(status.paused) this.publish(new this.constructor.Event('pause'));
		this._player.pause();
		return p;
	}
	async seek(time){
		let status = await this.getStatus();
		let p = this.waitForEvent('timeupdate');
		if(status.time === time) this.publish(new this.constructor.Event('timeupdate'));
		this._player.currentTime = time;
		return p;
	}
	async fastForward(time){
		let status = await this.getStatus();
		return this.seek(status.time + time);
	}
	async setVolume(vol){
		let status = await this.getStatus();
		let p = this.waitForEvent('volumechange');
		if(status.volume == vol) this.publish(new this.constructor.Event('volumechange'));
		this._player.volume = vol;
		return p
	}
	async setMuted(bool){
		let status = await this.getStatus();
		let p = this.waitForEvent('volumechange');
		if(status.muted == bool) this.publish(new this.constructor.Event('volumechange'));
		this._player.muted = bool;
		return p;
	}
	async stop(){
		await this.pause();
		await this.seek(0);
		return this.publish(new this.constructor.Event("stop"));
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
