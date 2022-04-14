import HTML from '../../../src/plugins/HTML/html.js';
import YT from '../../../src/plugins/YT/youtube.js';
import BC from '../../../src/plugins/BC/bandcamp.js';
import SC from '../../../src/plugins/SC/soundcloud.js';
import Test from '../../shared/test.js';
import Cases from './cases.js';

let imports = {HTML,YT,BC,SC,Cases,Test};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);

let test = new Test();
let args = {};

let start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click",function(){ //need to wait for user interaction
	test.clear();
	for(let f of Cases){
		test.enqueue({f,args,skip:!test_cases[f.name],timeout:1000});
	}
	test.run(64);
});

//imported from shared/options.js folder
let test_cases = map(Cases,{},function(k){return Cases[k].name},function(v){return true});
createOptions(test_cases,"test_cases");
