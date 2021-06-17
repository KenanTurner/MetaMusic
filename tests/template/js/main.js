ModuleManager.importModules({
	"TestCases":['./tests/template/js/example-test-cases.js'],
	"HTML":['./src/html.js'],
	"YT":['./src/plugins/youtube.js'],
	"BC":['./src/plugins/bandcamp.js'],
	"SC":['./src/plugins/soundcloud.js'],
}).then(function(obj){
	//put in global scope for easier debugging
	window.TestCases = obj.TestCases.default;
	window.HTML = obj.HTML.default;
	window.YT = obj.YT.default;
	window.BC = obj.BC.default;
	window.SC = obj.SC.default;
	console.log("Loaded");
	
	let start_btn = document.getElementById("start_btn");
	start_btn.addEventListener("click",function(){ //need to wait for user interaction
		tc.clear();
		for(let c in test_cases){
			if(test_cases[c]) tc.add(c,[]);
		}
		let disable_console = document.getElementById("option-disable-console");
		tc.runAll(disable_console.checked);
	});
	
	
	window.tc = new TestCases();
})
let test_cases = {
	"pass":true,
	"fail":true,
	"error":true,
	"bad_return":true,
	"timeout":true,
}
createOptions(test_cases,"test_cases");

function updateOptions(evt){
	let name = evt.target.id.substring(7);
	this[name] = evt.target.checked;
}

function createOptions(options,id){
	let el = document.getElementById(id);
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
	Object.keys(options).forEach(function(name){
		let input = document.createElement("INPUT");
		let label = document.createElement("LABEL");
		input.type = "checkbox";
		input.id = "option-"+name;
		input.name = "option-"+name;
		input.checked = true;
		input.onclick = updateOptions.bind(options);
		label.for = "option-"+name;
		label.innerText = name+": ";
		el.appendChild(label);
		el.appendChild(input);
	});
}
