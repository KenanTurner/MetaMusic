import EventTarget from '../../../src/event-target.js';
import Cases from './cases.js';
import Test from '../../shared/test.js';
import {map,casesToOptions,displayOptions,CONCURRENT,TIMEOUT} from '../../shared/tools.js';

let imports = {EventTarget,Cases,Test};
map(imports,window);
console.log("Imports Loaded");

let args = {EventTarget};

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