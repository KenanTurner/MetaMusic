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
	constructor(async_constructor = function(res){res()}){
		super(async function(res,rej){
			if(!this.constructor._SC) init(this.constructor);
			this._iframe_id = "_SC_"+Math.random().toString(36).substring(7);
			let div = document.createElement("iframe");
				div.id = this._iframe_id;
				div.style.display = "none";
				div.style.width = "100%";
				div.style.height = "144";
				div.scrolling = "no";
				div.frameborder = "no";
				div.allow = "autoplay";
				div.src = "https://w.soundcloud.com/player/?url=";
				div.sandbox = "allow-scripts allow-same-origin";
			document.body.append(div);
			
			this._iframe = div;
			this._player = this.constructor._SC.Widget(div);
			this._player.bind(this.constructor._SC.Widget.Events.PLAY_PROGRESS, this.publish.bind(this,"timeupdate",{}));
			this._player.bind(this.constructor._SC.Widget.Events.PLAY, this.publish.bind(this,"play",{}));
			this._player.bind(this.constructor._SC.Widget.Events.PAUSE, this.publish.bind(this,"pause",{}));
			this._player.bind(this.constructor._SC.Widget.Events.SEEK, this.publish.bind(this,"timeupdate",{}));
			this._player.bind(this.constructor._SC.Widget.Events.FINISH, this.publish.bind(this,"ended",{}));
			await new Promise(function(res,rej){
				this._player.bind(this.constructor._SC.Widget.Events.READY,res);
			}.bind(this));
			
			async_constructor.call(this,res,rej);
		});
	}
	async load(track){
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
			this._player.bind(this.constructor._SC.Widget.Events.ERROR, rej);
			this._player.load(track.src,o);
		}.bind(this));
		this.publish("loaded");
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
		if(status.paused) return this.publish('pause');
		this._player.pause();
		return p;
	}
	async seek(time){
		let status = await this.getStatus();
		let p = this.waitForEvent('timeupdate');
		this._player.seekTo(time*1000);
		if(time >= status.duration && status.paused){
			this.publish('ended');
		}
		if(time === status.time) this.publish('timeupdate');
		return p;
	}
	async setVolume(vol){
		let status = await this.getStatus();
		let p = this.waitForEvent('volumechange');
		this._player.setVolume(vol*100);
		if(vol !== status.volume){
			await this.waitForChange(this.getStatus.bind(this),status.volume,50,'volume');
		}
		this.publish('volumechange');
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
}
