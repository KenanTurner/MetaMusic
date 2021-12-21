export default class Test{
	constructor(){
		this.results = {pass:0,fail:0,skip:0};
		this.test_cases = [];
	}
	clear(){
		this.test_cases.length = 0;
		this.reset();
	}
	add(obj){
		if(Array.prototype.isPrototypeOf(obj)) return obj.forEach(function(o){
			this.add(o);
		}.bind(this));
		if(typeof(obj.f) !== 'function') throw new Error("Not a function!");
		if(!obj.args) obj.args = {};
		this.test_cases.push(obj);
	}
	remove(obj){
		if(Array.prototype.isPrototypeOf(obj)) return obj.forEach(function(o){
			this.remove(o);
		}.bind(this));
		if(typeof(obj.f) !== 'function') throw new Error("Not a function!");
		if(!obj.args) obj.args = {};
		this.test_cases = this.test_cases.filter(function(_obj){
			if(JSON.stringify(obj) === JSON.stringify(_obj) && obj.f.toString() === _obj.f.toString()) return false;
			return true;
		});
	}
	reset(){
		this.results.pass = 0;
		this.results.fail = 0;
		this.results.skip = 0;
	}
	async runAll(){
		this.reset();
		console.log("Running Tests...");
		await this._run(this.test_cases);
		console.log("%cPassed Cases: ","color: #00FF2D;",this.results.pass);
		console.log("%cFailed Cases: ","color: #FF0000;",this.results.fail);
		console.log("%cSkipped Cases: ","color: #3272fc;",this.results.skip);
		return this.results;
	}
	run(obj){
		try{
			let p = obj.f(obj.args);
			if(!Promise.prototype.isPrototypeOf(p)) return Promise.reject("Test Case "+obj.f.name+" must return a promise!");
			let t = new Promise(function(resolve, reject) {
				setTimeout(function(){reject("Timed out!")}, obj.timeout || 10000);
			});
			return Promise.race([p, t]);
		}catch(err){
			return Promise.reject(err);
		}
	}
	_run(cases,index=0){ //recursively test each case
		if(cases.length == index) return Promise.resolve("No more cases!");
		let obj = cases[index];
		console.log("Testing "+obj.f.name+": "+(obj.message||""));
		if(obj.skip){
			console.log("%cSkipped","color: #3272fc;");
			this.results.skip++;
			return this._run(cases,index+1);
		}
		return this.run(obj).then(function(){
			console.log("%cPassed","color: #00FF2D;");
			this.results.pass++;
		}.bind(this),function(result){
			console.log("%cFailed: ","color: #FF0000;",result);
			this.results.fail++;
		}.bind(this)).finally(function(){
			return this._run(cases,index+1);
		}.bind(this));
	}
}
