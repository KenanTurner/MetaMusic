```
    This file is part of the MetaMusic library (https://github.com/KenanTurner/MetaMusic)
    Copyright (C) 2022  Kenan Turner

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
export default class Track{
	constructor(obj){
		if(!obj.src || !obj.title) {
			throw new Error('Invalid Constructor! Title and src are required!');
		}
		this.filetype = obj.filetype;
		this.src = obj.src;
		this.title = obj.title;
	}
	toJSON(){ //serialization
		let obj = {};
		obj.filetype = this.filetype;
		obj.src = this.src;
		obj.title = this.title;
		return obj;
	}
	clone(){
		return this.constructor.fromJSON(JSON.stringify(this));
	}
	equals(t){
		return JSON.stringify(this) === JSON.stringify(t);
	}
	compare(track,key="title"){
		if(this[key] < track[key]) return -1;
		if(this[key] > track[key]) return 1;
		if(this[key] === track[key]) return 0; //beware of undefined
		if(this[key] === undefined) return -1;
		if(track[key] === undefined) return 1;
		return 0; //??
	}
	toString(){
		return JSON.stringify(this);
	}
	valueOf(){
		return JSON.stringify({src:this.src,title:this.title}); //TODO?
	}
	static fromJSON(json){ //deserialization
		return new Track(JSON.parse(json));
	}
}
