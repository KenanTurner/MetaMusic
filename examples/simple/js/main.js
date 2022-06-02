import HTML from '../../../src/plugins/HTML/html.js';

let imports = {HTML};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);
console.log("Imports Loaded");
	
let load_btn = document.getElementById("load");
let play_btn = document.getElementById("play");
let pause_btn = document.getElementById("pause");
let stop_btn = document.getElementById("stop");
let src_box = document.getElementById("src");

window.html = await new HTML();
html.subscribe('all',{error:function(err){
	console.error(err);
	alert("There was an error playing the requested file");
}});
html.subscribe('all',{callback:function(e){
	console.debug(e);
}});


let track = new HTML.Track({src:src_box.value,title:"title"});

load_btn.addEventListener('click',function(){
	track.src = src_box.value;
	html.clear();
	html.enqueue('load',track);
});
play_btn.addEventListener('click',html.enqueue.bind(html,'play'));
pause_btn.addEventListener('click',html.enqueue.bind(html,'pause'));
stop_btn.addEventListener('click',html.enqueue.bind(html,'stop'));
load_btn.click();