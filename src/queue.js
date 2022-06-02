/*
 *  This file is part of the MetaMusic library (https://github.com/KenanTurner/MetaMusic)
 *  Copyright (C) 2022  Kenan Turner
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
		
		if(index+step >= this.length) this.publish("done");
		
		let mod = function(n, m) {return ((n % m) + m) % m;}
		index = mod(index+step,this.length);
		this.current_track = this.tracks[index];
		return this.publish("next");
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
		return this.publish("shuffle");
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
	async publish(type,options = {}){
		if(this.current_track) options.current_track = this.current_track.clone();
		return super.publish(type,options);
	}
	static fromJSON(json){ //deserialization
		return new Queue(JSON.parse(json));
	}
}
