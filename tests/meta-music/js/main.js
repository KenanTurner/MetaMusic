import Player from '../../../src/player.js';
import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import YTP from '../../../src/plugins/YT-DL/YT/youtube.js';
import BCP from '../../../src/plugins/YT-DL/BC/bandcamp.js';
import SCP from '../../../src/plugins/YT-DL/SC/soundcloud.js';
import Album from '../../../src/album.js';
import Queue from '../../../src/queue.js';
import MetaMusic from '../../../src/meta-music.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';
import {map,casesToOptions,playersToOptions,displayOptions,CONCURRENT,TIMEOUT} from '../../shared/tools.js';

let imports = {HTML,YT,BC,SC,Album,Queue,MetaMusic,Test,Cases,YTP,BCP,SCP};
map(imports,window);
console.log("Imports Loaded");

let args = {};
let err_track = {src:"https://throw-error",title:"Throw Error"};
let t1 = {src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory",filetype:"HTML"};
let t2 = {src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard",filetype:"YT"};
let t3 = {src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven",filetype:"BC"};
let t4 = {src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game",filetype:"SC"};
let tracks = [t1,t2,t3,t4];
let players = {HTML,YT,BC,SC,YTP,BCP,SCP}

let test_cases = casesToOptions(Cases);
let test_players = playersToOptions(players);
displayOptions(test_cases,"test_cases");
displayOptions(test_players,"players");

let test = new Test();

let start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	MetaMusic.players = {};
	for(let p in test_players){
		if(test_players[p]) MetaMusic.players[players[p].name] = players[p];
	}
	tracks.forEach(function(track){
		if(!MetaMusic.players[track.filetype]) return;
		err_track.filetype = track.filetype;
		let args = {MetaMusic,track,err_track};
		for(let f of Cases){
			test.enqueue({f,args,skip:!test_cases[f.name],message:track.filetype,timeout:TIMEOUT});
		}
	});	
	test.run(CONCURRENT);
});
