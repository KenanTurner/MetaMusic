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
	constructor(){
		super(...arguments);
		this._subscribers = {all:[]};
	}
	async destroy(){
		let p = await this.publish("destroy");
		Object.values(this._subscribers).forEach(function(arr){
			arr.length = 0; //Removes all event listeners
		});
		return p;
	}
	//{type:[String],callback:[Function],<error>:[Function],<once>:[Boolean]}
	subscribe(type,{callback,error,once} = {}){
		if(!type) throw new Error("Subscriber must specify a type!");
		if(!callback && !error) throw new Error("Subscriber must include a callback or an error!");
		if(callback && typeof callback !== "function") throw new Error("Callback must be a function");
        if(error && typeof error !== "function") throw new Error("Error must be a function");
		
		if(!this._subscribers[type]) this._subscribers[type] = []; //creates the subscriber list
		this._subscribers[type].push({type,callback,once,error});
	}
	//{type:[String],callback:[Function],<error>:[Function],<once>:[Boolean]}
	unsubscribe(type,{callback,error,once} = {}){
		if(!type) throw new Error("Subscriber must specify a type!");
		if(!callback && !error) throw new Error("Subscriber must include a callback or an error!");
		if(callback && typeof callback !== "function") throw new Error("Callback must be a function");
        if(error && typeof error !== "function") throw new Error("Error must be a function");
		
		if(!this._subscribers[type]) return;
		this._subscribers[type] = this._subscribers[type].filter(function(obj){
            if(type !== obj.type) return true;
            if(callback !== obj.callback) return true;
            if(error !== obj.error) return true;
            if(once !== obj.once) return true;
			return false;
		});
	}
	async publish(type,options = {}){
		if(!type) throw new Error("Type must be specified!");
		let event = Object.entries(options).reduce(function(obj,[key, value]){
			obj[key] = value; return obj;
		},{});
		event.type = type;
		event.target = this;
        Object.entries(this._subscribers).map(function([key,value]){
            return {type:key,arr:value};
        }).filter(function({type,arr}){
			if(type === 'all') return true;
			return type === event.type;
        }).forEach(function({arr}){
            if(!arr) return;
            arr.forEach(function({type,callback,once,error},index){
                if(callback && !event.error) callback(event);
                if(error && event.error) error(event);
                if(once) arr.splice(index,1);
            });
        });
		return event;
	}
	waitForEvent(type){
		return new Promise(function(resolve, reject) {
			this.subscribe(type,{callback:resolve,once:true,error:reject});
		}.bind(this));
	}
	chain(f,...args){ //easy promise chaining
		return function(evt){
			return this[f](...args);
		}.bind(this);
	}
	static observe = function(state = {}){
		state.observer = new EventTarget();
		return new Proxy(state,{
			set: function(state, prop, value, receiver){
				state[prop] = value;
				state.observer.publish(prop,{state});
				return true;
			},
			get: function(state, prop, receiver){
				if(typeof state[prop] === "function") return function(){
					try{
						let result = state[prop].call(this,...arguments);
						state.observer.publish(prop,{args:arguments,state});
						return result;
					}catch(e){
						state.observer.publish(prop,{error:e,args:arguments,state});
						throw e;
					}
				}
				return Reflect.get(...arguments);
			}
		});
	}
}
