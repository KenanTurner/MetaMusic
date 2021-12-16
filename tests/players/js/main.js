import Player from '../../../src/player.js';
import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';

let imports = [Player,HTML,YT,BC,SC,Test,Cases];
function map(arr,obj={},f=function(i){return i}){arr.forEach(function(i){if(i.name) this[i.name] = f(i)}.bind(obj));return obj;}
map(imports,window);
window.Cases = Cases;
console.log("Loaded");

let html_args = [HTML,[],{src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"},{src:"https://throw-error",title:"Throw Error"}];
let yt_args = [YT,[],{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},{src:"https://throw-error",title:"Throw Error"}];
let bc_args = [BC,[],{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},{src:"https://throw-error",title:"Throw Error"}];
let sc_args = [SC,[],{src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"},{src:"https://throw-error",title:"Throw Error"}];
let args = {"HTML":html_args,"YT":yt_args,"BC":bc_args,"SC":sc_args};
let test = new Test();

let start_btn = document.getElementById("start_btn");
let disable_console = document.getElementById("option-disable-console");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let p in test_players){
		for(let f of Cases){
			if(test_cases[f.name] && test_players[p]) test.add({f:f,args:args[p],message:p});
		}
	}
	test.runAll(disable_console.checked);
});

let test_cases = map(Cases,{},function(i){return true});
let test_players = map([HTML,YT,BC,SC],{},function(i){return true});

//imported from shared/options.js folder
createOptions(test_cases,"test_cases");
createOptions(test_players,"players");
