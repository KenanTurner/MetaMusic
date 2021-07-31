ModuleManager.importModules({
	"HTML":['./src/plugins/HTML/html.js'],
	"YT":['./src/plugins/YT/youtube.js'],
	"BC":['./src/plugins/BC/bandcamp.js'],
	"SC":['./src/plugins/SC/soundcloud.js'],
	"Album":['./src/album.js'],
	"MetaMusic":['./src/meta-music.js'],
	"albumTC":['./tests/albums/js/cases.js'],
	"playerTC":['./tests/players/js/cases.js'],
	"metaTC":['./tests/meta-music/js/cases.js'],
}).then(function(obj){
	//put in global scope for easier debugging
	window.HTML = obj.HTML.default;
	window.YT = obj.YT.default;
	window.BC = obj.BC.default;
	window.SC = obj.SC.default;
	window.Album = obj.Album.default;
	window.MetaMusic = obj.MetaMusic.default;
	console.log("Loaded");
	
	let disable_console = document.getElementById("option-disable-console");
	let start_btn = document.getElementById("start_btn");
	start_btn.addEventListener("click",function(){ //need to wait for user interaction
		//This is absolutely terrible but I don't have time to fix it so it stays
		test_obj['albumTC'].clear();
		for(let c in test_cases['albumTC']){
			if(test_cases['albumTC'][c]) test_obj['albumTC'].add(c,test_args['albumTC']);
		}
		test_obj['albumTC'].runAll(disable_console.checked).then(function(){
			test_obj['playerTC'].clear();
			for(let p in players){
				for(let c in test_cases['playerTC']){
					if(test_cases['playerTC'][c] && players[p]) test_obj['playerTC'].add(c,test_args['playerTC'][p],p);
				}
			}
			return test_obj['playerTC'].runAll(disable_console.checked);
		}).then(function(){
			test_obj['metaTC'].clear();
			let p = {};
			for(let player in players){
				if(players[player]) p[player] = test_players[player];
			}
			for(let c in test_cases['metaTC']){
				if(test_cases['metaTC'][c]) test_obj['metaTC'].add(c,[MetaMusic,p,a]);
			}
			test_obj['metaTC'].runAll(disable_console.checked);
		});
	});
	
	let test_players = {
		"HTML":HTML,
		"YT":YT,
		"BC":BC,
		"SC":SC
	}
	window.t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
	window.t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
	window.t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
	window.t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});
	Album.players = test_players;
	test_args['albumTC'] = [Album,{title:"album",tracks:[t1,t2,t3,t4]}];
	
	let html_args = [HTML,[],{src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"},{src:"https://throw-error",title:"Throw Error"}];
	let yt_args = [YT,[],{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},{src:"https://throw-error",title:"Throw Error"}];
	let bc_args = [BC,[],{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},{src:"https://throw-error",title:"Throw Error"}];
	let sc_args = [SC,[],{src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"},{src:"https://throw-error",title:"Throw Error"}];
	test_args['playerTC'] = {"HTML":html_args,"YT":yt_args,"BC":bc_args,"SC":sc_args};
	
	let a = new Album({title:"t",tracks:[t1,t2,t3,t4]});
	MetaMusic.players = test_players;
	
	test_obj['albumTC'] = new obj.albumTC.default();
	test_obj['playerTC'] = new obj.playerTC.default();
	test_obj['metaTC'] = new obj.metaTC.default();
})
window.test_obj = {}
window.test_cases = {}
window.test_args = {}
test_cases['albumTC'] = {
	"constructor":true,
	"json":true,
	"tracks":true,
	"events":true,
	"getInfo":true,
	"validTrack":true,
	"sort":true,
	"conversion":true,
	"addRemove":true,
	"addRemoveAlbum":true,
	"shuffle":true,
	"trackNum":true,
}
createOptions(test_cases['albumTC'],"album");
test_cases['metaTC'] = {
	"constructor":true,
	"playPause":true,
	"shuffle":true,
	"next":true,
	'subs':true,
}
createOptions(test_cases['metaTC'],"meta");
test_cases['playerTC'] = {
	"tracks":true,
	"playPause":true,
	"subs":true,
	"events":true,
	"seek":true,
}
createOptions(test_cases['playerTC'],"player");
let players = {
	"HTML":true,
	"YT":true,
	"BC":true,
	"SC":true,
}
createOptions(players,"players");
