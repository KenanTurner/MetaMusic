import EventTarget from './event-target.js';
export default class Album extends EventTarget{
	static players = {};
	constructor(obj = {}){
		super();
		if(!obj.title) throw new Error('Invalid Constructor');
		this.title = obj.title;
		
		this.tracks = [];
		if(obj.tracks) this.push(...obj.tracks);
		this._unsorted = obj._unsorted;
	}
	insert(index,...items){
		items.forEach(function(track){
			if(Album.prototype.isPrototypeOf(track)) return this.insert(index,...track.tracks);
			try{
				if(track.toJSON) track = {...{track_num:track.track_num},...track.toJSON()}; //make sure tracks are converted correctly
				if(!this.constructor.players[track.filetype]) throw new Error("Unsupported Track Type: "+track.filetype);
				let tmp = new this.constructor.players[track.filetype].Track(track);
				if(!this.constructor._validTrack(tmp)) throw new Error("Invalid Track!");
				tmp.track_num = track.track_num;
				this.tracks.splice(index, 0, tmp);
				index++;
			}catch(error){
				console.log(error);
			}
		}.bind(this));
		if(items.length > 0) this._publish('add');
	}
	push(...items){
		items.forEach(function(track){
			if(Album.prototype.isPrototypeOf(track)) return this.push(...track.tracks);
			try{
				if(track.toJSON) track = {...{track_num:track.track_num},...track.toJSON()}; //make sure tracks are converted correctly
				if(!this.constructor.players[track.filetype]) throw new Error("Unsupported Track Type: "+track.filetype);
				let tmp = new this.constructor.players[track.filetype].Track(track);
				if(!this.constructor._validTrack(tmp)) throw new Error("Invalid Track!");
				tmp.track_num = track.track_num;
				this.tracks.push(tmp);
			}catch(error){
				console.log(error);
			}
		}.bind(this));
		if(items.length > 0) this._publish('add');
	}
	remove(...items){ //TODO delete just one duplicate?
		items.forEach(function(track){
			if(Album.prototype.isPrototypeOf(track)) return this.remove(...track.tracks);
			this.tracks = this.tracks.filter(function(t){
				if(!t.equals(track)) return true;
			});
		}.bind(this));		
		if(items.length > 0) this._publish('remove');
	}
	shuffle() {
		for (let i = this.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
		}
		this._publish('shuffle');
	}
	filter(f){
		let tmp = this.clone();
		tmp.clear();
		this.tracks.forEach(function(t,i,arr){
			if(f(t,i,arr)) tmp.push(t);
		});
		return tmp;
	}
	find(track){
		return this.tracks.findIndex(function(t){
			return t.equals(track);
		});
	}
	has(track){
		return this.tracks.some(function(t){
			if(t.equals(track)) return true;
		});
	}
	sort(key="track_num",reversed=false,_publish=true){
		this.tracks.sort(function(t1,t2){
			let val = t1.compare(t2,key);
			if(val === 0) val = t1.compare(t2,"title");
			if(val === 0) val = t1.compare(t2,"src");
			return val;
		})
		if(reversed) this.tracks.reverse();
		if(_publish) this._publish('sort');
	}
	clear(){
		this.tracks.length = 0;
		this._publish('clear');
	}
	get length(){
		return this.tracks.length;
	}
	toJSON(key){
		let obj = {};
		obj.title = this.title;
		obj.tracks = [...this.tracks];
		obj._unsorted = this._unsorted;
		
		if(!this._unsorted) obj.tracks.sort(function(t1,t2){
			let val = t1.compare(t2,"track_num");
			if(val === 0) val = t1.compare(t2,"title");
			if(val === 0) val = t1.compare(t2,"src");
			return val;
		})
		obj.tracks.forEach(function(track,index){
			let copy = track.toJSON();
			copy.track_num = track.track_num;
			obj.tracks[index] = copy;
		});
		return obj;
	}
	static fromJSON(json){ //deserialization
		let obj = JSON.parse(json);
		obj.tracks.forEach(function(track,i,arr){
			arr[i].track_num = track.track_num;
		}.bind(this))
		return new Album(obj);
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
	getInfo(key){
		let arr = [];
		this.tracks.forEach(function(track){
			if(track[key]) arr.push(track[key]);
		}.bind(this));
		return arr;
	}
	static _validTrack(track){
		return Object.values(Album.players).some(function(player){
			return player._validTrack(track);
		});
	}
	getStatus(){
		return "Overridden in album.js";
	}
}
//append or add?
//track or album?
//insertAt?
//findIndex?
//shuffling? rearrange tracks?
//unshuffling?
//add track inserts the track in the correct place
//add album inserts the tracks sorted by track_num
