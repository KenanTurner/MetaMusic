export default class TestCases{
	constructor(){
		this.reset();
		this.clear();
		this._c = console.log;
	}
	remove(f,args,message){
		let obj = {f:f,args:args,message:message};
		this.test_cases = this.test_cases.filter(function(_obj){
			if(JSON.stringify(obj) === JSON.stringify(_obj)) return false;
			return true;
		});
	}
	clear(){
		this.test_cases = [];
	}
	add(obj){
		if(Array.prototype.isPrototypeOf(obj)) return obj.forEach(function(o){
			this.add(o);
		});
		if(typeof(obj.f) !== 'function') throw new Error("Not a function!");
		this.test_cases.push(obj);
	}
	reset(){
		this.results = {pass:0,fail:0,skip:0};
	}
	runAll(disable_console = true){
		this.reset();
		console.log("Running Tests...");
		if(disable_console) console.log = function(){}
		return this._run(this.test_cases).then(function(e){
			console.log = this._c;
			console.log("Successful Cases: ",this.results.pass);
			console.log("Failed Cases: ",this.results.fail);
			return Promise.resolve(this.results);
		}.bind(this));
	}
	run(obj){
		try{
			let p = obj.f(...obj.args);
			if(!Promise.prototype.isPrototypeOf(p)) return Promise.reject("Test Case "+obj.f+" must return a promise!");
			let t = new Promise(function(resolve, reject) {
				setTimeout(function(){reject("Timed out!")}, obj.timeout || 15000);
			});
			return Promise.race([p, t]);
		}catch(err){
			return Promise.reject(err);
		}
	}
	_run(cases,index=0){ //recursively test each case
		if(cases.length == index) return Promise.resolve("No more cases!");
		let obj = cases[index];
		this._c("Testing "+obj.f.name+": "+obj.message);
		if(obj.skip){
			this._c("%cSkipped","color: #00FF2D;");
			this.results.skip++;
			return this._run(cases,index+1);
		}
		return this.run(obj).then(function(){
			this._c("%cPassed","color: #00FF2D;");
			this.results.pass++;
		}.bind(this),function(result){
			this._c("%cFailed: ","color: #FF0000;",result);
			this.results.fail++;
		}.bind(this)).finally(function(){
			return this._run(cases,index+1);
		}.bind(this));
	}
}
