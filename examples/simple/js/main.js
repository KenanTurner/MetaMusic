chainImports('../../../src/html.js','../../../src/_ios_html.js',"HTML")()
.then(chainImports('../../../src/plugins/YT.js','../../../src/plugins/_ios_YT.js',"YT"))
.then(chainImports('../../../src/plugins/BC.js','../../../src/plugins/BC.js',"BC"))
.then(chainImports('../../../src/plugins/SC.js','../../../src/plugins/SC.js',"SC"))
.finally(function(){
	console.log("Loaded");
	let players = [HTML,YT,BC,SC];
	
	let url_btn = document.getElementById("url_btn");
	let url_box = document.getElementById("url_box");
	url_btn.addEventListener("click",function(){ //need to wait for user interaction
		let type = getFiletype(url_box.value);
		if(!type) return;
		let args = [];
		if(type == "YT") args = ["../../src/plugins/YoutubeApi.js"];
		if(type == "BC") args = ["../../src/plugins/loadBC.php"];
		if(type == "SC") args = ["../../src/plugins/SoundcloudApi.js"];
		let track = new window[type].Track({src:url_box.value,title:"tmp"});
		let f = function(evt){
			console.log(evt);
		}
		if(current_player) current_player.destroy();
		current_player = new window[type](...args);
		current_player.subscribe('all',{callback:f});
		current_player.waitForEvent('ready')
		.then(current_player.chain('load',track))
		//.then(current_player.chain('play'))
	});
	url_box.addEventListener("keyup", function(event) {
		if(event.keyCode === 13) {
			event.preventDefault();
			url_btn.click();
		}
	});
	window.current_player = null;
	
	let play_btn = document.getElementById("play_btn");
	let pause_btn = document.getElementById("pause_btn");
	let stop_btn = document.getElementById("stop_btn");
	let rewind_btn = document.getElementById("rewind_btn");
	let fast_forward_btn = document.getElementById("fast_forward_btn");
	play_btn.addEventListener("click", function(event) {
		if(!current_player) return;
		current_player.waitForEvent('ready')
		.then(current_player.chain('play'));
	});
	pause_btn.addEventListener("click", function(event) {
		if(!current_player) return;
		current_player.waitForEvent('ready')
		.then(current_player.chain('pause'));
	});
	stop_btn.addEventListener("click", function(event) {
		if(!current_player) return;
		current_player.waitForEvent('ready')
		.then(current_player.chain('stop'));
	});
	rewind_btn.addEventListener("click", function(event) {
		if(!current_player) return;
		current_player.waitForEvent('ready')
		.then(current_player.chain('fastForward',-5));
	});
	fast_forward_btn.addEventListener("click", function(event) {
		if(!current_player) return;
		current_player.waitForEvent('ready')
		.then(current_player.chain('fastForward',5));
	});
})

function getFiletype(url){
	try{
		let tmp = new URL(url);
		if(tmp.hostname == "www.youtube.com" || tmp.hostname == "youtu.be"){
			return "YT";
		}
		if(tmp.hostname.includes("bandcamp.com")){
			return "BC";
		}
		if(tmp.hostname == "soundcloud.com"){
			return "SC";
		}
		return "HTML";
	}catch(e){
		return undefined;
	}
}

function chainImports(file,error,name,extras){
	return function(){
		return import(file)
		.then(function(module){
			window[name] = module["default"];
			for(let item in extras){
				window[extras[item]] = module[item];
			}
		}).catch(function(err){
			console.log("Error loading default file.");
			return import(error).then(function(module){
				window[name] = module["default"];
				for(let item in extras){
					window[extras[item]] = module[item];
				}
			}).catch(function(err){
				console.log("Failed to load any files.");
				window[name] = undefined;
			});
		})
	}
}

//{"title":"Preludes Book II: Nos. 1-12","artist":"Claude Debussy","date":"2021-05-12T23:16:56.000+00:00"}
//{"title":"Premiere Rhapsodie","artist":"Claude Debussy","date":"2021-05-18T16:50:50.000+00:00"}
//{"title":"Il bell'Antonio, Tema III","artist":"Giovanni Sollima","date":"2021-05-13T00:01:18.000+00:00"}
//{"title":"Fantasia para un Gentilhombre (Fantasy for a Gentleman)","artist":"Joaquin Rodrigo","date":"2021-05-18T17:33:51.000+00:00"}
//{"title":"Citizen Kane","artist":"Bernard Herrmann","date":"2021-05-18T18:02:17.000+00:00"}
