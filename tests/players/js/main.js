import Player from '../../../src/player.js';
import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';

let imports = {Player,HTML,YT,BC,SC,Test,Cases};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);
console.log("Imports Loaded");

let args = {};
let err_track = {src:"https://throw-error",title:"Throw Error"};
args['Player'] = {Player,track:{src:window.location.href,title:"Example"},err_track};
args['HTML'] = {Player:HTML,track:{src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"},err_track};
args['YT'] = {Player:YT,track:{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},err_track};
args['BC'] = {Player:BC,track:{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},err_track};
args['SC'] = {Player:SC,track:{src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"},err_track};

let test = new Test();

let start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let p in test_players){
		if(!test_players[p]) continue;
		for(let f of Cases){
			let skip = !test_cases[f.name];
			test.enqueue({f,args:args[p],skip,message:p});
		}
	}
	test.run(64);
});

let test_cases = map(Cases,{},function(k){return Cases[k].name},function(v){return true});
let test_players = map({Player,HTML,YT,BC,SC},{},function(k){return k},function(v){return true});

//imported from shared/options.js folder
createOptions(test_cases,"test_cases");
createOptions(test_players,"players");
