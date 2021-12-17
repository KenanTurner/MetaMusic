import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import Album from '../../../src/album.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';
//Put in global scope for easy debugging
let imports = [HTML,YT,BC,SC,Album,Test,Cases];
function map(arr,obj={},f=function(i){return i}){arr.forEach(function(i){if(i.name) this[i.name] = f(i)}.bind(obj));return obj;}
map(imports,window);
window.Cases = Cases;
console.log("Loaded");

let start_btn = document.getElementById("start_btn");
let disable_console = document.getElementById("option-disable-console");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let f of Cases){
		if(test_cases[f.name]) test.add({f:f,args:args});
	}
	test.runAll(disable_console.checked);
});

let t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
let t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
let t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
let t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});

Album.players = map([HTML,YT,BC,SC],{})
let args = [Album,{title:"album",tracks:[t1,t2,t3,t4]}];
let test = new Test();

let test_cases = map(Cases,{},function(i){return true});

//imported from shared/options.js folder
createOptions(test_cases,"test_cases");