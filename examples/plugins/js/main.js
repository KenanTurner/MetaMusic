import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import MetaMusic from '../../../src/meta-music.js';

let imports = {HTML,YT,BC,SC,MetaMusic};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);
console.log("Imports Loaded");

MetaMusic.players = {HTML,YT,SC,BC};
if(window.location.href.includes('.github.io/')){
	MetaMusic.players = {HTML,YT,SC};
	console.warn("Bandcamp playback has been disabled. See the README for more information.");
}
	
window.mm = await new MetaMusic();
mm.subscribe('all',{error:function(err){
	console.error(err);
	alert("There was an error playing the requested file");
}});
mm.subscribe('all',{callback:function(e){console.debug(e)}});

let plugins = {
	HTML: new HTML.Track({title:"Default (HTML Audio)",src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4"}),
	YT: new YT.Track({title:"Youtube",src:"https://www.youtube.com/watch?v=zhG7aorm0RI"}),
	BC: new BC.Track({title:"Bandcamp",src:"https://the8bitbigband.bandcamp.com/track/want-you-gone-feat-benny-benack-iii-from-portal-2"}),
	SC: new SC.Track({title:"Soundcloud",src:"https://soundcloud.com/aivisura/kk-cruisin-interstate-5-remix"}),
}

let load_btn = document.getElementById("load");
let play_btn = document.getElementById("play");
let pause_btn = document.getElementById("pause");
let stop_btn = document.getElementById("stop");
let src_box = document.getElementById("src");
let plugin_btn = document.getElementById('plugins');

//################### Handle user interaction ###################	
load_btn.addEventListener('click',function(){
	let src = src_box.value;
	let p = plugin_btn.value;
	let track = plugins[p];
	track.src = src;
	mm.clear();
	mm.enqueue('load',track);
});
plugin_btn.addEventListener('change',function(e){
	if(this.value == "BC" && window.location.href.includes('.github.io/')){
		return alert("Bandcamp playback has been disabled. See the README for more information.");
	}
	let p = this.value;
	let track = plugins[p];
	src_box.value = track.src;
	mm.clear();
	mm.enqueue("stop");
	mm.enqueue('load',track);
});

play_btn.addEventListener('click',mm.enqueue.bind(mm,'play'));
pause_btn.addEventListener('click',mm.enqueue.bind(mm,'pause'));
stop_btn.addEventListener('click',mm.enqueue.bind(mm,'stop'));
plugin_btn.dispatchEvent(new Event('change'));
