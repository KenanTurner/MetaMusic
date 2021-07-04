import EventTarget from './event-target.js';
import Album from './album.js';
export default class MusicManager extends EventTarget{
	static players = {};
	constructor(obj = {}){
		super();
		if(!obj.queue) obj.queue = {title:"queue"};
		Album.players = this.constructor.players;
		this.queue = new Album(obj.queue);
		
		//create players
		this._players = {};
		let p = Object.values(this.constructor.players);
		if(p.length == 0) throw new Error("At least one player is required!");
		p.forEach(function(Player){
			this._players[Player.name] = new Player(); //TODO use for in
			this._players[Player.name].subscribe('timeupdate',function(e){
				if(this._player === e.target) this._status.time = e.data.time;
				this.handleEvent('timeupdate')(e);
			}.bind(this),this.handleEvent('error',{paused:true}));
			this._players[Player.name].subscribe('ended',this.handleEvent('ended',{},'next'));
		}.bind(this));
		
		this._track;
		this._player;
		this._status = {
			src:"",
			time:0,
			duration:0,
			volume:1,
			paused:true,
			shuffled: false,
		}
		
		//wait for ready
		this._ready = false;
		this.waitForAll('waitForEvent','ready').then(function(){
			this._ready = true;
			this._publish('ready');
		}.bind(this));
	}
	//Functions related to serialization: ##############################
	toJSON(){ //serialization
		let obj = {};
		let copy = this.queue.clone();
		//this.sort();
		//obj.queue = this.queue.toJSON();
		return obj;
	}
	clone(){
		return this.constructor.fromJSON(JSON.stringify(this));
	}
	equals(t){
		return JSON.stringify(this) === JSON.stringify(t);
	}
	toString(){
		return JSON.stringify(this);
	}
	valueOf(){
		return JSON.stringify(this.queue.tracks); //TODO?
	}
	static fromJSON(json){ //deserialization
		return new MusicManager(JSON.parse(json));
	}
	//Functions relating to interacting with the queue #################
	//TODO strip track_num
	insertNext(...items){
		let index = this.find(this._track)+1;
		return this.insert(index,...items);
	}
	insert(index,...items){
		this.queue.insert(index,...items);
		if(!this._track && this.length > 0) this.load(this.queue.tracks[0]);
		this._publish('add');
	}
	push(...items){
		this.queue.push(...items);
		if(!this._track && this.length > 0) this.load(this.queue.tracks[0]);
		this._publish('add');
	}
	remove(...items){
		this.queue.remove(...items);
		this._publish('remove');
	}
	find(track){
		return this.queue.find(track);
	}
	has(track){
		return this.queue.has(track);
	}
	clear(){
		return this.queue.clear();
	}
	//Functions related to shuffling: ##################################
	updateTrackNum(){
		this.queue.tracks.forEach(function(t,i,arr){
			arr[i].track_num = i;
		});
	}
	shuffle(){
		//TODO handle unshuffling
		this.updateTrackNum();
		this.queue.shuffle();
		this.load(this.queue.tracks[0]);
		this._status.shuffled = true;
		this._publish('shuffle');
	}
	unshuffle(){
		if(!this._status.shuffled) this.updateTrackNum();
		return this.sort('track_num');
	}
	sort(key="track_num",reversed=false,_publish=true){
		return this.queue.sort(key,reversed,_publish);
	}
	//Functions related to interactions with a player: #################
	handleEvent(type,status = {},f){
		return function(e){
			for(let item in status){
				this._status[item] = status[item];
			}
			if(type === 'error'){
				this._publish(type);
				return Promise.reject(e);
			}
			//TODO catch e.target undefined error
			if(this._player === e.target) this._publish(type);
			if(f) this[f]();
			return e;
		}.bind(this);
	}
	play(){
		if(this.length === 0) return Promise.reject("Empty playlist!");
		return this._player.play()
		.then(this.handleEvent('play',{paused:false}))
		.catch(this.handleEvent('error',{paused:true}));
	}
	pause(){
		if(this.length === 0) return Promise.reject("Empty playlist!");
		return this._player.pause()
		.then(this.handleEvent('pause',{paused:true}))
		.catch(this.handleEvent('error',{paused:true}));
	}
	stop(){
		if(this.length === 0) return Promise.reject("Empty playlist!");
		return this._player.stop()
		.then(this.handleEvent('stop',{paused:true}))
		.catch(this.handleEvent('error',{paused:true}));
	}
	seek(time){
		if(this.length === 0) return Promise.reject("Empty playlist!");
		return this._player.seek(time)
		.then(this.handleEvent('timeupdate'))
		.catch(this.handleEvent('error',{paused:true}));
	}
	fastForward(time){
		if(this.length === 0) return Promise.reject("Empty playlist!");
		return this._player.fastForward(time)
		.then(this.handleEvent('timeupdate'))
		.catch(this.handleEvent('error',{paused:true}));
	}
	//TODO handle vol = current_vol edge case
	setVolume(vol){
		return this.waitForAll('setVolume',vol)
		.then(function(arr){
			this._status.volume = vol;
			return this._publish('volumechange');
		}.bind(this))
		.catch(this.handleEvent('error',{paused:true}));
	}
	load(t){
		try{
			this._track = t.clone(); //TODO clone or shallow copy?
			this._player = this._players[this._track.filetype];
			return this._player.load(this._track).then(function(e){
				this._status.src = e.data.src;
				this._status.duration = e.data.duration;
				this._status.time = 0;
				return Promise.resolve(e);
			}.bind(this))
			.then(this.handleEvent('loaded'))
			.catch(this.handleEvent('error',{paused:true}));
		}catch(e){
			return Promise.reject(e);
		}
	}
	//Functions related to traversing the queue: #######################
	next(step=1){
		if(this.length === 0) return Promise.reject("Empty playlist!");
		this._player.stop(); //TODO handle asynchronous stopping
		let index = this.find(this._track);
		let mod = function(n, m) {
			return ((n % m) + m) % m;
		}
		if(index+step != mod(index+step,this.length)){
			this._status.paused = true;
			this._publish('ended'); //End of playlist
		}
		index = mod(index+step,this.length);
		let track = this.queue.tracks[index];
		return this.load(track).then(function(e){
			this._publish('next');
			if(!this._status.paused) return this.play(); //TODO return load event?
			return e;
		}.bind(this),function(e){
			this._publish('error');
			console.log("Failed to load!");
			return e;
		}.bind(this));
	}
	previous(step=1){ //TODO remove?
		return this.next(-step);
	}
	//Bonus: ###########################################################
	//TODO use proxy instead???
	get length(){
		return this.queue.length;
	}
	destroy(){
		return this.waitForAll('destroy').then(function(){
			this._ready = false;
		}.bind(this));
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
	waitForAll(f,...args){
		return Promise.allSettled(this.all(f,...args))
	}
	playerStatus(){
		return Promise.all(this.all('getStatus'));
	}
	//Used for Events
	getStatus(){
		let obj = JSON.parse(JSON.stringify(this._status));
		obj.track = this._track;
		obj.player = this._player;
		return obj;
	}
}
/*
 * Notes:
 * 	Clicking play on an album clears the queue and adds all tracks in order
 * 	Two options for tracks and albums: append, play next
 * 	Tracks must be removed individually
 * 	Stop after track?
 * 	Handle shuffling?
 */
