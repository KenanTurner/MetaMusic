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
	constructor(){
		super(false);
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
		this.constructor._YT.ready(function(){
			let f = function(g){
				return function(evt){
					return this[g](evt);
				}.bind(this);
			}.bind(this)
			this._player = new window.YT.Player(this._iframe_id, player_vars);
			this._player.addEventListener("onStateChange", function(evt){
				if(evt.data === window.YT.PlayerState.PLAYING){ //PLAYING
					this._player._timer = setInterval(function(){
						this.publish(new this.constructor.Event("timeupdate"));
					}.bind(this), 100);
				}
				if(evt.data !== window.YT.PlayerState.PLAYING) clearInterval(this._player._timer);
			}.bind(this));
			this._player.addEventListener("onStateChange", function(evt){
				console.debug("YT State Change: ",evt.data);
				switch(evt.data){
					/*case YT.PlayerState.UNSTARTED: //unstarted: -1
						self._publish('abort'); //not really abort
						break;*/
					case window.YT.PlayerState.ENDED: //ended: 0
						this.publish(new this.constructor.Event("ended"));
						break;
					case window.YT.PlayerState.PLAYING: //playing: 1
						this.publish(new this.constructor.Event("play"));
						break;
					case window.YT.PlayerState.PAUSED: //paused: 2
						this.publish(new this.constructor.Event("pause"));
						break;
					/*case YT.PlayerState.BUFFERING: //buffering: 3
						//self._publish('buffering'); //buffering
						break;*/
					case window.YT.PlayerState.CUED: //video cued: 5
						this.publish(new this.constructor.Event("cued"));
						break;
				}
			}.bind(this));
			this._player.addEventListener("onError", function(evt){
				this.publish(new this.constructor.Event("error"));
			}.bind(this));
			this._player.addEventListener('onReady', function(evt){
				this.ready = true;
			}.bind(this));
		}.bind(this));
	}
	async load(track){
		if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype");
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
			this.publish(new this.constructor.Event("error"));
		}
		await p; //video cued
		await this.setVolume(0); //mute player
		await this.play(); //start player
		await this.stop(); //stop player
		await this.setVolume(status.volume); //unmute player
		return this.publish(new this.constructor.Event("loaded"));
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
		if(!status.paused) return this.publish(new this.constructor.Event('play'));
		this._player.playVideo();
		return p;
	}
	async pause(){
		let status = await this.getStatus();
		let p = this.waitForEvent('pause');
		if(status.paused) return this.publish(new this.constructor.Event('pause'));
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
		this.publish(new this.constructor.Event('timeupdate'));
		return p;
	}
	async setVolume(vol){
		let status = await this.getStatus();
		let p = this.waitForEvent('volumechange');
		this._player.setVolume(vol*100);
		if(vol !== status.volume){
			await this.waitForChange(this.getStatus.bind(this),status.volume,50,'volume');
		}
		this.publish(new this.constructor.Event('volumechange'));
		return p;
	}
	async setMuted(bool){
		let status = await this.getStatus();
		bool? this._player.mute():this._player.unMute();
		if(bool !== status.muted){
			await this.waitForChange(this.getStatus.bind(this),status.muted,50,'muted');
		}
		return this.publish(new this.constructor.Event('volumechange'));
	}
	async stop(){
		let p = this.waitForEvent('cued');
		this._player.stopVideo();
		await p;
		return this.publish(new this.constructor.Event('stop'));
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
		try{
			let tmp = new URL(url);
			if(tmp.hostname == "www.youtube.com" || tmp.hostname == "youtu.be"){
				if(tmp.pathname == "/watch"){
					let index = tmp.search.indexOf("?v=");
					return tmp.search.substr(index+3,11);
				}else{
					return tmp.pathname.substr(1,11);
				}
			}
			throw new Error("Invalid url");
		}catch(e){
			throw new Error("Invalid url");
		}
	}
}

