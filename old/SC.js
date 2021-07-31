class _SC extends HTML{
	static _id = "SC";
	static Track = class Track extends HTML.Track{
		_parent = _SC;
		constructor(obj){
			super(obj);
			this.filetype = "SC";
		}
		toJSON(){
			return super.toJSON();
		}
		static fromJSON(json){
			return new _SC.Track(JSON.parse(json));
		}
	}
	constructor(){
		super();
		let self = this;
		_SC.loadScript("src/SoundcloudApi.js",function() {
			var div = document.createElement("iframe");
			div.id = "hidden_sc";
			div.style.display = "none";
			div.style.width = "100%";
			div.style.height = "144";
			div.scrolling = "no";
			//frameborder="no" allow="autoplay"
			div.frameborder = "no";
			div.allow = "autoplay";
			div.src = "https://w.soundcloud.com/player/?url=;";
			document.body.append(div);
			self.createSC();
		});
	}
	//overload as you see fit
	createSC(){
		this._player = SC.Widget("hidden_sc");
		/*uploadSC.bind(SC.Widget.Events.FINISH, function() {
			if(uploadSC._isPlaying){
				uploadSC.pause();
			}
		});
		uploadSC.setVolume(0);*/
		/*this._player.bind(SC.Widget.Events.READY, function() {
			self._SCAudio.getDuration(function(duration){
				self._setDuration(duration/1000);
			});
		});*/
		console.log('Soundcloud is ready');
	}
	load(track){
		this._player.load(track.src+"&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_artwork=false&show_comments=false&show_playcount=false&show_user=false&hide_related=false&visual=false&start_track=0&callback=true");
	}
	pause(){
		this._player.pause();
	}
	play(){
		this._player.play();
	}
	stop(){
		this._player.pause();
		this._player.seekTo(0);
	}
}
