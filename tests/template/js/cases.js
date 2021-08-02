export default [
	function pass(){
		return Promise.resolve("Done");
	},
	function fail(){
		return Promise.reject("Done");
	},
	function error(){
		throw new Error("AHHH");
		return Promise.resolve("Done");
	},
	function bad_return(){
		console.log("Oops");
		return true;
	},
	function timeout(){
		return new Promise(function(res,rej){
			setTimeout(res,25000);
		});
	},
]
