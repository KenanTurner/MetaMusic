export default class HTML{
	static _id = "HTML";
	static Track = class Track{
		_parent = HTML;
		constructor(obj){
			if(!obj.src || !obj.title) {
				throw new Error('Invalid Constructor');
			}
			this.filetype = "HTML";
			this.src = obj.src;
			this.title = obj.title;
			this.track_num = obj.track_num; //????? track_num not required
			this.duration = obj.duration;
			this.artist = obj.artist;
			this.artwork_url = obj.artwork_url;
			this.flags = obj.flags;
			this._total_views = obj._total_views;
			this._total_likes = obj._total_likes;
			this._upload_date = obj._upload_date;
			if(!obj._upload_date) this._upload_date = (new Date()).toJSON();
			this._user_id = obj._user_id;
			if(!obj._user_id) this._user_id = HTML.getUserId();
		}
		toJSON(){ //serialization
			let obj = {};
			obj.filetype = this.filetype;
			obj.src = this.src;
			obj.title = this.title;
			obj.track_num = this.track_num;
			obj.duration = this.duration;
			obj.artist = this.artist;
			obj.artwork_url = this.artwork_url;
			obj.flags = this.flags;
			obj._total_views = this._total_views;
			obj._total_likes = this._total_likes;
			obj._upload_date = this._upload_date;
			obj._user_id = this._user_id;
			return obj;
		}
		clone(){
			return this._parent.Track.fromJSON(JSON.stringify(this));
		}
		equals(t){
			return JSON.stringify(this) === JSON.stringify(t);
		}
		toString(){
			return JSON.stringify(this);
		}
		valueOf(){
			return this.src;
		}
		static fromJSON(json){ //deserialization
			return new HTML.Track(JSON.parse(json));
		}
	}
	constructor(){
		this._player = new Audio();
		this._subscribers = {};
		//this._player.onerror = HTML.error;
		let self = this;
		this._player.addEventListener('play',function(){self._publish('play')});
		this._player.addEventListener('pause',function(){self._publish('pause')});
		this._player.addEventListener('ended',function(){self._publish('ended')});
		this._player.addEventListener('error',function(){self._publish('error')});
		this._player.addEventListener('abort',function(){self._publish('abort')});
		this._player.addEventListener('timeupdate',function(){self._publish('timeupdate')});
		this._player.addEventListener('volumechange',function(){self._publish('volumechange')});
		
		//TODO clean eventlisteners
		/*this._player.addEventListener('loadstart',function(){self._publish('loadstart')});
		this._player.addEventListener('durationchange',function(){self._publish('durationchange')});
		this._player.addEventListener('loadedmetadata',function(){self._publish('loadedmetadata')});
		this._player.addEventListener('loadeddata',function(){self._publish('loadeddata')});
		this._player.addEventListener('progress',function(){self._publish('progress')});*/
		this._player.addEventListener('canplay',function(){self._publish('canplay')});
		
		//TODO automatically handle errors?
		//this._player.addEventListener('error',HTML.error);
		//this._player.addEventListener('abort',HTML.error);
	}
	
	subscribe(event, callback, ...rest) {
		if (!this._subscribers[event]) {
			this._subscribers[event] = []; //creates the event 
		}
		this._subscribers[event].push({callback:callback,rest:rest});
	}
	
	unsubscribe(event, callback){
		if(this._subscribers[event]){
			/*var callbacks = this._subscribers[event].filter(function(obj){
				return obj.callback === callback;
			});*/
			var subs = this._subscribers[event].filter(function(obj){
				return obj.callback !== callback;
			});
			this._subscribers[event] = subs;
		}
	}
	_publish(event){
		if (!this._subscribers[event]){return;}
		let data = this.status;
		this._subscribers[event].forEach(function(obj){
			obj.callback(new HTML.Event(event,data),...obj.rest);
		});
	}
	load(track){
		this._player.src = track.src;
	}
	pause(){
		this._player.pause();
	}
	play(){
		this._player.play();
	}
	seek(time){
		this._player.currentTime = time;
	}
	setVolume(vol){
		this._player.volume = vol;
	}
	stop(){
		this._player.pause();
		this._player.currentTime = 0;
		//this._player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
	}
	get status(){
		let data = {
			src:this._player.currentSrc,
			time:this._player.currentTime,
			duration:this._player.duration,
			volume:this._player.volume,
			paused:this._player.paused
		}
		return data;
	}
	static error(event){
		console.log("Error playing the specified file",event);
	}
	static getUserId(){ //override later
		return "TODO Override getUserId";
	}
	//TODO _getHTMLAudioDuration
	//TODO upload class?
	static loadScript(url, callback){
		// Adding the script tag to the head as suggested before
		var head = document.head;
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		// Then bind the event to the callback function.
		// There are several events for cross browser compatibility.
		script.onreadystatechange = callback;
		script.onload = callback;

		// Fire the loading
		head.appendChild(script);
	}
	static Event = class Event{
		constructor(type,data){
			this.type = type;
			this.data = data;
		}
	}
}
