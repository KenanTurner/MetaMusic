import HTML from '../../tmp/html.js';
import MusicManager from '../../tmp/MusicManager.js';
import {TestCases, TestObj} from './test.js';

//output console to screen
let c = console.log;
console.log = function(...data){
    update_text_area(...data);
    c(...data);
}
function update_text_area(...data){
	var div = document.createElement('pre');
	div.className = "console";
	data.forEach(function(item){
		switch(typeof item){
			case "string":
				div.textContent += item + " ";
				break;
			case "function":
				div.textContent += item.toString() + " ";
				break;
			case "object":
				div.textContent += item.constructor.name + " " + JSON.stringify(item,null,'\t') + " ";
				break;
			default:
				div.textContent += JSON.stringify(item,null,'\t') + " ";
		}
	});
	document.getElementById('console').append(div);
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        div.scrollIntoView();
    }
}


//run test cases
var test_cases = new TestCases();
test_cases.runAll(true);

window.HTML = HTML;
window.MusicManager = MusicManager;
window.mm = new MusicManager(HTML);
window.t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
mm.players.HTML.load(t1);

let src = document.getElementById("src");
let load_btn = document.getElementById("load");
let play_btn = document.getElementById("play");
let pause_btn = document.getElementById("pause");
let slider = document.getElementById("slider");
let code = document.getElementById("code");
let go_btn = document.getElementById("go");


load_btn.addEventListener("click",function(){
	t1.src = src.value;
	mm.players.HTML.load(t1);
});
play_btn.addEventListener("click",function(){
	mm.players.HTML.play();
});
pause_btn.addEventListener("click",function(){
	mm.players.HTML.pause();
});
slider.addEventListener('change',function(){
	mm.players.HTML.setVolume(slider.value);
});
code.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    go_btn.click();
  }else if(event.keyCode === 38) { //up
	  event.preventDefault();
	  if(cindex == chistory.length) ctmp = code.value;
	  if(cindex>0){
		  cindex--;
		  code.value = chistory[cindex];
	  }
  }else if(event.keyCode === 40) { //down
	  event.preventDefault();
	  if(cindex == -1)cindex++;
	  if(cindex<chistory.length){
		  cindex++;
		  code.value = chistory[cindex];
		  if(cindex==chistory.length) code.value = ctmp;
	  }
  }
});
window.chistory = [];
window.cindex = 0;
window.ctmp = "";
go_btn.addEventListener("click",function(){
	try{
		let t = eval.call(window,code.value); //super terrible but I don't care
		console.log(t);
	}catch(e){
		console.log(e.stack);
	}
	chistory.push(code.value);
	cindex = chistory.length;
	code.value = "";
});


var f = function(event){
	console.log(event);
}
mm.players.HTML.subscribe('play',f);
mm.players.HTML.subscribe('pause',f);
mm.players.HTML.subscribe('ended',f);
mm.players.HTML.subscribe('canplay',f);
mm.players.HTML.subscribe('error',f);
mm.players.HTML.subscribe('abort',f);
mm.players.HTML.subscribe('timeupdate',f);
mm.players.HTML.subscribe('volumechange',f);



//{"title":"Preludes Book II: Nos. 1-12","artist":"Claude Debussy","date":"2021-05-12T23:16:56.000+00:00"}
//{"title":"Premiere Rhapsodie","artist":"Claude Debussy","date":"2021-05-18T16:50:50.000+00:00"}
//{"title":"Il bell'Antonio, Tema III","artist":"Giovanni Sollima","date":"2021-05-13T00:01:18.000+00:00"}
//{"title":"Fantasia para un Gentilhombre (Fantasy for a Gentleman)","artist":"Joaquin Rodrigo","date":"2021-05-18T17:33:51.000+00:00"}
//{"title":"Citizen Kane","artist":"Bernard Herrmann","date":"2021-05-18T18:02:17.000+00:00"}
