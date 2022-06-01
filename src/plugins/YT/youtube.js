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
export default class YT extends Player{
	static Track = class Track extends Player.Track{
		constructor(obj){
			super(obj);
			this.filetype = "YT";
		}
		static fromJSON(json){
			return new YT.Track(JSON.parse(json));
		}
	}
	constructor(async_constructor = function(res){res()}){
		super(async function(res,rej){
			this._iframe_id = "_YT_"+Math.random().toString(36).substring(7);
			if(!this.constructor._YT) init(this.constructor);
			
			let div = document.createElement("div");
			div.id = this._iframe_id;
			div.style.display = "none";
			div.style.pointerEvents = "none";
			document.body.append(div);
			
			let player_vars = {
				height: "144",
				width: "100%",
				playerVars: {'controls': 0,'disablekb':1,'fs':0,'modestbranding':1,'playsinline':1},
			}
			await new Promise(function(res,rej){
				this.constructor._YT.ready(res);
			}.bind(this));
			this._player = new YT.Player(this._iframe_id, player_vars);
			this._player.addEventListener("onStateChange", function(evt){
				if(evt.data === YT.PlayerState.PLAYING){ //PLAYING
					this._player._timer = setInterval(function(){
						this.publish("timeupdate");
					}.bind(this), 100);
				}
				if(evt.data !== YT.PlayerState.PLAYING) clearInterval(this._player._timer);
			}.bind(this));
			this._player.addEventListener("onStateChange", function(evt){
				//console.debug("YT State Change: ",evt.data);
				switch(evt.data){
					/*case YT.PlayerState.UNSTARTED: //unstarted: -1
						self._publish('abort'); //not really abort
						break;*/
					case window.YT.PlayerState.ENDED: //ended: 0
						this.publish("ended");
						break;
					case window.YT.PlayerState.PLAYING: //playing: 1
						this.publish("play");
						break;
					case window.YT.PlayerState.PAUSED: //paused: 2
						this.publish("pause");
						break;
					/*case YT.PlayerState.BUFFERING: //buffering: 3
						//self._publish('buffering'); //buffering
						break;*/
					case window.YT.PlayerState.CUED: //video cued: 5
						this.publish("cued");
						break;
				}
			}.bind(this));
			this._player.addEventListener("onError", function(evt){
				this.publish("error",{error:evt});
			}.bind(this));
			await new Promise(function(res,rej){
				this._player.addEventListener('onReady',res);
			}.bind(this));
			async_constructor.call(this,res,rej);
		});
	}
	async load(track){
		let status = await this.getStatus();
		let p = this.waitForEvent('cued');
		try{
			let id = this.constructor.getYoutubeId(track.src);
			this._player.cueVideoById(id,0);
			if(status.volume !== 1){
				await p;
				await this.setVolume(status.volume);
			}
		}catch(error){
			this.publish("error",{error});
		}
		await p; //video cued
		await this.setVolume(0); //mute player
		await this.play(); //start player
		await this.stop(); //stop player
		await this.setVolume(status.volume); //unmute player
		return this.publish("loaded");
	}
	async waitForChange(f,value,step=50,...args){
		let result = await f(...args);
		if(result !== value) return result;
		await new Promise(function(res,rej){
			setTimeout(res, step);
		})
		return this.waitForChange(f,value,step,...args);
	}
	async play(){
		let status = await this.getStatus();
		let p = this.waitForEvent('play');
		if(!status.paused) return this.publish('play');
		this._player.playVideo();
		return p;
	}
	async pause(){
		let status = await this.getStatus();
		let p = this.waitForEvent('pause');
		if(status.paused) return this.publish('pause');
		this._player.pauseVideo();
		return p;
	}
	//TODO seek is inconsistent and inaccurate
	async seek(time){
		let status = await this.getStatus();
		let p = this.waitForEvent('timeupdate');
		this._player.seekTo(time,true);
		if(time < status.duration-1 && status.time !== time){
			await this.waitForChange(this.getStatus.bind(this),status.time,50,'time');
		}
		this.publish('timeupdate');
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
	async setMuted(bool){
		let status = await this.getStatus();
		bool? this._player.mute():this._player.unMute();
		if(bool !== status.muted){
			await this.waitForChange(this.getStatus.bind(this),status.muted,50,'muted');
		}
		return this.publish('volumechange');
	}
	async stop(){
		let p = this.waitForEvent('cued');
		this._player.stopVideo();
		await p;
		return this.publish('stop');
	}
	async getStatus(key){
		let data = {
			src:this._player.getVideoUrl(),
			time:this._player.getCurrentTime(),
			duration:this._player.getDuration(),
			volume:this._player.getVolume()/100,
			paused:this._player.getPlayerState()!=1,
			muted:this._player.isMuted()
		}
		if(key) return data[key];
		return data;
	}
	async destroy(){
		clearInterval(this._player._myTimer); //stop calling updateTime
		this._player.destroy();
		document.getElementById(this._iframe_id).remove();
		delete this._iframe_id;
		return super.destroy();
	}
	static getYoutubeId(url){
		let tmp = new URL(url);
		if(tmp.hostname !== "www.youtube.com" && tmp.hostname !== "youtu.be") throw new Error("Invalid hostname!");
		let id = tmp.searchParams.get('v');
		if(!id) id = tmp.pathname.substring(1);
		if(id.length !== 11) throw new Error("Invalid id!");
		return id;
	}
}

