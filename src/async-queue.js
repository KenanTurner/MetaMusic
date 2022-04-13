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
export default class AsyncQueue{
	constructor(max_concurrent_promises = 1){
		this._max_concurrent_promises = max_concurrent_promises;
		this._concurrent_promises = [];
		this._pending_promises = [];
		this._async_queue = [];
	}
	async enqueue(f,...args){
		let p = new Promise(function(res,rej){
			this._async_queue.push({f:typeof(f)==='function'? f: this[f].bind(this),res,rej,args});
		}.bind(this));
		this._pending_promises.push(p);
		this.dequeue(); //attempt to execute function immediately
		return p;
	}
	async dequeue(){
		if(this._async_queue.length === 0) return;
		if(this._concurrent_promises.length >= this._max_concurrent_promises) return;
		let {f,res,rej,args} = this._async_queue.shift();
		let index = this._concurrent_promises.length;
		this._concurrent_promises.push(this._pending_promises.pop());
		try{
			let e = await f(...args);
			res(e);
		}catch(e){
			rej(e);
		}
		this._concurrent_promises.splice(index,1);
		this.dequeue();
	}
	async clear(is_blocking = true){
		let p = Promise.allSettled(this._concurrent_promises);
		this._async_queue.length = 0;
		this._concurrent_promises.length = 0;
		this._pending_promises.length = 0;
		if(is_blocking){
			let max = this._max_concurrent_promises;
			this._max_concurrent_promises = 0; //disable dequeuing
			await p;
			this._max_concurrent_promises = max; //enable dequeuing
			this.dequeue();
		}
		return p;
	}
}