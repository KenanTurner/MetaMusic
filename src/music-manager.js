import EventTarget from './event-target.js';
export default class MusicManager extends EventTarget{
	constructor(...Players) {
		super();
		this._queue = [];
		this.currently_playing;
		this._players = {};
		let self = this;
		Players.forEach(function(Player){
			self._players[Player.name] = new Player();
		});
		
		//wait for ready
		this._ready = false;
		this.chain('waitForEvent','ready').then(function(){
			this._ready = true;
			this._publish('ready');
		}.bind(this));
	}
	play(){}
	pause(){}
	stop(){}
	destroy(){
		this.all('destroy');
		this._ready = false;
		return Promise.resolve();
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
	chain(f,...args){
		return Promise.allSettled(this.all(f,...args))
	}
	getStatus(){
		return Promise.all(this.all('getStatus'));
	}
}
/*
 * Notes:
 * 	Clicking play on an album clears the queue and adds all tracks in order
 * 	Two options for tracks and albums: append, play next
 * 	Tracks must be removed individually
 * 	Stop after track?
 * 	
 */
