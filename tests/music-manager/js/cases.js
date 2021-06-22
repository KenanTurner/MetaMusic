import T from '../../shared/test.js';
export default class TestCases extends T{
	static pass(){
		return Promise.resolve("Done");
	}
	static fail(){
		return Promise.reject("Done");
	}
	static error(){
		throw new Error("AHHH");
		return Promise.resolve("Done");
	}
	static bad_return(){
		console.log("Oops");
		return true;
	}
	static timeout(){
		return new Promise(function(res,rej){
			setTimeout(res,15000);
		});
	}
}
