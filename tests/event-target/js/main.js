import EventTarget from '../../../src/event-target.js';
import Cases from './cases.js';
import Test from '../../shared/test.js';

let imports = {EventTarget,Cases,Test};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);
console.log("Imports Loaded");

let args = {EventTarget};

let test = new Test();

let start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let f of Cases){
		test.enqueue({f,args,skip:!test_cases[f.name]});
	}
	test.run(64);
});

let test_cases = map(Cases,{},function(k){return Cases[k].name},function(v){return true});

//imported from shared/options.js folder
createOptions(test_cases,"test_cases");