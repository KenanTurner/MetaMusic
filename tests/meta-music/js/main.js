ModuleManager.importModules({
	"TestCases":['./tests/meta-music/js/cases.js'],
	"HTML":['./src/html.js'],
	"YT":['./src/plugins/YT/youtube.js'],
	"BC":['./src/plugins/BC/bandcamp.js'],
	"SC":['./src/plugins/SC/soundcloud.js'],
	"MM":['./src/meta-music.js'],
	"Album":['./src/album.js'],
}).then(function(obj){
	//put in global scope for easier debugging
	window.TestCases = obj.TestCases.default;
	window.HTML = obj.HTML.default;
	window.YT = obj.YT.default;
	window.BC = obj.BC.default;
	window.SC = obj.SC.default;
	window.MetaMusic = obj.MM.default;
	window.Album = obj.Album.default;
	console.log("Loaded");
	
	window.t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
	window.t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
	window.t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
	window.t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});
	window.f = function(evt){
		console.log(evt);
	}
	
	let start_btn = document.getElementById("start_btn");
	start_btn.addEventListener("click",function(){ //need to wait for user interaction
		tc.clear();
		let p = {};
		for(let player in players){
			if(players[player]) p[player] = window[player];
		}
		for(let c in test_cases){
			if(test_cases[c]) tc.add(c,[MetaMusic,p,a]);
		}
		let disable_console = document.getElementById("option-disable-console");
		tc.runAll(disable_console.checked);
	});
	
	Album.players = {"HTML":HTML,"YT":YT,"SC":SC,"BC":BC};
	MetaMusic.players = {"HTML":HTML,"YT":YT,"SC":SC,"BC":BC};
	window.a = new Album({title:"t",tracks:[t1,t2,t3,t4]});
	window.tc = new TestCases();
	window.mm = new MetaMusic({tracks:[t1,t2,t3,t4]});
	mm.subscribe('all',f);
})
let test_cases = {
	"constructor":true,
	"playPause":true,
	"shuffle":true,
	"next":true,
	'subs':true,
}
let players = {
	"HTML":true,
	"YT":true,
	"BC":true,
	"SC":true,
}
//from ../shared/options.js
createOptions(test_cases,"test_cases");
createOptions(players,"players");
