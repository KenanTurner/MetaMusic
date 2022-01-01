import Queue from './queue.js';
import Player from './player.js';
export default class MetaMusic extends Player{
	static players = {};
	static Track = class Track extends Player.Track{
		constructor(obj){
			if(MetaMusic.players[obj.filetype]) return new MetaMusic.players[obj.filetype].Track(obj);
			super(obj);
		}
		static fromJSON(json){
			let obj = JSON.parse(json);
			if(MetaMusic.players[obj.filetype]) return new MetaMusic.players[obj.filetype].Track(obj);
			return new Player.Track(JSON.parse(json));
		}
	}
	constructor(){
		Queue.players = MetaMusic.players; //???
		super(false);
		
		delete this._player;
		this.queue = new Queue();
		this.queue.subscribe({type:'all',callback:function(e){
			this.publish(e);
		}.bind(this)});
		
		this.current_player = new Player();
		this._players = {};
		Object.values(this.constructor.players).forEach(function(Player){
			this._players[Player.name] = new Player();
			this._players[Player.name].subscribe({type:'error',callback:function(e){
				if(this.current_player === this._players[Player.name]) this.publish(e);
			}.bind(this)});
			this._players[Player.name].subscribe({type:'timeupdate',callback:function(e){
				if(this.current_player === this._players[Player.name]) this.publish(e);
			}.bind(this)});
			this._players[Player.name].subscribe({type:'ended',callback:function(e){
				if(this.current_player === this._players[Player.name]) this.publish(e);
			}.bind(this)});
		}.bind(this));
		
		this.waitForAll('waitForEvent','ready').then(function(){
			this.ready = true;
		}.bind(this));
	}
	get current_track(){
		return this.queue.current_track;
	}
	set current_track(track){
		this.queue.current_track = track;
	}
	async next(step=1){
		let index = this.queue.findIndex(this.current_track);
		let status = await this.getStatus();
		this.queue.next(step);
		await this.stop();
		await this.load(this.current_track);
		if(!status.paused && index+step < this.queue.length) await this.play();
		return this.current_track;
	}
	async previous(step=1){
		return this.next(-step);
	}
	async destroy(){
		let p = super.destroy();
		await this.waitForAll('destroy');
		return p;
	}
	async load(track){
		if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype");
		let status = await this.getStatus();
		await this.stop();
		this.current_track = track;
		this.current_player = this._players[track.filetype];
		let p = await this.current_player.load(track);
		await this.setVolume(status.volume);
		return this.publish(p);
	}
	async play(){
		return this.publish(await this.current_player.play());
	}
	async pause(){
		return this.publish(await this.current_player.pause());
	}
	async seek(time){
		return this.publish(await this.current_player.seek(time));
	}
	async fastForward(time){
		return this.publish(await this.current_player.fastForward(time));
	}
	async setVolume(vol){
		return this.publish(await this.current_player.setVolume(vol));
	}
	async setMuted(bool){
		return this.publish(await this.current_player.setMuted(bool));
	}
	async stop(){
		return this.publish(await this.current_player.stop());
	}
	all(f,...args){
		return Object.values(this._players).map(function(player){
			try{
				return player[f](...args);
			}catch(e){
				return Promise.reject(e);
			}
		});
	}
	async waitForAll(f,...args){
		return Promise.allSettled(this.all(f,...args))
	}
	async getStatus(){
		return this.current_player.getStatus();
	}
	async getPlayerStatus(){
		return Promise.all(this.all('getStatus'));
	}
	static isValidTrack(track){
		return Object.values(MetaMusic.players).some(function(player){
			return player.isValidTrack(track);
		});
	}
}
