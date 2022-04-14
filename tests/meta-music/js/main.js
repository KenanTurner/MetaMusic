import Player from '../../../src/player.js';
import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import Album from '../../../src/album.js';
import Queue from '../../../src/queue.js';
import MetaMusic from '../../../src/meta-music.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';

let imports = {HTML,YT,BC,SC,Album,Queue,MetaMusic,Test,Cases};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);
console.log("Imports Loaded");

let err_track = {src:"https://throw-error",title:"Throw Error"};
let t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
let t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
let t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
let t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});
window.tracks = [t1,t2,t3,t4];

MetaMusic.players = {Player,HTML,YT,BC,SC};


let test = new Test();

let start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	tracks.forEach(function(track){
		let args = {MetaMusic,track:track.toJSON(),err_track:{src:"https://throw-error",title:"Throw Error",filetype:track.filetype}};
		for(let f of Cases){
			test.enqueue({f,args,skip:!test_cases[f.name],message:track.filetype,timeout:15000});
		}
	});	
	test.run(16);
});

let test_cases = map(Cases,{},function(k){return Cases[k].name},function(v){return true});

//imported from shared/options.js folder
createOptions(test_cases,"test_cases");
