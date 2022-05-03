import Test from '../../shared/test.js';
import Cases from './cases.js';
import {map,casesToOptions,displayOptions,CONCURRENT} from '../../shared/tools.js';

let imports = {Cases,Test};
map(imports,window);
console.log("Imports Loaded");

let args = {};
let test = new Test();

let test_cases = casesToOptions(Cases);
displayOptions(test_cases,"test_cases");

let start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let f of Cases){
		test.enqueue({f,args,skip:!test_cases[f.name],timeout:1000});
	}
	test.run(CONCURRENT);
});
