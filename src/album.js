import EventTarget from './event-target.js';
export default class Album extends EventTarget{
	static players = {};
	constructor(obj){
		super();
		if(!obj.title) throw new Error('Invalid Constructor');
		this.title = obj.title;
		
		this.tracks = [];
		if(obj.tracks) this.add(...obj.tracks);
		this.sort("track_num",false,false);
	}
	add(...tracks){
		tracks.forEach(function(track){
			try{
				if(track.toJSON) track = {...{track_num:track.track_num},...track.toJSON()}; //make sure tracks are converted correctly
				let tmp = new this.constructor.players[track.filetype].Track(track);
				if(!this.constructor._validTrack(tmp)) throw new Error("Unsupported Track Type");
				tmp.track_num = track.track_num;
				this.tracks.push(tmp);
			}catch(error){
				console.log(error);
			}
		}.bind(this));
		this.sort(this.sort_key,this.sort_reversed,false);
		this._publish('add');
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
			return val;
		})
		if(reversed) this.tracks.reverse();
		this.sort_key = key;
		this.sort_reversed = reversed;
		if(_publish) this._publish('sort');
	}
	clear(){
		this.tracks.length = 0;
		this._publish('clear');
	}
	remove(track){ //TODO delete just one duplicate?
		this.tracks = this.tracks.filter(function(t){
			if(!t.equals(track)) return true;
		});
		this._publish('remove');
	}
	get length(){
		return this.tracks.length;
	}
	toJSON(){
		let obj = {};
		obj.title = this.title;
		obj.tracks = [];
		
		let old_sort_key = this.sort_key;
		this.sort("track_num",false,false);
		this.tracks.forEach(function(track,index){
			let copy = track.toJSON();
			copy.track_num = track.track_num;
			obj.tracks.push(copy);
		}.bind(this));
		this.sort(old_sort_key,false,false);
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
