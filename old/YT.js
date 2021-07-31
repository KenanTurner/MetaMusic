class _YT extends HTML{
	static _id = "YT";
	static Track = class Track extends HTML.Track{
		_parent = _YT;
		constructor(obj){
			super(obj);
			this.filetype = "YT";
		}
		static fromJSON(json){
			return new _YT.Track(JSON.parse(json));
		}
	}
	constructor(){
		super();
		let self = this;
		_YT.loadScript("src/YoutubeApi.js",function() {
			var div = document.createElement("div");
			div.id = "hidden_yt";
			div.style.display = "none";
			document.body.append(div);
			self.createYT();
		});
	}
	createYT(){
		let self = this;
		window.YT.ready(function() {
			self._player = new window.YT.Player("hidden_yt", {
				height: "144",
				width: "100%",
				playerVars: {'controls': 0,'disablekb':1,'fs':0,'modestbranding':1,'playsinline':1},
				videoId: ""
			});
			self._player.addEventListener("onStateChange", function(evt) {
				//onPlayerStateChange(evt);
				console.log("yt_state_change",evt);
			});
			self._player.addEventListener("onError", function(evt) {
				//onPlayerStateFail(evt);
				console.log("yt_error",evt);
			});
			console.log("Youtube is ready");
		});
	}
	load(track){
		this._player.cueVideoById(_YT.getYoutubeId(track.src),0);
		//this._player.cueVideoByUrl(track.src,0);
	}
	pause(){
		this._player.pauseVideo();
	}
	play(){
		this._player.playVideo();
	}
	stop(){
		this._player.stopVideo();
	}
	static getYoutubeId(url){
		try{
			let tmp = new URL(url);
			if(tmp.hostname == "www.youtube.com" || tmp.hostname == "youtu.be"){
				if(tmp.pathname == "/watch"){
					let index = tmp.search.indexOf("?v=");
					return tmp.search.substr(index+3,11);
				}else{
					return tmp.pathname.substr(1,11);
				}
			}
			return "";
		}catch(e){
			return "";
		}
	}
	
}
