import AsyncQueue from '../../src/async-queue.js';
export default class Test extends AsyncQueue{
	constructor(){
		super(0);
		this.results = {pass:0,fail:0,skip:0};
	}
	reset(){
		this.results.pass = 0;
		this.results.fail = 0;
		this.results.skip = 0;
	}
	async enqueue({f,args,skip,message,timeout,name}){
		let test_name = name || f.name || this._async_queue.length;
		let g = async function(){
			return new Promise(async function(res,rej){
				if(skip){
					this.results.skip++;
					console.log(`  ${message||""} ${test_name}: %cSkipped`,"color: #3272fc;");
					return res(this.results);
				}
				try{
					let p = f(args || {});
					if(!Promise.prototype.isPrototypeOf(p)) throw Error("Failed to return a promise!");
					let e = await Promise.race([p,new Promise(function(_res, _rej){
						setTimeout(_rej.bind(null,"Timed Out!"), timeout || 10000);
					})]);
					this.results.pass++;
					console.log(`  ${message||""} ${test_name}: %cPassed`,"color: #00FF2D;");
				}catch(e){
					this.results.fail++;
					console.log(`  ${message||""} ${test_name}: %cFailed: `,"color: #FF0000;",e);
				}finally{
					res(this.results);
				}
			}.bind(this));
		}.bind(this);
		return super.enqueue(g);
	}
	async run(max_concurrent_tests = 1){
		console.log(`Running ${this._async_queue.length} Tests...`);
		let p = Promise.allSettled(this._pending_promises);
		this._max_concurrent_promises = max_concurrent_tests;
		for(let i = 0; i < max_concurrent_tests; i++) this.dequeue();
		await p;
		this._max_concurrent_promises = 0;
		console.log("%cPassed Cases: ","color: #00FF2D;",this.results.pass);
		console.log("%cFailed Cases: ","color: #FF0000;",this.results.fail);
		console.log("%cSkipped Cases: ","color: #3272fc;",this.results.skip);
		return this.results;
	}
	async clear(){
		super.clear(true);
		this.reset();
	}
}
