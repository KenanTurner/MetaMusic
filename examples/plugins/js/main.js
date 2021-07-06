ModuleManager.importModules({
	"HTML":['./src/html.js'],
	"YT":['./src/plugins/YT/youtube.js'],
	"BC":['./src/plugins/BC/bandcamp.js'],
	"SC":['./src/plugins/SC/soundcloud.js'],
	"MM":['./src/music-manager.js'],
}).then(function(obj){
	let HTML = obj.HTML.default;
	let YT = obj.YT.default;
	let BC = obj.BC.default;
	let SC = obj.SC.default;
	let MusicManager = obj.MM.default;
	MusicManager.players = {"HTML":HTML,"YT":YT,"SC":SC,"BC":BC};
	console.log("Loaded");
	
	let load_btn = document.getElementById("load");
	let play_btn = document.getElementById("play");
	let pause_btn = document.getElementById("pause");
	let stop_btn = document.getElementById("stop");
	let src_box = document.getElementById("src");
	let plugin_btn = document.getElementById('plugins');
	let error = function(err){
		console.log(err);
		alert("There was an error playing the requested file");
	}
	
	window.mm = new MusicManager();
	let track = new HTML.Track(plugins['HTML']);
	let load_promise = mm.waitForEvent('loaded');
	
	load_btn.addEventListener('click',function(){
		let src = src_box.value;
		let p = plugin_btn.value;
		let obj = plugins[p];
		obj.src = src;
		track = new MusicManager.players[plugin_btn.value].Track(obj);
		load_promise = mm.waitForEvent('loaded');
		mm.load(track);
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
	plugin_btn.addEventListener('change',function(e){
		if(window.location.href.includes('.github.io/')){
			return alert("Bandcamp will not work from a static site. See the README for more information.");
		}
		let p = this.value;
		track = new MusicManager.players[p].Track(plugins[p]);
		load_promise = mm.waitForEvent('loaded');
		mm.load(track);
		src_box.value = track.src;
	});
	mm.waitForEvent('ready').then(function(){
		plugin_btn.dispatchEvent(new Event('change'));
	});
	mm.subscribe('error',error);
	mm.subscribe('all',function(e){console.log(e)});
})
window.plugins = {
	HTML: {title:"Default (HTML Audio)",src:"https://v.redd.it/6m47mro5xpv51/DASH_audio.mp4"},
	YT: {title:"Youtube",src:"https://www.youtube.com/watch?v=zhG7aorm0RI"},
	BC: {title:"Bandcamp",src:"https://the8bitbigband.bandcamp.com/track/want-you-gone-feat-benny-benack-iii-from-portal-2"},
	SC: {title:"Soundcloud",src:"https://soundcloud.com/aivisura/kk-cruisin-interstate-5-remix"},
}
