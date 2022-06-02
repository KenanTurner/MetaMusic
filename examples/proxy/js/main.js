import Player from '../../../src/player.js';
import YTP from '../../../src/plugins/YT-DL/YT/youtube.js';
import BCP from '../../../src/plugins/YT-DL/BC/bandcamp.js';
import SCP from '../../../src/plugins/YT-DL/SC/soundcloud.js';
import MetaMusic from '../../../src/meta-music.js';
import Custom from './custom.js';
import Album from './custom-album.js';

let imports = {Player,YTP,BCP,SCP,MetaMusic,Custom};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);
console.log("Imports Loaded");

//Inject the Custom class into the prototype chain
Object.setPrototypeOf(Player.Track,Custom); //This is poggers
Object.setPrototypeOf(Player.Track.prototype,Custom.prototype); //Like super poggers

MetaMusic.players = {YT:YTP,SC:SCP,BC:BCP};
if(window.location.href.includes('.github.io/')){
	console.error("PROXY playback has been disabled. See the README for more information.");
	alert("PROXY playback has been disabled. See the README for more information.");
	MetaMusic.players = {};
}

window.mm = await new MetaMusic();
mm.subscribe('all',{error:function(err){
	console.error(err);
	alert("There was an error playing the requested file");
}});
mm.subscribe('all',{callback:function(e){console.debug(e)}});

let previous_btn = document.getElementById("previous");
let backward_btn = document.getElementById("backward");
let play_btn = document.getElementById("play");
let pause_btn = document.getElementById("pause");
let stop_btn = document.getElementById("stop");
let forward_btn = document.getElementById("forward");
let next_btn = document.getElementById("next");
let album_container = document.getElementById('album-container');
let track_container = document.getElementById('track-container');

//################### Handle user interaction ###################
Album.onClick = async function(a){
	while(track_container.firstChild) track_container.removeChild(track_container.lastChild);
	a.tracks.forEach(function(t){
		track_container.appendChild(t.toHTML());
	});
	mm.clear();
	mm.enqueue('stop');
	mm.enqueue(mm.queue.clear.bind(mm.queue));
	mm.enqueue(mm.queue.push.bind(mm.queue),a);
	mm.enqueue('load',a.tracks[0]);
}
Custom.onclick = function(){
	mm.clear();
	mm.enqueue('load',this);
}
let f = function(f,...args){
    return function(){
		mm.enqueue(f,...args);
	}
}
previous_btn.addEventListener('click',f('next',-1));
backward_btn.addEventListener('click',f('fastForward',-5));
play_btn.addEventListener('click',f('play'));
pause_btn.addEventListener('click',f('pause'));
stop_btn.addEventListener('click',f('stop'));
forward_btn.addEventListener('click',f('fastForward',5));
next_btn.addEventListener('click',f('next',1));

let is_paused = true;
function isPaused(bool){
	return function(e){
		is_paused = bool;
	}
}
play_btn.addEventListener('click',isPaused(false));
pause_btn.addEventListener('click',isPaused(true));
stop_btn.addEventListener('click',isPaused(true));
mm.subscribe('done',{callback:isPaused(true)});

mm.subscribe('loaded',{callback:function(e){
	mm.queue.tracks.forEach(function(t){
		t.css('remove','playing');
	});
	mm.current_track.css('add','playing');
	if(!is_paused) mm.play();
}});

//################### Display albums ###################
window.files = [
	'./data/youtube.json',
	'./data/bandcamp.json',
	'./data/soundcloud.json',
	'./data/example.json',
]
window.album_data = await Promise.all(files.map(async function(url){
	let res = await fetch(url);
	let json = await res.json();
	return json;
}));
album_data.forEach(function(data){
	let a = new Album(data);
	if(a.tracks.length > 0) album_container.appendChild(a.toHTML());
});