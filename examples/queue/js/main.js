import Player from '../../../src/player.js';
import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import MetaMusic from '../../../src/meta-music.js';
import Custom from './custom.js';

let imports = {Player,HTML,YT,BC,SC,MetaMusic,Custom};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);
console.log("Imports Loaded");

//Inject the Custom class into the prototype chain
Object.setPrototypeOf(Player.Track,Custom); //This is poggers
Object.setPrototypeOf(Player.Track.prototype,Custom.prototype); //Like super poggers

MetaMusic.players = {HTML,YT,SC,BC};
if(window.location.href.includes('.github.io/')){
	MetaMusic.players = {HTML,YT,SC};
	console.warn("Bandcamp playback has been disabled. See the README for more information.");
}

window.mm = new MetaMusic();
mm.subscribe({type:'error',callback:function(err){
	console.error(err);
	alert("There was an error playing the requested file");
}});
mm.subscribe({type:'all',callback:function(e){console.debug(e)}});

let tracks = [
	new HTML.Track({title:"Scott's Factory",src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4"}),
	new YT.Track({title:"Waynard & Maynard",src:"https://www.youtube.com/watch?v=zhG7aorm0RI"}),
	new BC.Track({title:"Want you Gone - Portal 2",src:"https://the8bitbigband.bandcamp.com/track/want-you-gone-feat-benny-benack-iii-from-portal-2"}),
	new SC.Track({title:"K.K. Cruisin' (Interstate 5)",src:"https://soundcloud.com/aivisura/kk-cruisin-interstate-5-remix"}),
];
mm.queue.push(...tracks);

let previous_btn = document.getElementById("previous");
let backward_btn = document.getElementById("backward");
let play_btn = document.getElementById("play");
let pause_btn = document.getElementById("pause");
let stop_btn = document.getElementById("stop");
let forward_btn = document.getElementById("forward");
let next_btn = document.getElementById("next");

//################### Handle user interaction ###################
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
mm.subscribe({type:'done',callback:isPaused(true)});

mm.subscribe({type:'loaded',callback:function(e){
	mm.queue.tracks.forEach(function(t){
		t.css('remove','playing');
	});
	mm.current_track.css('add','playing');
	if(!is_paused) mm.play();
}});

//################### Display tracks ###################
let queue = document.getElementById("queue");
mm.queue.tracks.forEach(function(t){
	queue.appendChild(t.toHTML());
});

await mm.waitForEvent('ready');
mm.load(tracks[0]);
