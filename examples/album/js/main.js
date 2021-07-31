ModuleManager.importModules({
	"Custom":['./examples/album/js/custom.js'],
	"Album":['./examples/album/js/custom-album.js'],
	"HTML":['./src/html.js'],
	"YT":['./src/plugins/YT/youtube.js'],
	"BC":['./src/plugins/BC/bandcamp.js'],
	"SC":['./src/plugins/SC/soundcloud.js'],
	"MM":['./src/meta-music.js'],
}).then(function(obj){
	let HTML = obj.HTML.default;
	let Custom = obj.Custom.default;
	Object.setPrototypeOf(HTML.Track,Custom); //This is poggers
	Object.setPrototypeOf(HTML.Track.prototype,Custom.prototype); //Like super poggers
	//Now it goes HTML.Track > Custom > Track
	let Album = obj.Album.default;
	let YT = obj.YT.default;
	let BC = obj.BC.default;
	let SC = obj.SC.default;
	let MusicManager = obj.MM.default;
	console.log("Loaded");

	MusicManager.players = {"HTML":HTML,"YT":YT,"SC":SC,"BC":BC};
	window.mm = new MusicManager();
	mm.subscribe('error',function(err){
		console.error(err);
		alert("There was an error playing the requested file");
	});
	//mm.subscribe('all',function(e){console.log(e)});
	let previous_btn = document.getElementById("previous");
	let backward_btn = document.getElementById("backward");
	let play_btn = document.getElementById("play");
	let pause_btn = document.getElementById("pause");
	let stop_btn = document.getElementById("stop");
	let forward_btn = document.getElementById("forward");
	let next_btn = document.getElementById("next");

	let load_promise = mm.waitForEvent('ready');

	previous_btn.addEventListener('click',function(){
		load_promise.then(mm.chain('next',-1));
	});
	backward_btn.addEventListener('click',function(){
		load_promise.then(mm.chain('fastForward',-5));
	});
	play_btn.addEventListener('click',function(){
		load_promise.then(mm.chain('play'));
	});
	pause_btn.addEventListener('click',function(){
		load_promise.then(mm.chain('pause'));
	});
	stop_btn.addEventListener('click',function(){
		load_promise.then(mm.chain('stop'));
	});
	forward_btn.addEventListener('click',function(){
		load_promise.then(mm.chain('fastForward',5));
	});
	next_btn.addEventListener('click',function(){
		load_promise.then(mm.chain('next',1));
	});

	let previous_track = undefined;
	mm.subscribe('loaded',function(e){
		if(previous_track) Custom.onUnload(previous_track);
		Custom.onLoad(mm._track);
		previous_track = mm._track;
	});

	let album_container = document.getElementById('album-container');
	let track_container = document.getElementById('track-container');
	Album.onClick = function(a){
		if(a.title == "ABZU" && window.location.href.includes('.github.io/')){
			return alert("Bandcamp will not work from a static site. See the README for more information.");
		}
		while(track_container.firstChild) track_container.removeChild(track_container.lastChild);
		a.tracks.forEach(function(t){
			track_container.appendChild(t.toHTML());
		});
		mm.stop();
		mm.clear();
		mm.push(a);
		mm.load(a.tracks[0]);
	}
	Custom.onClick = function(t){
		if(t.filetype == "BC" && window.location.href.includes('.github.io/')){
			return alert("Bandcamp will not work from a static site. See the README for more information.");
		}
		let paused = mm._status.paused;
		mm.load(t).then(function(e){
			if(!paused) mm.play();
		});
	}
	Custom.onLoad = function(t){
		t.elements.forEach(function(e){
			e.classList.add('playing');
		});
	}
	Custom.onUnload = function(t){
		t.elements.forEach(function(e){
			e.classList.remove('playing');
		});
	}

	//TODO future loading optimizations
	window.files = [
		'./data/html.json',
		'./data/youtube.json',
		'./data/bandcamp.json',
		'./data/soundcloud.json',
	]
	ModuleManager.fetchJSON(files).then(function(arr){
		arr.forEach(function(data){
			let a = new Album(data);
			album_container.appendChild(a.toHTML());
		});
	});
})
