chainImports('../../src/html.js','../../src/_ios_html.js',"HTML")()
.then(chainImports('../../src/plugins/YT.js','../../src/plugins/_ios_YT.js',"YT"))
.then(chainImports('../../src/plugins/BC.js','../../src/plugins/BC.js',"BC"))
.then(chainImports('../../src/plugins/SC.js','../../src/plugins/SC.js',"SC"))
.then(chainImports('./test.js','./_ios_test.js',null,{TestCases:"TC",TestObj:"TO"}))
.finally(function(){
	console.log("Loaded");
	let players = [HTML,YT,BC,SC];
	createOptions(...players);
	/*console.log(HTML);
	console.log(YT);
	console.log(TC);
	console.log(TO);
	*/
	HTML.getUserId = function(){return "Overridden in main.js"}
	let test_html = {
		player:HTML,
		args:[],
		track:{src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"},
		track_err:{src:"https://throw-error",title:"Throw Error"}
	}
	let test_yt = {
		player:YT,
		args:[],
		track:{src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"},
		track_err:{src:"https://throw-error",title:"Throw Error"},
	}
	let test_bc = {
		player:BC,
		args:[],
		track:{src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Abzu"},
		track_err:{src:"https://throw-error",title:"Throw Error"}
	}
	let test_sc = {
		player:SC,
		args:[],
		track:{src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"},
		track_err:{src:"https://throw-error",title:"Throw Error"}
	}
	let tests = [test_html,test_yt,test_bc,test_sc];
	let test_cases = new TC();
	
	let start_btn = document.getElementById("start_btn");
	let log_box = document.getElementById("show_log");
	start_btn.addEventListener("click",function(){ //need to wait for user interaction
		let tmp = [];
		tests.forEach(function(t){
			let e = document.getElementById("use_"+t.player.name);
			if(e.checked) tmp.push(t);
		});
		test_cases.testPlayers(log_box.checked,...tmp);
	});

	window.t1 = new HTML.Track({src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4",title:"Scott's Factory"});
	window.t2 = new YT.Track({src:"https://www.youtube.com/watch?v=zhG7aorm0RI",title:"Maynard & Waynard"});
	window.t3 = new BC.Track({src:"https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven",title:"Then were created the gods in the midst of Heaven"});
	window.t4 = new SC.Track({src:"https://soundcloud.com/i-winxd/kirby-speedrun",title:"Trance Music for Kirby Speedrunning Game"});
	window.f = function(evt){
		console.log("Hmm",evt.type);
	}
	window.g = function(evt){
		console.log(evt);
	}
	window.current_player = null;
})

function createOptions(...players){
	let options = document.getElementById('options');
	players.forEach(function(player){
		//console.log(player);
		let input = document.createElement("INPUT");
		let label = document.createElement("LABEL");
		input.type = "checkbox";
		input.id = "use_"+player.name;
		input.name = "use_"+player.name;
		input.checked = true;
		label.for = "use_"+player.name;
		label.innerText = player.name+": ";
		options.appendChild(label);
		options.appendChild(input);
	});
}

function getFiletype(url){
	try{
		let tmp = new URL(url);
		if(tmp.hostname == "www.youtube.com" || tmp.hostname == "youtu.be"){
			return "YT";
		}
		if(tmp.hostname.includes("bandcamp.com")){
			return "BC";
		}
		if(tmp.hostname == "soundcloud.com"){
			return "SC";
		}
		return "HTML";
	}catch(e){
		return undefined;
	}
}

function chainImports(file,error,name,extras){
	return function(){
		return import(file)
		.then(function(module){
			window[name] = module["default"];
			for(let item in extras){
				window[extras[item]] = module[item];
			}
		}).catch(function(err){
			console.log("Error loading default file.");
			return import(error).then(function(module){
				window[name] = module["default"];
				for(let item in extras){
					window[extras[item]] = module[item];
				}
			}).catch(function(err){
				console.log("Failed to load any files.");
				window[name] = undefined;
			});
		})
	}
}

//{"title":"Preludes Book II: Nos. 1-12","artist":"Claude Debussy","date":"2021-05-12T23:16:56.000+00:00"}
//{"title":"Premiere Rhapsodie","artist":"Claude Debussy","date":"2021-05-18T16:50:50.000+00:00"}
//{"title":"Il bell'Antonio, Tema III","artist":"Giovanni Sollima","date":"2021-05-13T00:01:18.000+00:00"}
//{"title":"Fantasia para un Gentilhombre (Fantasy for a Gentleman)","artist":"Joaquin Rodrigo","date":"2021-05-18T17:33:51.000+00:00"}
//{"title":"Citizen Kane","artist":"Bernard Herrmann","date":"2021-05-18T18:02:17.000+00:00"}
