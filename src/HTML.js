class HTML{
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
			this.track_num = obj.track_num; //????? track_num
			this.duration = obj.duration;
			this.artist = obj.artist;
			this.artwork_url = obj.artwork_url;
			this.flags = obj.flags;
			this._total_views = obj._total_views;
			this._total_likes = obj._total_likes;
			this._upload_date = obj._upload_date;
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
		this._player.onerror = HTML.error;
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
	stop(){
		this._player.pause();
		this._player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
	}
	static error(){
		alert("Error playing the specified file");
	}
	static getUserId(){ //override later
		return "TODO Override getUserId";
	}
	//TODO _getHTMLAudioDuration
	//TODO upload?
}
