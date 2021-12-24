export default [
	async function constructor({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		if(target._ready !== true) throw new Error("Default constructor set ready incorrectly!");
		if(target._subscribers.all.length !== 0) throw new Error("Default constructor subscribers.all should be empty!");
		//Async constructor
		target = new EventTarget(false);
		if(target._ready !== false) throw new Error("Async constructor set ready incorrectly!");
		if(target._subscribers.all.length !== 0) throw new Error("Async constructor subscribers.all should be empty!");
		//Default w/ ready set manually
		target = new EventTarget();
		target._ready = false;
		if(target._ready !== false) throw new Error("Async constructor set ready incorrectly!");
	},
	async function subscribe({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		await target.waitForEvent('ready');
		//arguments
		let type = "DEBUG";
		let callback = function(evt){console.debug(evt);}
		//optional arguments
		let error = function(evt){console.debug(evt);}
		let once = true;
		
		//Type is missing
		await throwIfNoError("Failed to check for a type!",target.subscribe.bind(target),{'callback':callback});
		//callback is missing
		await throwIfNoError("Failed to check for a callback!",target.subscribe.bind(target),{'type':type});
		//callback is not a function
		await throwIfNoError("Failed to check if callback is a function!",target.subscribe.bind(target),{'type':type,'callback':1});
		
		//check subscriber array
		target.subscribe({type,callback,error,once});
		if(target._subscribers["DEBUG"].length !== 1) throw new Error("Subscribe must populate subscribers array!");
		if(target._subscribers["DEBUG"][0].type !== type) throw new Error("Subscribe must keep type data!");
		if(target._subscribers["DEBUG"][0].callback !== callback) throw new Error("Subscribe must keep callback data!");
		if(target._subscribers["DEBUG"][0].error !== error) throw new Error("Subscribe must keep error data!");
		if(target._subscribers["DEBUG"][0].once !== once) throw new Error("Subscribe must keep once data!");
		
		//check for multiple
		target.subscribe({type,callback});
		target.subscribe({type,callback,error});
		if(target._subscribers["DEBUG"].length !== 3) throw new Error("Subscribe must populate subscribers array!");
	},
	async function unsubscribe({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		await target.waitForEvent('ready');
		//arguments
		let type = "DEBUG";
		let callback = function(evt){console.debug(evt);}
		//optional arguments
		let error = function(evt){console.debug(evt);}
		let once = true;
		
		//Type is missing
		await throwIfNoError("Unsubscribe must check for a type!",target.unsubscribe.bind(target),{callback});
		//callback is missing
		await throwIfNoError("Unsubscribe must check for a callback!",target.subscribe.bind(target),{type});
		//callback is not a function
		await throwIfNoError("Unsubscribe must check if callback is a function!",target.subscribe.bind(target),{'type':type,'callback':1});
		
		//check subscriber array
		target.subscribe({type,callback});
		target.unsubscribe({type,callback});
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Unsubscribe failed to remove subscriber!");
		
		//test for multiple
		target.subscribe({type,callback});
		target.subscribe({type,callback});
		target.unsubscribe({type,callback});
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Unsubscribe failed to remove subscriber!");
		
		//test for options
		target.subscribe({type,callback,error,once});
		target.unsubscribe({type,callback});
		if(target._subscribers["DEBUG"].length !== 1) throw new Error("Unsubscribe failed to match with options!");
		target.unsubscribe({type,callback,error,once});
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Unsubscribe failed to match with options!");
		
		//test for none
		target.unsubscribe({type,callback});
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Unsubscribe failed to remove none!");
	},
	async function waitForEvent({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		await target.waitForEvent('ready');
		//regular wait
		let p = target.waitForEvent("DEBUG");
		//wait 100 ms
		await new Promise(function(res,rej){
			setTimeout(res,100);
		});
		//publish
		target.publish(new target.constructor.Event('DEBUG'));
		await p;
		//check subscriber was removed
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Failed to remove waitForEvent subscriber!");
		
		//error wait
		p = target.waitForEvent("DEBUG");
		//wait 100 ms
		await new Promise(function(res,rej){
			setTimeout(res,100);
		});
		//publish
		target.publish(new target.constructor.Event('error'));
		//promise gets rejected
		await throwIfNoError("Failed to reject waitForEvent subscriber!",function(){
			return p;
		});
		//check subscriber was removed
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Failed to remove waitForEvent subscriber!");
	},
	async function publish({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		await target.waitForEvent('ready');
		//Create event
		let event = new target.constructor.Event("DEBUG");
		//Add subscribers
		function f(obj){
			let callback = function(evt){obj.count++;console.debug(obj.type,evt,obj.count);}
			let error = function(evt){obj.error_count++;console.debug("ERROR: "+obj.type,evt,obj.error_count);}
			target.subscribe({type:obj.type,callback,error});
		}
		let debug = {type:"DEBUG",count:0,error_count:0};
		let all = {type:"all",count:0,error_count:0};
		let error = {type:"error",count:0,error_count:0};
		f(debug);
		f(all);
		f(error);
		
		//check for event type
		await throwIfNoError("Failed to reject event with no type specified!",target.publish.bind(target),{});
		//normal operation
		await target.publish(event);		
		if(debug.count !== 1) throw new Error("Failed to fire debug callback!");
		if(all.count !== 1) throw new Error("Failed to fire all callback!");
		//wait for ready
		target._ready = false;
		let p = target.publish(event);
		await new Promise(function(res,rej){
			setTimeout(res,100);
		});
		target._ready = true;
		target.publish({type:'ready'}); //also fires all callback
		await p;
		if(debug.count !== 2) throw new Error("Failed to fire debug callback!");
		if(all.count !== 3) throw new Error("Failed to fire all callback!");
		//error operation
		await target.publish(new target.constructor.Event("error"));
		if(debug.error_count !== 1) throw new Error("Failed to fire debug callback!");
		if(all.error_count !== 1) throw new Error("Failed to fire all callback!");
		if(error.count !== 1) throw new Error("Failed to fire error callback!");
		if(error.error_count !== 0) throw new Error("Failed to not fire error callback!");
	},
]
async function throwsError(f,...args){
	try{
		await f(...args);
		return false;
	}catch(e){
		return true;
	}
}
async function throwIfNoError(message,f,...args){
	if(!await throwsError(f,...args)) throw new Error(message);
}