import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';

let imports = [HTML,YT,BC,SC,Test];
function map(arr,obj={},f=function(i){return i}){arr.forEach(function(i){if(i.name) this[i.name] = f(i)}.bind(obj));return obj;}
map(imports,window);
window.Cases = Cases;
console.log("Loaded");

let start_btn = document.getElementById("start_btn");
let disable_console = document.getElementById("option-disable-console");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let f of Cases){
		if(test_cases[f.name]) test.add({f:f});
	}
	test.runAll(disable_console.checked);
});

let test = new Test();

//imported from shared/options.js folder
let test_cases = map(Cases,{},function(i){return true});
createOptions(test_cases,"test_cases");
