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
import PROXY from '../proxy.js';
export default class BC extends PROXY{
	static proxy_url = "/src/plugins/PROXY/youtube-dl.php";
	static Track = class Track extends PROXY.Track{
		constructor(obj){
			super(obj);
			this.filetype = "BC";
		}
		static fromJSON(json){
			return new BC.Track(JSON.parse(json));
		}
	}
	async seek(time){
		let status = await this.getStatus();
		let p = await super.seek(time);
		if(time >= status.duration) this.publish(new this.constructor.Event('ended'));
		return p;
	}
}
