export default [
	async function EventTarget({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		await target.destroy();
	},
	async function subscribe({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		//arguments
		let type = "DEBUG";
		let callback = function(evt){console.debug(evt);}
		//optional arguments
		let error = function(evt){console.debug(evt);}
		let once = true;
		
		//Type is missing
		await throwIfNoError("Failed to check for a type!",target.subscribe.bind(target,undefined,{callback}));
		//callback is missing
		await throwIfNoError("Failed to check for a callback!",target.subscribe.bind(target,target));
		//callback is not a function
		await throwIfNoError("Failed to check if callback is a function!",target.subscribe.bind(target,type,{callback:1}));
		
		//check subscriber array
		target.subscribe(type,{callback,error,once});
		if(target._subscribers["DEBUG"].length !== 1) throw new Error("Subscribe must populate subscribers array!");
		if(target._subscribers["DEBUG"][0].type !== type) throw new Error("Subscribe must keep type data!");
		if(target._subscribers["DEBUG"][0].callback !== callback) throw new Error("Subscribe must keep callback data!");
		if(target._subscribers["DEBUG"][0].error !== error) throw new Error("Subscribe must keep error data!");
		if(target._subscribers["DEBUG"][0].once !== once) throw new Error("Subscribe must keep once data!");
		
		//check for multiple
		target.subscribe(type,{callback});
		target.subscribe(type,{callback,error});
		if(target._subscribers["DEBUG"].length !== 3) throw new Error("Subscribe must populate subscribers array!");
		await target.destroy();
	},
	async function unsubscribe({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		//arguments
		let type = "DEBUG";
		let callback = function(evt){console.debug(evt);}
		//optional arguments
		let error = function(evt){console.debug(evt);}
		let once = true;
		
		//Type is missing
		await throwIfNoError("Failed to check for a type!",target.unsubscribe.bind(target,undefined,{callback}));
		//callback is missing
		await throwIfNoError("Failed to check for a callback!",target.unsubscribe.bind(target,target));
		//callback is not a function
		await throwIfNoError("Failed to check if callback is a function!",target.unsubscribe.bind(target,type,{callback:1}));
		
		//check subscriber array
		target.subscribe(type,{callback});
		target.unsubscribe(type,{callback});
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Unsubscribe failed to remove subscriber!");
		
		//test for multiple
		target.subscribe(type,{callback});
		target.subscribe(type,{callback});
		target.unsubscribe(type,{callback});
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Unsubscribe failed to remove subscriber!");
		
		//test for options
		target.subscribe(type,{callback,error,once});
		target.unsubscribe(type,{callback});
		if(target._subscribers["DEBUG"].length !== 1) throw new Error("Unsubscribe failed to match with options!");
		target.unsubscribe(type,{callback,error,once});
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Unsubscribe failed to match with options!");
		
		//test for none
		target.unsubscribe(type,{callback});
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Unsubscribe failed to remove none!");
		await target.destroy();
	},
	async function waitForEvent({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		//regular wait
		let p = target.waitForEvent("DEBUG");
		//wait 100 ms
		await new Promise(function(res,rej){
			setTimeout(res,100);
		});
		//publish
		target.publish('DEBUG');
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
		target.publish('DEBUG',{error:1});
		//promise gets rejected
		await throwIfNoError("Failed to reject waitForEvent subscriber!",function(){
			return p;
		});
		//check subscriber was removed
		if(target._subscribers["DEBUG"].length !== 0) throw new Error("Failed to remove waitForEvent subscriber!");
		await target.destroy();
	},
	async function publish({EventTarget}){
		//Default constructor
		let target = new EventTarget();
		//Create event
		let event = "play";
		//Add subscribers
		let callbacks = {play:0,all:0};
		let errors = {play:0,all:0};
		let f = function(type){
			return {
				callback:function(e){console.debug("CALLBACK: ",type,++callbacks[type],e)},
				error:function(e){console.debug("ERROR: ",type,++errors[type],e)}
			}
		}
		target.subscribe("play",f("play"));
		target.subscribe("all",f("all"));
		
		//check for event type
		await throwIfNoError("Failed to reject event with no type specified!",target.publish.bind(target));
		//normal operation
		await target.publish(event);
		if(callbacks.play !== 1) throw new Error("Failed to fire play callback!");
		if(callbacks.all !== 1) throw new Error("Failed to fire all callback!");
		//error operation
		await target.publish("play",{error:1});
		await target.publish("all",{error:1});
		if(errors.play !== 1) throw new Error("Failed to fire play callback!");
		if(errors.all !== 2) throw new Error("Failed to fire all callback!");
		await target.destroy();
	},
	async function observe({EventTarget}){
		let obj = {a:1,b:2,c:3,f(throw_error=false){if(throw_error) throw new Error()}};
		let proxy = EventTarget.observe(obj);
		let num_changes = 0;
		proxy.observer.subscribe("all",{callback:function(){
			num_changes++;
		}});
		
		proxy.a = 3;
		proxy.b = 2;
		proxy.c = 1;
		proxy.d = 0;
		if(num_changes !== 4) throw new Error("Failed to fire all callbacks!");
		if(obj.a !== proxy.a) throw new Error("Failed to update target!");
		if(obj.b !== proxy.b) throw new Error("Failed to update target!");
		if(obj.c !== proxy.c) throw new Error("Failed to update target!");
		if(obj.d !== proxy.d) throw new Error("Failed to update target!");
		
		let num_f = 0;
		let num_f_error = 0;
		proxy.observer.subscribe("f",{callback:function(){
			num_f++;
		},error:function(){
			num_f_error++;
		}});		
		proxy.f();
		proxy.f(false);
		try{
			proxy.f(true);
		}catch{}
		if(num_f !== 2) throw new Error("Failed to fire function callbacks!");
		if(num_f_error !== 1) throw new Error("Failed to fire function error callbacks!");
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