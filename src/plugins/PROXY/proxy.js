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
export default class PROXY extends HTML{
	static proxy_url = "../../src/plugins/PROXY/proxy.php";
	static Track = class Track extends HTML.Track{
		constructor(obj){
			super(obj);
			this.filetype = "PROXY";
			this.static_url = this.src; //copy for later
		}
		toJSON(){
			let obj = super.toJSON();
			obj.src = this.static_url;
			delete obj.sources;
			return obj;
		}
		static fromJSON(json){
			return new PROXY.Track(JSON.parse(json));
		}
	}
	async load(track){
		if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype!");
		if(track.src !== track.static_url && track._expiration_date > Date.now()) return super.load(track);
		let p = this.waitForEvent('loaded');
		try{
			let result = await fetch(this.constructor.proxy_url,{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(track),
			});
			if(!result.ok) throw new Error(await result.text());
			let resolved = await result.json();
			track.src = resolved.src;
			track.sources = resolved.sources;
			let e = await super.load(track);
			track._expiration_date = Date.now() + 1000*Math.floor(e.status.duration || 0);
		}catch(error){
			this.publish(new this.constructor.Event('error',{error}));
		}
		return p;
	}
}
