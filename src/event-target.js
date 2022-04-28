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
import AsyncQueue from './async-queue.js';
export default class EventTarget extends AsyncQueue{
	constructor(is_ready=true){
		super(1); //AsyncQueue is used to queue commands
		this._subscribers = {all:[]};
		this._ready = is_ready == true;
		//TODO maybe use a promise instead of boolean?
	}
	async destroy(){
		let p = await this.publish(new this.constructor.Event("destroy"));
		this.ready = false;
		Object.values(this._subscribers).forEach(function(arr){
			arr.length = 0; //Removes all event listeners
		});
		return p;
	}
	get ready(){
		return this._ready;
	}
	set ready(bool){
		this._ready = bool == true;
		if(this._ready) this.publish(new this.constructor.Event("ready"));
	}
	//{type:[String],callback:[Function],<error>:[Function],<once>:[Boolean]}
	subscribe({type,callback,error,once}){
		if(!type) throw new Error("Subscriber must specify a type!");
		if(!callback) throw new Error("Subscriber must include a callback!");
		if(typeof callback !== "function") throw new Error("Callback must be a function");
		
		if(type === 'ready' && this._ready) return callback(new this.constructor.Event("ready"));
		if(!this._subscribers[type]) this._subscribers[type] = []; //creates the subscriber list
		this._subscribers[type].push({type,callback,error,once});
	}
	//{type:[String],callback:[Function],<error>:[Function],<once>:[Boolean]}
	unsubscribe({type,callback,error,once}){
		if(!type) throw new Error("Subscriber must specify a type!");
		if(!callback) throw new Error("Subscriber must include a callback!");
		if(typeof callback !== "function") throw new Error("Callback must be a function");
		
		if(!this._subscribers[type]) return;
		this._subscribers[type] = this._subscribers[type].filter(function(item){
			for(let o in item){
				if(item[o] !== ({type,callback,error,once})[o]) return true;
			}
			return false;
		});
	}
	async publish(event){
		if(!this._ready) await this.waitForEvent("ready"); //throw new Error("Cannot publish events until target is ready"); 
		if(!event.type) throw new Error("Event must specify a type!");
		event.target = this;
		let types = Object.keys(this._subscribers).filter(function(type){
			if(event.type === 'error') return true;
			if(type === 'all') return true;
			return type === event.type;
		});
		let f = function(obj){
			if(event.type === 'error' && obj.error && this !== 'error'){
				obj.error(event);
			}else{
				obj.callback(event);
			}
			return !obj.once;
		}
		types.forEach(function(type){
			if(!this._subscribers[type]) return;
			this._subscribers[type] = this._subscribers[type].filter(f,type);
		}.bind(this));
		return event;
	}
	waitForEvent(type){
		return new Promise(function(resolve, reject) {
			this.subscribe({type:type,callback:resolve,once:true,error:reject});
		}.bind(this));
	}
	chain(f,...args){ //easy promise chaining
		return function(evt){
			return this[f](...args);
		}.bind(this);
	}
	static Event = class Event{
		constructor(type,options){
			this.type = type;
			for(let o in options){
				this[o] = options[o];
			}
		}
	}
}
