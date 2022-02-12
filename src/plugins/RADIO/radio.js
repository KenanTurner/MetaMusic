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
export default class RADIO extends HTML{
	static Track = class Track extends HTML.Track{
		constructor(obj){
			super(obj);
			this.filetype = "RADIO";
		}
		static fromJSON(json){
			return new RADIO.Track(JSON.parse(json));
		}
	}
	async seek(time){
		let event = new this.constructor.Event('timeupdate');
		this.publish(event);
		return event;
	}
	async fastForward(time){
		let event = new this.constructor.Event('timeupdate');
		this.publish(event);
		return event;
	}
	async getStatus(){
		let obj = {};
		obj.src = this._player.currentSrc;
		obj.time = 0;
		obj.duration = Infinity;
		obj.volume = this._player.volume;
		obj.paused = this._player.paused;
		obj.muted = this._player.muted;
		return obj;
	}
	async fixDuration(){}
}
