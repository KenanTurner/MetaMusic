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

let imports = {Player,HTML,YT,BC,SC,PROXY,Test,Cases,YTP,BCP,SCP};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k],k);};return dest;}
map(imports,window);
console.log("Imports Loaded");

if(window.location.href.includes('.github.io/')){
	console.warn("PROXY playback has been disabled. See the README for more information.");
}

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

let test = new Test();
let params = new URLSearchParams(window.location.search);

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
	test.run(Number(params.get('concurrent')) || 64);
});

function getProtoChain(obj){
    obj = obj.constructor === Object.constructor? obj: obj.constructor;
    if(obj === Object.getPrototypeOf(Object)) return [];
    let chain = getProtoChain(Object.getPrototypeOf(obj));
    chain.push(obj);
    return chain;
}

let test_cases = map(Cases,{},function(k){return Cases[k].name},function(v){return true});
let test_players = map(args,{},function(k){return k},function(v,k){
	return window.location.href.includes('.github.io/')? !getProtoChain(v.Player).includes(PROXY): params.get(k) != "False";
});

//imported from shared/options.js folder
createOptions(test_cases,"test_cases");
createOptions(test_players,"players");
