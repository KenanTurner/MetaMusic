import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import Album from '../../../src/album.js';
import MetaMusic from '../../../src/meta-music.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';
//Put in global scope for easy debugging
let imports = [HTML,YT,BC,SC,Album,MetaMusic,Test,Cases];
window.map = function(arr,obj={},f=function(i){return i}){arr.forEach(function(i){if(i.name) this[i.name] = f(i)}.bind(obj));return obj;}
map(imports,window);
window.Cases = Cases;
console.log("Loaded");

window.t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
window.t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
window.t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
window.t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});


let players = map([HTML,YT,BC,SC])
let a = {title:"t",tracks:[t1,t2,t3,t4]};
let test = new Test();

let start_btn = document.getElementById("start_btn");
let disable_console = document.getElementById("option-disable-console");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	let p = {}
	for(let t in test_players){
		if(test_players[t]) p[t] = players[t];
	}
	let args = [MetaMusic,p,a];
	for(let f of Cases){
		if(test_cases[f.name]) test.add({f:f,args:args,timeout:20000});
	}
	test.runAll(disable_console.checked);
});


let test_cases = map(Cases,{},function(i){return true});
let test_players = map([HTML,YT,BC,SC],{},function(i){return true});

//imported from shared/options.js folder
createOptions(test_cases,"test_cases");
createOptions(test_players,"players");
