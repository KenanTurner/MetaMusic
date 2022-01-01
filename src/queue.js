import Album from './album.js';
export default class Queue extends Album{
	constructor(obj = {}){
		Album.players = Queue.players; //???
		super(obj);
		
		this.current_track = undefined;
	}
	next(step=1){
		let index = this.findIndex(this.current_track);
		if(index === -1) throw new Error("Failed to find current track!");
		
		if(index+step >= this.length) this.publish(new this.constructor.Event("ended"));
		
		let mod = function(n, m) {return ((n % m) + m) % m;}
		index = mod(index+step,this.length);
		this.current_track = this.tracks[index];
		return this.publish(new this.constructor.Event("next"));
	}
	previous(step=1){
		return this.next(-step);
	}
	insertNext(...items){
		let index = this.findIndex(this.current_track)+1;
		return this.insert(index,...items);
	}
	shuffle(){
		let index = this.findIndex(this.current_track);
		if(index === -1) return super.shuffle(); //shuffle normally
		
		let prev = new Queue({tracks:this.tracks.slice(0,index)});
		let curr = this.current_track.clone();
		let next = new Queue({tracks:this.tracks.slice(index+1)});
		prev.shuffle();
		next.shuffle();
		
		let copy = [...this.tracks];
		this.clear();
		this.push(prev,curr,next);
		
		copy.forEach(function(track){
			this.find(track).track_num = track.track_num;
		}.bind(this));
		return this.publish(new this.constructor.Event("shuffle"));
	}
	toJSON(key){
		let obj = {};
		obj.title = this.title;

		let arr = [...this.tracks];
		obj.tracks = arr.map(function(track){
			return track.toJSON();
		});
		return obj;
	}
	async publish(event){
		if(this.current_track) event.current_track = this.current_track.clone();
		return super.publish(event);
	}
	static fromJSON(json){ //deserialization
		return new Queue(JSON.parse(json));
	}
	//Functions related to shuffling: ##################################
	/*updateTrackNum(){
		this.tracks.forEach(function(t,i,arr){
			arr[i].track_num = i;
		});
	}
	shuffle(){
		let index = this.find(this._track);
		if(index === -1) return super.shuffle(); //shuffle normally
		
		
		let shuffleAll = (index == 0 && this._status.time == 0);
		this._ready = false;
		if(shuffleAll){
			super.shuffle();
			this.load(this.tracks[0]);
		}else{
			let f = function(arr,obj={}){arr.forEach(function(t,i){this[t]=t.track_num}.bind(obj));return obj;}
			let map = f(this.tracks);
			let previous = new Album({title:'prev'});
			let remaining = new Album({title:'rem'});
			this.tracks.forEach(function(t,i,arr){
				if(i<index) previous.push(t);
			})
			this.tracks.forEach(function(t,i,arr){
				if(i>index) remaining.push(t);
			})
			if(shuffleAll) remaining.insert(0,this._track);
			previous.shuffle();
			remaining.shuffle();
			if(!shuffleAll) previous.push(this._track);
			this.clear();
			this.push(previous,remaining);
			this.tracks.forEach(function(t){
				t.track_num = map[t];
			});
		}
		this._ready = true;
		this._status.shuffled = true;
		this._publish('shuffle');
	}
	unshuffle(){
		if(!this._status.shuffled) return;
		let index = this.find(this._track);
		this.sort('track_num');
		if(index == 0 && this._status.time == 0) this.load(this.tracks[0]);
		this._status.shuffled = false;
	}*/
}
