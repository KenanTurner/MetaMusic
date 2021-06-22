import {EventTarget} from '../../../dist/core.min.js';
export default class TestCases extends EventTarget{
	constructor(test_cases){
		super();
		this.results = {success_cases:0,fail_cases:0}
		this.test_cases = [];
		if(Array.isArray(test_cases)) test_cases.forEach(function(obj){
			this.add(obj.f,obj.args,obj.message);
		});
		this._c = console.log;
	}
	remove(f,args,message){
		let obj = {f:f,args:args,message:message};
		this.test_cases = this.test_cases.filter(function(_obj){
			if(JSON.stringify(obj) === JSON.stringify(_obj)) return false;
			return true;
		});
		this._publish('remove');
	}
	clear(){
		this.test_cases = [];
		this._publish('clear');
	}
	add(f,args,message){
		let obj = {f:f,args:args,message:message};
		if(!message) obj.message = ""; //TODO handle message better
		this.test_cases.push(obj);
		this._publish('add');
	}
	reset(){
		this.results = {success_cases:0,fail_cases:0};
	}
	runAll(disable_console = true){
		this.reset();
		console.log("Running Tests...");
		if(disable_console) console.log = function(){}
		return this._run(this.test_cases).then(function(e){
			console.log = this._c;
			console.log("Successful Cases: ",this.results.success_cases);
			console.log("Failed Cases: ",this.results.fail_cases);
			return Promise.resolve(this.results);
		}.bind(this));
	}
	run(obj){
		try{
			let p = this.constructor[obj.f](...obj.args);
			if(!Promise.prototype.isPrototypeOf(p)) return Promise.reject("Test Case "+obj.f+" must return a promise!");
			let t = new Promise(function(resolve, reject) {
				setTimeout(function(){reject("Timed out!")}, 10000);
			});
			return Promise.race([p, t]);
		}catch(err){
			return Promise.reject(err);
		}
	}
	_run(cases,index=0){ //recursively test each case
		if(cases.length == index) return Promise.resolve("No more cases!");
		let obj = cases[index];
		this._c("Testing "+obj.f+": "+obj.message);
		return this.run(obj).then(function(){
			this._c("%cPassed","color: #00FF2D;");
			this.results.success_cases++;
		}.bind(this),function(result){
			this._c("%cFailed: ","color: #FF0000;",result);
			this.results.fail_cases++;
		}.bind(this)).finally(function(){
			return this._run(cases,index+1);
		}.bind(this));
	}
}

