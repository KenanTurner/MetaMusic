import _MetaMusic from '../../../src/meta-music.js';
export default class MetaMusic extends _MetaMusic{
	constructor(){
		_MetaMusic.players = MetaMusic.players;
		super();
		this.command_queue = [];
	}
	async enqueue(f,...args){
		return new Promise(function(res,rej){
			let obj = {f:typeof(f)==='function'? f: this[f].bind(this),res,rej,args,name:typeof(f)==='function'? f.name: f};
			this.command_queue.push(obj);
			if(this.command_queue.length === 1) this.dequeue();
		}.bind(this))
	}
	async dequeue(){
		if(this.command_queue.length === 0) return;
		let obj = this.command_queue[0];
		try{
			let e = await obj.f(...obj.args);
			obj.res(e);
		}catch(e){
			obj.rej(e);
		}finally{
			this.command_queue.shift();
			return this.dequeue();
		}
	}
	async clear(){
		if(this.command_queue.length === 0) return;
		this.command_queue.length = 1;
		await this.enqueue(function(){});
	}
}
