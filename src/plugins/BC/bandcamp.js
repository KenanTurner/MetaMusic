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
import HTML from '../HTML/html.js';
export default class BC extends HTML{
	static proxy_url = "../../src/plugins/BC/bandcamp-proxy.php";
	static Track = class Track extends HTML.Track{
		constructor(obj){
			super(obj);
			this.filetype = "BC";
			this.bc_url = this.src; //copy for later
		}
		toJSON(){
			let obj = super.toJSON();
			obj.src = this.bc_url;
			return obj;
		}
		static fromJSON(json){
			return new BC.Track(JSON.parse(json));
		}
	}
	constructor(){
		super(true);
	}
	async load(track){
		if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype");
		if(track.bc_url !== track.src) return super.load(track);
		let p = this.waitForEvent('loaded');
		try{
			let result = await fetch(this.constructor.proxy_url,{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({url:track.bc_url}),
			});
			let arr = await result.json();
			if(arr.length === 0) throw new Error("Invalid BC url");
			track.src = arr[0]['src'];
			super.load(track);
		}catch(error){
			this.publish(new this.constructor.Event('error',{error}));
		}
		return p;
	}
	async seek(time){
		let status = await this.getStatus();
		let p = await super.seek(time);
		if(time >= status.duration) this.publish(new this.constructor.Event('ended'));
		return p;
	}
}
