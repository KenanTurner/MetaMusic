import EventTarget from '../../../src/event-target.js';
import Cases from './cases.js';
import Test from '../../shared/test.js';

let imports = [EventTarget];
function map(arr,obj={},f=function(i){return i}){arr.forEach(function(i){if(i.name) this[i.name] = f(i)}.bind(obj));return obj;}
map(imports,window);
window.Cases = Cases;
console.log("Loaded");

let args = [{EventTarget}];

let test = new Test();

let start_btn = document.getElementById("start_btn");
let disable_console = document.getElementById("option-disable-console");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let f of Cases){
		if(test_cases[f.name]) test.add({f:f,args:args});
	}
	test.runAll(disable_console.checked);
});

let test_cases = map(Cases,{},function(i){return true});

//imported from shared/options.js folder
createOptions(test_cases,"test_cases");