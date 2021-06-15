import EventTarget from './event-target.js';
export default class MusicManager extends EventTarget{
	constructor(...Players) {
		this._queue = new MusicManager.Queue();
		this._players = {};
		let self = this;
		Players.forEach(function(Player){
			self._players[Player.name] = new Player();
		});
		
		this.currently_playing;
		this._subscribers = {all:[]};
		
		//wait for ready
		this._ready = false;
	}
	enqueue(track){
		this.players.enqueue(track);
	}
	dequeue(track){
		this.players.dequeue();
	}
	static Queue = class Queue extends Array {
		enqueue(val) {this.push(val);}
		dequeue() {return this.shift();}
		peek() {return this[0];}
		isEmpty() {return this.length === 0;}
	}
	_hmm(f,...args){
		return Object.values(this._players).map(function(player){
			try{
				return player[f](...args);
			}catch(e){
				return Promise.reject(e);
			}
		});
	}
	chain(f,...args){
		return Promise.allSettled(this._hmm(f,...args))
	}
	getStatus(){
		return Promise.all(this._hmm('getStatus'));
	}
}
