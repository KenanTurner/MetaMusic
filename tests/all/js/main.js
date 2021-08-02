import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import Album from '../../../src/album.js';
import MetaMusic from '../../../src/meta-music.js';
import Test from '../../shared/test.js';
import AlbumCases from '../../albums/js/cases.js';
import PlayerCases from '../../players/js/cases.js';
import MetaMusicCases from '../../meta-music/js/cases.js';
//Put in global scope for easy debugging
let imports = [HTML,YT,BC,SC,Album,MetaMusic,Test];
window.map = function(arr,obj={},f=function(i){return i}){arr.forEach(function(i){if(i.name) this[i.name] = f(i)}.bind(obj));return obj;}
map(imports,window);
window.Cases = [...AlbumCases,...PlayerCases,...MetaMusicCases];
console.log("Loaded");

window.t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
window.t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
window.t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
window.t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});

let args = {}
let test = new Test();

//Album args
Album.players = map([HTML,YT,BC,SC])
args['album_cases'] = [Album,{title:"album",tracks:[t1,t2,t3,t4]}];

//Player args
let html_args = [HTML,[],{src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"},{src:"https://throw-error",title:"Throw Error"}];
let yt_args = [YT,[],{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},{src:"https://throw-error",title:"Throw Error"}];
let bc_args = [BC,[],{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},{src:"https://throw-error",title:"Throw Error"}];
let sc_args = [SC,[],{src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"},{src:"https://throw-error",title:"Throw Error"}];
args['player_cases'] = {"HTML":html_args,"YT":yt_args,"BC":bc_args,"SC":sc_args};

//MetaMusic args
args['meta_cases'] = map([HTML,YT,BC,SC])
let a = {title:"t",tracks:[t1,t2,t3,t4]};

let start_btn = document.getElementById("start_btn");
let disable_console = document.getElementById("option-disable-console");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	//Add AlbumCases
	for(let f of AlbumCases){
		if(album_cases[f.name]) test.add({f:f,args:args['album_cases'],message:'Album'});
	}
	//Add PlayerCases
	for(let p in test_players){
		for(let f of PlayerCases){
			if(player_cases[f.name] && test_players[p]) test.add({f:f,args:args['player_cases'][p],message:p});
		}
	}
	//Add MetaMusicCases
	let p = {}
	for(let t in test_players){
		if(test_players[t]) p[t] = args['meta_cases'][t];
	}
	let tmp = [MetaMusic,p,a];
	for(let f of MetaMusicCases){
		if(meta_cases[f.name]) test.add({f:f,args:tmp,timeout:20000,message:'MetaMusic'});
	}
	//runAll
	//console.log(test.test_cases);
	test.runAll(disable_console.checked);
});



let album_cases = map(AlbumCases,{},function(i){return true});
let player_cases = map(PlayerCases,{},function(i){return true});
let meta_cases = map(MetaMusicCases,{},function(i){return true});
let test_players = map([HTML,YT,BC,SC],{},function(i){return true});

//imported from shared/options.js folder
createOptions(album_cases,"album");
createOptions(player_cases,"player");
createOptions(meta_cases,"meta");
createOptions(test_players,"players");
