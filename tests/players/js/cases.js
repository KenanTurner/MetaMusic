import Cases from '../../event-target/js/cases.js';
export default Cases.concat([
	async function tracks({Player,track,err_track}){
		var t1 = new Player.Track(track);
		var t2 = new Player.Track(err_track);
		var t3 = t1.clone();
		t1.toJSON();
		t1.toString();
		t2.toJSON();
		t2.toString();
		if(!t1.equals(t3))throw new Error("Bad comparison");
		t1 = t1.clone();
		t3 = Player.Track.fromJSON(JSON.stringify(t3));
		if(!t3.equals(t1))throw new Error("Bad comparison");
		if(t1.equals(t2))throw new Error("Bad comparison");
		t3 = Player.Track.fromJSON(t1.toString());
		var t4 = Player.Track.fromJSON(t2.toString());
		if(!t4.equals(t2))throw new Error("Bad comparison");
		t1 += "E";
	},
	async function play_pause({Player,track}){
		var html = new Player();
		var t1 = new Player.Track(track);
		await html.waitForEvent('ready');
		await html.load(t1); //loaded
		await html.play(); //play
		await html.pause(); //pause
		await html.pause();
		await html.play();
		await html.play();
		await html.pause();
		await html.destroy();
	},
	async function subs({Player,track,err_track}){
		var html = new Player();
		var t1 = new Player.Track(track);
		var t2 = new Player.Track(err_track);
		var check = {
			loaded:false,
			play:false,
			pause:false,
			ended:false,
			error:false,
			timeupdate:false,
			volumechange:false,
			destroy:false,
		}
		var callback = function(evt){
			console.debug(evt);
			check[evt.type] = true;
		}
		html.subscribe({type:'loaded',callback});
		html.subscribe({type:'play',callback});
		html.subscribe({type:'pause',callback});
		html.subscribe({type:'ended',callback});
		html.subscribe({type:'error',callback});
		html.subscribe({type:'timeupdate',callback});
		html.subscribe({type:'volumechange',callback});
		html.subscribe({type:'destroy',callback});

		await html.waitForEvent('ready');
		await html.load(t1); //loaded
		await html.play(); //play
		await html.pause(); //pause
		await html.setVolume(0); //volumechange
		await html.seek(10); //timeupdate
		await html.seek(99999); //ended
		await new Promise(function(resolve,reject){
			setTimeout(resolve,100); //wait so ended is called
		});
		await throwIfNoError("Failed to throw error when loading an invalid track",html.load.bind(html),t2);
		await html.destroy();
		for(let evt in check){
			if(!check[evt]) throw new Error("Failed to fire event: "+evt);
		}
	},
	async function events({Player,track,err_track}){
		var html = new Player();
		var t1 = new Player.Track(track);
		var t2 = new Player.Track(err_track);
		await html.waitForEvent('ready');
		await html.load(t1);
		await html.play();
		await html.seek(10);
		await html.pause();
		await html.pause();
		await html.fastForward(10);
		await html.play();
		await html.setVolume(0);
		await html.stop();
		await html.play();
		await new Promise(function(resolve,reject){
			setTimeout(resolve,1000);
		});
		await throwIfNoError("Failed to throw error when loading an invalid track",html.load.bind(html),t2);
		await html.chain('destroy');
	},
	async function seek({Player,track,err_track}){
		var html = new Player();
		var t1 = new Player.Track(track);
		//var callback = function(evt){console.debug(evt)}
		var f = async function(time){
			let obj = await html.getStatus();
			console.debug(obj);
			let diff = Math.abs(obj.time - time);
			if(diff > 0.1) throw new Error("Failed to seek within 0.1 seconds");
		}
		//html.subscribe({type:'all',callback});
		await html.waitForEvent('ready');
		await html.load(t1);
		await html.fastForward(10);
		await f(10);
		await html.fastForward(13);
		await f(23);
		await html.seek(3.1415);
		await f(3.1415);
		await html.seek(15);
		await f(15);
		await html.seek(0);
		await html.setVolume(0);
		await html.play();
		await html.fastForward(10);
		await f(10);
		await html.fastForward(13.3);
		await f(23.3);
		await html.seek(3.1415);
		await f(3.1415);
		await html.seek(15);
		await f(15);
		await html.destroy();
	},
]);
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