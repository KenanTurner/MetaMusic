import Player from '../../../src/player.js';
import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import PROXY from '../../../src/plugins/PROXY/proxy.js';
import YTP from '../../../src/plugins/YT-DL/YT/youtube.js';
import BCP from '../../../src/plugins/YT-DL/BC/bandcamp.js';
import SCP from '../../../src/plugins/YT-DL/SC/soundcloud.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';
import {map,argsToOptions,casesToOptions,getProtoChain,displayOptions,CONCURRENT,TIMEOUT} from '../../shared/tools.js';

let imports = {Player,HTML,YT,BC,SC,PROXY,Test,Cases,YTP,BCP,SCP};
map(imports,window);
console.log("Imports Loaded");

let args = {};
let err_track = {src:"https://throw-error",title:"Throw Error"};
args['Player'] = {Player,track:{src:window.location.href,title:"Example"},err_track};
args['HTML'] = {Player:HTML,track:{src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"},err_track};
args['YT'] = {Player:YT,track:{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},err_track};
args['BC'] = {Player:BC,track:{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},err_track};
args['SC'] = {Player:SC,track:{src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"},err_track};
args['YTP'] = {Player:YTP,track:{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},err_track};
args['BCP'] = {Player:BCP,track:{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},err_track};
args['SCP'] = {Player:SCP,track:{src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"},err_track};

let test_cases = casesToOptions(Cases);
let test_players = argsToOptions(args);
displayOptions(test_cases,"test_cases");
displayOptions(test_players,"players");

let test = new Test();

let start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let p in test_players){
		if(!test_players[p]) continue;
		for(let f of Cases){
			let skip = !test_cases[f.name];
			test.enqueue({f,args:args[p],skip,message:p,timeout:TIMEOUT});
		}
	}
	test.run(CONCURRENT);
});