/*
 *  This file is part of the MetaMusic library (https://github.com/KenanTurner/MetaMusic)
 *  Copyright (C) 2022  Kenan Turner
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
	constructor(async_constructor = function(res){res()}){
		super();
		this._player = {
			'src':'',
			'time':0.0,
			'duration':0.0,
			'volume':1.0,
			'paused':true,
			'muted':false,
		}
		return new Promise(function(res,rej){
			async_constructor.call(this,res.bind(this,this),rej.bind(this,this));
		}.bind(this));
	}
	async load(track){
		try{
			await fetch(track.src);
			this._player.src = track.src;
			return this.publish("loaded");
		}catch(e){
			throw this.publish("loaded",{error:e});
		}
	}
	async play(){
		this._player.paused = false;
		return this.publish("play");
	}
	async pause(){
		this._player.paused = true;
		return this.publish("pause");
	}
	async seek(time){
		let status = await this.getStatus();
		this._player.time = time;
		let p = this.publish("timeupdate");
		if(time >= status.duration) this.publish("ended");
		return p;
	}
	async fastForward(time){
		let status = await this.getStatus();
		return this.seek(status.time + time);
	}
	async setVolume(vol){
		this._player.volume = vol;
		return this.publish("volumechange");
	}
	async setMuted(bool){
		this._player.muted = bool == true;
		return this.publish("volumechange");
	}
	async stop(){
		await this.pause();
		await this.seek(0);
		return this.publish("stop");
	}
	async getStatus(){
		return this._player;
	}
	async publish(type,options = {}){
		options.status = await this.getStatus();
		return super.publish(type,options);
	}
	static isValidTrack(track){
		let p = this.Track.prototype.isPrototypeOf(track);
		let f = this.name === track.filetype;
		return (p && f);
	}
	//to enable future features
	static supported_features = {};
}