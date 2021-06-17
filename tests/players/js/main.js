ModuleManager.importModules({
	"HTML":['./src/html.js'],
	"YT":['./src/plugins/youtube.js'],
	"BC":['./src/plugins/bandcamp.js'],
	"SC":['./src/plugins/soundcloud.js'],
	"TestCases":['./tests/players/js/cases.js'],
}).then(function(obj){
	//put in global scope for easier debugging
	window.HTML = obj.HTML.default;
	window.YT = obj.YT.default;
	window.BC = obj.BC.default;
	window.SC = obj.SC.default;
	window.TestCases = obj.TestCases.default;
	console.log("Loaded");
	
	let start_btn = document.getElementById("start_btn");
	start_btn.addEventListener("click",function(){ //need to wait for user interaction
		tc.clear();
		for(let p in players){
			for(let c in test_cases){
				if(test_cases[c] && players[p]) tc.add(c,args[p],p);
			}
		}
		
		//console.log(tc.test_cases);
		let disable_console = document.getElementById("option-disable-console");
		tc.runAll(disable_console.checked);
	});

	window.t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
	window.t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
	window.t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
	window.t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});
	window.f = function(evt){
		console.log(evt);
	}
	
	let html_args = [HTML,[],{src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"},{src:"https://throw-error",title:"Throw Error"}];
	let yt_args = [YT,[],{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},{src:"https://throw-error",title:"Throw Error"}];
	let bc_args = [BC,[],{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},{src:"https://throw-error",title:"Throw Error"}];
	let sc_args = [SC,[],{src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"},{src:"https://throw-error",title:"Throw Error"}];
	let args = {"HTML":html_args,"YT":yt_args,"BC":bc_args,"SC":sc_args};
	window.tc = new TestCases();
})
let test_cases = {
	"tracks":true,
	"playPause":true,
	"subs":true,
	"events":true,
	"seek":true,
}
let players = {
	"HTML":true,
	"YT":true,
	"BC":true,
	"SC":true,
}
createOptions(players,"players");
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
		input.checked = options[name];
		input.onclick = updateOptions.bind(options);
		label.for = "option-"+name;
		label.innerText = name+": ";
		el.appendChild(label);
		el.appendChild(input);
	});
}
