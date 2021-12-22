import HTML from '../../../src/plugins/HTML/html.js';
	
let load_btn = document.getElementById("load");
let play_btn = document.getElementById("play");
let pause_btn = document.getElementById("pause");
let stop_btn = document.getElementById("stop");
let src_box = document.getElementById("src");

let track = new HTML.Track({src:src_box.value,title:"title"});
window.html = new HTML();
html.subscribe({type:'error',callback:function(err){
	console.error(err);
	alert("There was an error playing the requested file");
}});

html.load(track);
load_btn.addEventListener('click',function(){
	track.src = src_box.value;
	html.load(track);
});
play_btn.addEventListener('click',function(){
	html.play();
});
pause_btn.addEventListener('click',function(){
	html.pause();
});
stop_btn.addEventListener('click',function(){
	html.stop();
});

