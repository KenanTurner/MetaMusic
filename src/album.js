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
import EventTarget from './event-target.js';
export default class Album extends EventTarget{
	static players = {};
	constructor(obj = {}){
		super(obj?true:false); //fix for EventTarget case
		
		this.title = obj.title;
		this.tracks = [];
		if(obj.tracks) this.push(...obj.tracks);
	}
	push(...items){
		items.forEach(function(track){
			if(Album.prototype.isPrototypeOf(track)) return this.push(...track.tracks);
			if(!Album.players[track.filetype]) return console.warn("Unsupported Track filetype: "+track.filetype,track);
			let val = this.length === 0? 0: Math.max(...this.getInfo('track_num'))+1;
			let tmp = track.clone? track.clone(): new Album.players[track.filetype].Track(track);
			tmp.track_num = val;
			this.tracks.push(tmp);
		}.bind(this));
		return this.publish(new this.constructor.Event("add"));
	}
	insert(index,...items){
		items.forEach(function(track){
			if(Album.prototype.isPrototypeOf(track)) return this.insert(index,...track.tracks);
			if(!Album.players[track.filetype]) return console.warn("Unsupported Track filetype: "+track.filetype,track);
			if(index >= this.length){
				this.push(track);
				return index++;
			}
			let mod = function(n, m) {return ((n % m) + m) % m;}
			let val = this.length === 0? 0: this.tracks[mod(index,this.length)].track_num;
			this.tracks.forEach(function(t,i,arr){
				if(t.track_num >= val) arr[i].track_num++;
			});
			let tmp = track.clone? track.clone(): new Album.players[track.filetype].Track(track);
			tmp.track_num = val;
			this.tracks.splice(index, 0, tmp);
			index++;
		}.bind(this));
		return this.publish(new this.constructor.Event("add"));
	}
	remove(...items){
		items.forEach(function(track){
			if(Album.prototype.isPrototypeOf(track)) return this.remove(...track.tracks);
			this.tracks = this.tracks.filter(function(t){
				return !t.equals(track);
			});
		}.bind(this));
		return this.publish(new this.constructor.Event("remove"));
	}
	clear(){
		this.tracks.length = 0;
		this.publish(new this.constructor.Event("clear"));
	}
	shuffle(){
		for(let i = this.length - 1; i > 0; i--){
			const j = Math.floor(Math.random() * (i + 1));
			[this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
		}
		return this.publish(new this.constructor.Event("shuffle"));
	}
	sort(key="track_num",reversed=false){
		this.tracks.sort(function(t1,t2){
			let val = t1.compare(t2,key);
			if(val === 0) val = t1.compare(t2,"title");
			if(val === 0) val = t1.compare(t2,"src");
			return val;
		})
		if(reversed) this.tracks.reverse();
		return this.publish(new this.constructor.Event("sort"));
	}
	filter(f){
		let tmp = this.clone();
		return tmp.tracks.filter(function(t,i,arr){
			return f(t,i,arr);
		});
	}
	findIndex(track){
		return this.tracks.findIndex(function(t){
			return t.equals(track);
		});
	}
	find(track){
		return this.tracks.find(function(t){
			return t.equals(track);
		});
	}
	has(track){
		return this.tracks.some(function(t){
			if(t.equals(track)) return true;
		});
	}
	getInfo(key){
		let arr = [];
		this.tracks.forEach(function(track){
			if(track[key] !== undefined) arr.push(track[key]);
		}.bind(this));
		return arr;
	}
	get length(){
		return this.tracks.length;
	}
	toJSON(key){
		let obj = {};
		obj.title = this.title;

		let arr = [...this.tracks];
		arr.sort(function(t1,t2){
			let val = t1.compare(t2,"track_num");
			if(val === 0) val = t1.compare(t2,"title");
			if(val === 0) val = t1.compare(t2,"src");
			return val;
		});
		obj.tracks = arr.map(function(track){
			return track.toJSON();
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
	static isValidTrack(track){
		return Object.values(Album.players).some(function(player){
			return player.isValidTrack(track);
		});
	}
}