import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import Queue from '../../../src/queue.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';
import {map,casesToOptions,displayOptions,CONCURRENT,TIMEOUT} from '../../shared/tools.js';

//Put in global scope for easy debugging
let imports = {HTML,YT,BC,SC,Queue,Test,Cases};
map(imports,window);
console.log("Imports Loaded");

let args = {};
let t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
let t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
let t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
let t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});
Queue.players = {HTML,YT,BC,SC};
args['Queue'] = Queue;
args['tracks'] = [t1,t2,t3,t4];

let test_cases = casesToOptions(Cases);
displayOptions(test_cases,"test_cases");

let test = new Test();

let start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let f of Cases){
		test.enqueue({f,args,skip:!test_cases[f.name],timeout:TIMEOUT});
	}
	test.run(CONCURRENT);
});
