ModuleManager.importModules({
	"Custom":['./examples/album-test/js/custom.js'],
	"Album":['./examples/album-test/js/custom-album.js'],
	"HTML":['./src/html.js'],
	"YT":['./src/plugins/YT/youtube.js'],
	"BC":['./src/plugins/BC/bandcamp.js'],
	"SC":['./src/plugins/SC/soundcloud.js'],
	"MM":['./src/music-manager.js'],
	//"Album":['./src/album.js'],
}).then(function(obj){
	let HTML = obj.HTML.default;
	let Custom = obj.Custom.default;
	Object.setPrototypeOf(HTML.Track,Custom); //This is poggers
	Object.setPrototypeOf(HTML.Track.prototype,Custom.prototype); //Like super poggers
	//Now it goes HTML.Track > Custom > Track
	let YT = obj.YT.default;
	let BC = obj.BC.default;
	let SC = obj.SC.default;
	let MusicManager = obj.MM.default;
	window.Album = obj.Album.default;
	console.log("Loaded");

	MusicManager.players = {"HTML":HTML,"YT":YT,"SC":SC,"BC":BC};
	window.mm = new MusicManager();
	mm.subscribe('error',function(err){
		console.log(err);
		alert("There was an error playing the requested file");
	});
	mm.subscribe('all',function(e){console.log(e)});
	Custom.MusicManager = mm;

	let queue = document.getElementById("queue");
	mm.tracks.forEach(function(t){
		queue.appendChild(t.toHTML());
	});

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
	mm.subscribe('loaded',function(e){
		mm.tracks.forEach(function(t){
			t.elements.forEach(function(e){
				e.classList.remove('playing');
			});
		});
		let track = e.target._track;
		track.elements.forEach(function(e){
			e.classList.add('playing');
		});
	});

	let album_container = document.getElementById('album-container');
	let track_container = document.getElementById('track-container');
	let files = [
		'./data/html.json',
		'./data/youtube.json',
		'./data/bandcamp.json',
		'./data/soundcloud.json',
	]
	let fetchJson = function(filename){
		return fetch(filename).then(function(r){
			return r.json();
		})
	}
	files.forEach(function(item){
		fetchJson(item).then(function(data){
			let a = new Album(data)
			a.tracks.forEach(function(t){
				track_container.appendChild(t.toHTML());
			});

			album_container.appendChild(a.toHTML());
		});
	});
})
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
function swap(node1, node2) {
    const afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;
    node1.replaceWith(node2);
    parent.insertBefore(node1, afterNode2);
}
let dragObj = {}
function dragStart(e){
	dragObj['target'] = e.target;
	//e.target.parentNode.
}
function dragEnter(e){
	e.preventDefault();
}
function dragOver(e){
	e.preventDefault();
	//console.log(e);
	//if(el.parentNode.firstElementChild == el)
}
function dragLeave(e){
	//console.log("LEAVE")
}
function dragDrop(e){
	//console.log("DROP")
	//dragObj['target'].style.opacity = 1;
	insertAfter(dragObj['target'],e.target);
	e.preventDefault();
}
