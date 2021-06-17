ModuleManager.importModules({
	"HTML":['./src/html.js'],
	"YT":['./src/plugins/YT/youtube.js'],
	"BC":['./src/plugins/BC/bandcamp.js'],
	"SC":['./src/plugins/SC/soundcloud.js'],
	"Album":['./src/album.js'],
	"CustomAlbum":['./src/plugins/custom-album.js'],
	"TestCases":['./tests/albums/js/cases.js'],
}).then(function(obj){
	//put in global scope for easier debugging
	window.TestCases = obj.TestCases.default;
	window.HTML = obj.HTML.default;
	window.YT = obj.YT.default;
	window.BC = obj.BC.default;
	window.SC = obj.SC.default;
	window.Album = obj.Album.default;
	window.CustomAlbum = obj.CustomAlbum.default;
	console.log("Loaded");
	
	let start_btn = document.getElementById("start_btn");
	start_btn.addEventListener("click",function(){ //need to wait for user interaction
		tc.clear();
		for(let c in test_cases){
			if(test_cases[c]) tc.add(c,args);
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
	
	t1.track_num = 1;
	t2.track_num = 2;
	t3.track_num = 3;
	t4.track_num = 4;
	Album.players = {
		"HTML":HTML,
		"YT":YT,
		"BC":BC,
		"SC":SC
	}
	window.a = new Album({title:"album",tracks:[t1,t2,t3,t4]});
	
	function random(min, max) {
		const num = Math.floor(Math.random() * (max - min + 1)) + min;
		return num;
	}
	let rand_track = function(){
		let obj = {};
		obj.title = Math.random().toString(36).substring(2);
		obj.src = "https://"+Math.random().toString(36).substring(2);
		let t = new HTML.Track(obj);
		t.track_num = random(0,1000);
		return t;
	}
	window.rand_track = rand_track;
	window.arr = Array.from({length: 1000}, rand_track);
	let args = [Album,{title:"album",tracks:[t1,t2,t3,t4]}];
	window.tc = new TestCases();
})
let test_cases = {
	"constructor":true,
	"json":true,
	"tracks":true,
	"events":true,
	"getInfo":true,
	"validTrack":true,
	"sort":true,
	"conversion":true,
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
