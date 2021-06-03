chainImports('../../src/html.js','../../src/_ios_html.js',"HTML")()
.then(chainImports('../../src/plugins/YT.js','../../src/plugins/_ios_YT.js',"YT"))
.then(chainImports('../../src/plugins/BC.js','../../src/plugins/BC.js',"BC"))
.then(chainImports('../../src/plugins/SC.js','../../src/plugins/SC.js',"SC"))
.then(chainImports('./test.js','./_ios_test.js',null,{TestCases:"TC",TestObj:"TO"}))
.finally(function(){
	console.log("Loaded");
	/*console.log(HTML);
	console.log(YT);
	console.log(TC);
	console.log(TO);
	*/
	HTML.getUserId = function(){return "Overridden in main.js"}
	let test_html = {
		player:HTML,
		args:[],
		track:{src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"},
		track_err:{src:"https://throw-error",title:"Throw Error"}
	}
	let test_yt = {
		player:YT,
		args:[],
		track:{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},
		track_err:{src:"https://throw-error",title:"Throw Error"},
	}
	let test_bc = {
		player:BC,
		args:[],
		track:{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},
		track_err:{src:"https://throw-error",title:"Throw Error"}
	}
	let test_sc = {
		player:SC,
		args:[],
		track:{src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"},
		track_err:{src:"https://throw-error",title:"Throw Error"}
	}
	let test_cases = new TC();
	
	let start_btn = document.getElementById("start_btn");
	let log_box = document.getElementById("show_log");
	start_btn.addEventListener("click",function(){ //need to wait for user interaction
		test_cases.testPlayers(log_box.checked,test_html,test_yt,test_bc,test_sc);
	});
	
	/*let test_btn = document.getElementById("test_btn");
	test_btn.addEventListener("click",function(e){ //need to wait for user interaction
		let f = function(evt){console.log(evt)};
		var html = new SC();
		html.subscribe('all',{callback:f});
		var t1 = new SC.Track(t4);
		var t2 = new SC.Track({src:"e",title:"t"});
		return html.waitForEvent('ready')
		.then(html.chain('load',t1)) //loaded
		.then(html.chain('play')) //play
		.then(html.chain('pause')) //pause
		.then(html.chain('setVolume',0)) //volumechange
		.then(html.chain('seek',10)) //timeupdate
		.then(html.chain('seek',999)) //ended
		.then(html.chain('load',t2)) //error
		.then(function(){
			throw new Error("This Error should not be thrown");
		})
		.catch(function(evt){
			if(evt.message) throw evt;
			return Promise.resolve("Finished")
		})
		.then(function(){
			return new Promise(function(res,rej){
				console.log(num_events);
				if(num_events>=7) return res("Finished");
				return rej("Not enough events");
			});
		})
		.finally(html.chain('destroy'));
		.finally(function(){console.log("D")});
	});*/
	/*
	let play_btn = document.getElementById("play_btn");
	play_btn.addEventListener("click",function(e){ //need to wait for user interaction

	});
	
	let load_btn = document.getElementById("load_btn");
	load_btn.addEventListener("click",function(e){ //need to wait for user interaction

	});*/
	
	
	//window.html = new HTML();
	//window.yt = new YT();
	window.t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
	window.t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
	window.t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
	window.t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});
	window.f = function(evt){
		console.log("Hmm",evt.type);
	}
	window.g = function(evt){
		console.log(evt);
	}
	//html.subscribe('all',{callback:g});
	//yt.subscribe('all',{callback:g});
})


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

/*

//run test cases
var test_cases = new TestCases();
let start_btn = document.getElementById("start_btn");
let test_html = {
	player:HTML,
	args:[],
	track:{src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"},
	track_err:{src:"https://throw-error",title:"Throw Error"}
}
let test_yt = {
	player:YT,
	args:["test_yt","../tmp/plugins/YoutubeApi.js"],
	track:{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},
	track_err:{src:"https://throw-error",title:"Throw Error"},
}
let test_bc = {
	player:BC,
	args:[],
	track:{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},
	track_err:{src:"https://throw-error",title:"Throw Error"}
}
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test_cases.testPlayers(true,test_html,test_yt);
});

window.BC = BC;
window.t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"});

//put in global scope for easier debugging
//window.TestCases = TestCases;
//window.TestObj = TestObj;
window.HTML = HTML;
window.YT = YT;
window.MusicManager = MusicManager;
window.mm = new MusicManager(HTML,YT);
window.t1 = new HTML.Track({src:"https://vgmsite.com/soundtracks/nausicaa-of-the-valley-of-the-wind-original-soundtrack/hzdwehcn/209%20-%20tani%20heno%20michi%20%28the%20road%20to%20the%20valley%29.mp3",title:"tani heno michi (the road to the valley)"});
window.t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});

//show all events
var f = function(event){
	console.log(event);
}
mm.players.HTML.subscribe('all',{callback:f});

mm.players.YT.subscribe('all',{callback:f});
*/

//{"title":"Preludes Book II: Nos. 1-12","artist":"Claude Debussy","date":"2021-05-12T23:16:56.000+00:00"}
//{"title":"Premiere Rhapsodie","artist":"Claude Debussy","date":"2021-05-18T16:50:50.000+00:00"}
//{"title":"Il bell'Antonio, Tema III","artist":"Giovanni Sollima","date":"2021-05-13T00:01:18.000+00:00"}
//{"title":"Fantasia para un Gentilhombre (Fantasy for a Gentleman)","artist":"Joaquin Rodrigo","date":"2021-05-18T17:33:51.000+00:00"}
//{"title":"Citizen Kane","artist":"Bernard Herrmann","date":"2021-05-18T18:02:17.000+00:00"}
