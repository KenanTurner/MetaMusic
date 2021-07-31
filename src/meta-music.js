import Album from './album.js';
export default class MetaMusic extends Album{
	constructor(obj = {}){
		Album.players = MetaMusic.players; //???
		super({title:"queue",_unsorted:true});
		this._ready = false;
		
		//add tracks
		if(obj.tracks) this.push(...obj.tracks);
		
		//create players
		this._players = {};
		let p = Object.values(this.constructor.players);
		if(p.length == 0) throw new Error("At least one player is required!");
		p.forEach(function(Player){
			this._players[Player.name] = new Player();
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
			if(this.length > 0) this.load(this.tracks[0]);
		}.bind(this));
	}
	static fromJSON(json){
		let obj = {...JSON.parse(json),...super.fromJSON(json)}; //merge the two objects
		return new MetaMusic(obj);
	}
	//Functions relating to interacting with the queue #################
	insertNext(...items){
		let index = this.find(this._track)+1;
		return this.insert(index,...items);
	}
	//Functions related to shuffling: ##################################
	updateTrackNum(){
		this.tracks.forEach(function(t,i,arr){
			arr[i].track_num = i;
		});
	}
	shuffle(){
		let index = this.find(this._track);
		if(index === -1) return super.shuffle(); //shuffle normally
		
		if(!this._status.shuffled) this.updateTrackNum();
		let shuffleAll = (index == 0 && this._status.time == 0);
		this._ready = false;
		if(shuffleAll){
			super.shuffle();
			this.load(this.tracks[0]);
		}else{
			let previous = this.filter(function(t,i,arr){
				return i<index;
			})
			let remaining = this.filter(function(t,i,arr){
				return i>index;
			})
			if(shuffleAll) remaining.insert(0,this._track);
			previous.shuffle();
			remaining.shuffle();
			if(!shuffleAll) previous.push(this._track);
			this.clear();
			this.push(previous,remaining);
		}
		this._ready = true;
		this._status.shuffled = true;
		this._publish('shuffle');
	}
	unshuffle(){
		if(!this._status.shuffled) return
		this.sort('track_num');
		this._status.shuffled = false;
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
			if(e && this._player === e.target) this._publish(type);
			if(f) this[f]();
			return e;
		}.bind(this);
	}
	play(){
		if(!this._track) return Promise.reject("Track needs to be loaded first!");
		return this._player.play()
		.then(this.handleEvent('play',{paused:false}))
		.catch(this.handleEvent('error',{paused:true}));
	}
	pause(){
		if(!this._track) return Promise.reject("Track needs to be loaded first!");
		return this._player.pause()
		.then(this.handleEvent('pause',{paused:true}))
		.catch(this.handleEvent('error',{paused:true}));
	}
	stop(){
		if(!this._track) return Promise.reject("Track needs to be loaded first!");
		return this._player.stop()
		.then(this.handleEvent('stop',{paused:true}))
		.catch(this.handleEvent('error',{paused:true}));
	}
	seek(time){
		if(!this._track) return Promise.reject("Track needs to be loaded first!");
		return this._player.seek(time)
		.then(this.handleEvent('timeupdate'))
		.catch(this.handleEvent('error',{paused:true}));
	}
	fastForward(time){
		if(!this._track) return Promise.reject("Track needs to be loaded first!");
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
		if(this._track) this.stop(); //TODO handle asynchronous stopping
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
		let index = this.find(this._track);
		if(index === -1) return Promise.reject("Unable to find next track!");
		
		let mod = function(n, m) {
			return ((n % m) + m) % m;
		}
		if(index+step != mod(index+step,this.length)){
			this._status.paused = true;
			this._publish('ended'); //End of playlist
		}
		index = mod(index+step,this.length);
		let track = this.tracks[index];
		let paused = this._status.paused;
		return this.load(track).then(function(e){
			this._publish('next');
			if(!paused) return this.play(); //TODO return load event?
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
