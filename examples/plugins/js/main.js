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
	
let load_btn = document.getElementById("load");
let play_btn = document.getElementById("play");
let pause_btn = document.getElementById("pause");
let stop_btn = document.getElementById("stop");
let src_box = document.getElementById("src");
let plugin_btn = document.getElementById('plugins'); 
	
window.mm = new MetaMusic();
mm.subscribe({type:'error',callback:function(err){
	console.error(err);
	alert("There was an error playing the requested file");
}});
mm.subscribe({type:'all',callback:function(e){console.debug(e)}});
mm.waitForEvent('ready').then(function(){
	plugin_btn.dispatchEvent(new Event('change'));
});

let plugins = {
	HTML: {title:"Default (HTML Audio)",src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4"},
	YT: {title:"Youtube",src:"https://www.youtube.com/watch?v=zhG7aorm0RI"},
	BC: {title:"Bandcamp",src:"https://the8bitbigband.bandcamp.com/track/want-you-gone-feat-benny-benack-iii-from-portal-2"},
	SC: {title:"Soundcloud",src:"https://soundcloud.com/aivisura/kk-cruisin-interstate-5-remix"},
}

let track = new HTML.Track(plugins['HTML']);
let load_promise = mm.waitForEvent('loaded');
	
load_btn.addEventListener('click',function(){
	let src = src_box.value;
	let p = plugin_btn.value;
	let obj = plugins[p];
	obj.src = src;
	track = new MetaMusic.players[plugin_btn.value].Track(obj);
	load_promise = mm.waitForEvent('loaded');
	mm.load(track);
});
play_btn.addEventListener('click',async function(){
	await load_promise;
	mm.play();
});
pause_btn.addEventListener('click',async function(){
	await load_promise;
	mm.pause();
});
stop_btn.addEventListener('click',async function(){
	await load_promise;
	mm.stop();
});
plugin_btn.addEventListener('change',function(e){
	if(this.value == "BC" && window.location.href.includes('.github.io/')){
		return alert("Bandcamp will not work from a static site. See the README for more information.");
	}
	let p = this.value;
	track = new MetaMusic.players[p].Track(plugins[p]);
	load_promise = mm.waitForEvent('loaded');
	mm.load(track);
	src_box.value = track.src;
});



