import EventTarget from './event-target.js';
export default class Album extends EventTarget{
	static players = {};
	constructor(obj = {}){
		super();
		if(!obj.title) throw new Error('Invalid Constructor. Title is required');
		this.title = obj.title;

		this.tracks = [];
		if(obj.tracks) this.push(...obj.tracks);
		this._unsorted = obj._unsorted;
	}
	_cloneTrack(track){
		if(!this.constructor.players[track.filetype]) throw new Error("Unsupported Track Type: "+track.filetype);
		let tmp = new this.constructor.players[track.filetype].Track(track);
		if(track.clone) tmp = track.clone();
		if(!this.constructor._validTrack(tmp)) throw new Error("Invalid Track!");
		return tmp;
	}
	insert(index,...items){
		items.forEach(function(track){
			if(Album.prototype.isPrototypeOf(track)) return this.insert(index,...track.tracks);
			try{
				if(index >= this.length){
					this.push(track);
					index++;
					return;
				}				
				let tmp = this._cloneTrack(track);
				let val = 0;
				if(this.length > 0){
					let mod = function(n, m) {return ((n % m) + m) % m;}
					val = this.tracks[mod(index,this.length)].track_num;
					this.tracks.forEach(function(t,i,arr){
						if(t.track_num >= val) arr[i].track_num++;
					});
				}
				tmp.track_num = val;
				this.tracks.splice(index, 0, tmp);
				index++;
			}catch(error){
				console.error(error);
			}
		}.bind(this));
		if(items.length > 0) this._publish('add');
	}
	push(...items){
		items.forEach(function(track){
			if(Album.prototype.isPrototypeOf(track)) return this.push(...track.tracks);
			try{
				let tmp = this._cloneTrack(track);
				let val = Math.max(...this.getInfo('track_num'))+1;
				if(this.length == 0) val = 0;
				tmp.track_num = val;
				this.tracks.push(tmp);
			}catch(error){
				console.error(error);
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
			obj.tracks[index] = track.toJSON();
		});
		return obj;
	}
	static fromJSON(json){ //deserialization
		return new Album(JSON.parse(json));
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
			if(track[key] !== undefined) arr.push(track[key]);
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
