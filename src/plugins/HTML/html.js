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
	constructor(async_constructor = function(res){res()}){
		super(function(res,rej){
			this._player = new Audio();
			this._player.addEventListener('ended',this.publish.bind(this,"ended",{}));
			this._player.addEventListener('timeupdate',this.publish.bind(this,"timeupdate",{}));
			async_constructor.call(this,res,rej);
		});
	}
	async destroy(){
		this._player.src = '';
		this._player.load();
		return super.destroy();
	}
	async load(track){
		try{
			await new Promise(function(res,rej){
				this._player.addEventListener('error',rej,{once:true});
				this._player.addEventListener('canplay',res,{once:true});
				if(track.sources){
					while(this._player.firstChild){ this._player.lastChild.remove(); }
					delete this._player.src;
					track.sources.forEach(function({src,ext}){
						let type = "audio/"+ext;
						switch(ext){
							case "m4a": //fix type ext
								type = "audio/mp4";
								break;
						}
						let source = document.createElement("source");
						source.src = src;
						source.type = type;
						this._player.appendChild(source);
					}.bind(this));
				}else{
					this._player.src = track.src;
				}
				this._player.load();
			}.bind(this));
			return this.publish("loaded");
		}catch(e){
			throw this.publish("loaded",{error:e});
		}
	}
	async play(){
		try{
			await this._player.play();
			return this.publish("play");
		}catch(e){
			throw this.publish("play",{error:e});
		}
	}
	async pause(){
		try{
			await this._player.pause();
			return this.publish("pause");
		}catch(e){
			throw this.publish("pause",{error:e});
		}
	}
	async seek(time){
		try{
			let status = await this.getStatus();
			this._player.currentTime = time;
			if(time >= status.duration) this.publish("ended");
			return this.publish("timeupdate");
		}catch(e){
			throw this.publish("timeupdate",{error:e});
		}
	}
	async fastForward(time){
		let status = await this.getStatus();
		return this.seek(status.time + time);
	}
	async setVolume(vol){
		try{
			this._player.volume = vol;
			return this.publish("volumechange");
		}catch(e){
			throw this.publish("volumechange",{error:e});
		}
	}
	async setMuted(bool){
		try{
			this._player.muted = bool;
			return this.publish("volumechange");
		}catch(e){
			throw this.publish("volumechange",{error:e});
		}
	}
	async stop(){
		await this.pause();
		await this.seek(0);
		return this.publish("stop");
	}
	async getStatus(){
		let obj = {};
		obj.src = this._player.currentSrc;
		obj.time = this._player.currentTime;
		obj.duration = this._player.duration;
		obj.volume = this._player.volume;
		obj.paused = this._player.paused;
		obj.muted = this._player.muted;
		if(obj.duration === Infinity){
			if(!this._player.fixed_duration) this._player.fixed_duration = this.fixDuration();
			if(isFinite(this._player.fixed_duration)) obj.duration = this._player.fixed_duration;
		}
		return obj;
	}
	async fixDuration(){
		let player = new Audio(this._player.currentSrc);
		let duration = await new Promise(function(res,rej){
			player.addEventListener("error",rej);
			player.addEventListener("durationchange",function(e){
				if(this.duration!=Infinity){
					let tmp = this.duration;
					player.remove();
					res(tmp);
				};
			}, false);
			player.load();
			player.volume = 0;
			player.currentTime = 24*60*60; //fake big time
			player.play().catch(function(){});
		});
		this._player.fixed_duration = duration;
	};
}