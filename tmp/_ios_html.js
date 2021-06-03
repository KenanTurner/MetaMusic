export default class HTML{
	constructor(){
		this._player = new Audio();
		this._ready = true;
		this._subscribers = {all:[]};
		//this._player.onerror = HTML.error;
		let self = this;
		//this._player.addEventListener('canplay',function(){self._publish('canplay')});
		this._player.addEventListener('play',function(){self._publish('play')});
		this._player.addEventListener('pause',function(){self._publish('pause')});
		this._player.addEventListener('ended',function(){self._publish('ended')});
		this._player.addEventListener('error',function(){self._publish('error')});
		this._player.addEventListener('abort',function(){self._publish('abort')});
		this._player.addEventListener('timeupdate',function(){self._publish('timeupdate')});
		this._player.addEventListener('volumechange',function(){self._publish('volumechange')});
	}
	destroy(){
		//console.log("DESTROY!!!",this);
		delete this._player;
		delete this._ready;
		delete this._subscribers;
		return Promise.resolve();
	}
	subscribe(type,obj) {
		if(typeof obj.callback != "function") throw new Error("Callback must be a function");
		if (!this._subscribers[type]) {
			this._subscribers[type] = []; //creates the event list
		}
		this._subscribers[type].push(obj);
		if(type == 'ready' && this._ready) this._publish('ready');
	}
	
	unsubscribe(type, obj){
		if(this._subscribers[type]){
			var subs = this._subscribers[type].filter(function(obj){
				return obj !== obj;
			});
			this._subscribers[type] = subs;
		}
	}
	//regular event
	//error event
	//all event?
	//if error altert all waitForEvents
	//has reject
	// once
	// not once
	_publish(type){
		let self = this;
		let data = this.getStatus();
		this._subscribers.all.forEach(function(obj,index,array){
			obj.callback(new HTML.Event(type,data));
			if(obj.once) array.splice(index,1);
		});
		switch(type){
			case "error":
				for (var _type in self._subscribers){
					self._subscribers[_type].forEach(function(obj,index,array){
						if(obj.error){
							obj.error(new HTML.Event(type,data));
							if(obj.once) array.splice(index,1);
						}
					});
				};
			default:
				if (!this._subscribers[type]){return;}
				this._subscribers[type].forEach(function(obj,index,array){
					obj.callback(new HTML.Event(type,data));
					if(obj.once) array.splice(index,1);
				});
				break;
		}
	}
	load(track){
		let self = this;
		let f = function(){
			self._publish('loaded');
		};
		this._player.addEventListener('loadedmetadata',f,{once:true}); //IOS
		this._player.src = track.src;
		return this.waitForEvent('loaded');
	}
	play(){
		return this._player.play();
		//return this.waitForEvent('play');
	}
	pause(){
		return this._player.pause();
		return this.waitForEvent('pause');
	}
	seek(time){
		this._player.currentTime = time;
		if(time >= this.getStatus().duration){
			return this.waitForEvent('ended');
		}
		return this.waitForEvent('timeupdate');
		//TODO check for ended here?
	}
	fastForward(time){
		return this.seek(this._player.currentTime + time);
	}
	setVolume(vol){
		//this._player.volume = vol; //volume cannot be set on IOS
		if(vol<0.5){
			this._player.muted = true;
			return this.waitForEvent('volumechange');
		}
		return Promise.resolve();
		
	}
	stop(){
		this._player.load();
		return this.waitForEvent('abort');
		
		//this._player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
	}
	getStatus(){
		let data = {
			src:this._player.currentSrc,
			time:this._player.currentTime,
			duration:this._player.duration,
			volume:this._player.volume,
			paused:this._player.paused
		}
		return data;
	}
	wait(f,g,callback,step=50){
		if(f() != g) return callback();
		let self = this;
		setTimeout(function(){ self.wait(f,g,callback,step)}, step);
	}
	waitForEvent(event) {
		let self = this;
		return new Promise(function(resolve, reject) {
			self.subscribe(event,{callback:resolve,once:true,error:reject});
		});
	}
	chain(f,...args){ //easy promise chaining
		let self = this;
		return function(evt){
			return self[f](...args);
		}
	}
	_chain(f,e,...args){ //easy promise chaining
		console.log("_chain",e);
		let self = this;
		return function(evt){
			return self[f](...args);
		}.bind(e);
	}
	scope(e){
		if(!e.isTrusted) throw new Error("Event must be user generated!");
		console.log("Scoped: ",e);
		this._scope = e;
	}
}
HTML._id = "HTML";
HTML.error = function(event){
	console.log("Error playing the specified file",event);
}
HTML.getUserId  = function(){ //override later
	return "TODO Override getUserId";
}
//TODO _getHTMLAudioDuration
//TODO upload class?
HTML.loadScript  = function(url, callback){
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
HTML.Event = class Event{
	constructor(type,data){
		this.type = type;
		this.data = data;
	}
}
HTML.load_script  = function(url){ //promise variant
	var head = document.head;
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	return new Promise(function(resolve,reject){
		script.onreadystatechange = resolve;
		script.onload = resolve;
		script.onerror = reject;
		head.appendChild(script);
	});		
}
HTML.Track = class Track{
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
}
HTML.Track.fromJSON = function(json){ //deserialization
	return new HTML.Track(JSON.parse(json));
}
