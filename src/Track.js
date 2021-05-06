class Track{
	constructor(src,title,filetype="HTML",track_num=-1,duration=-1,artist="",artwork_url="",flags=[],
	_total_views=0,_total_likes=0,_upload_date=(new Date()).toJSON(),_user_id="TODO"){ //TODO getCookie
		if(src === undefined || src=="" || title === undefined || title=="") {
			throw new Error('Invalid Constructor');
		}
		this.src = src;
		this.title = title;
		this.filetype = filetype;
		this.track_num = track_num;
		this.duration = duration;
		this.artist = artist;
		this.artwork_url = artwork_url;
		this.flags = flags;
		this._total_views = _total_views;
		this._total_likes = _total_likes;
		this._upload_date = _upload_date;
		this._user_id = _user_id;
	}
	toJSON(){
		//TODO non destructive json
		let src = this.src;
		if(this.oldsrc){src = this.oldsrc;}
		return [src,this.title,this.filetype,this.track_num,this.duration,this.artist,this.artwork_url,this.flags,this._total_views,this._total_likes,this._upload_date,this._user_id];
	}
	clone(){
		return Track.fromJSON(JSON.stringify(this));
	}
	toString(){
		let self = this.clone();
		self.toJSON = undefined;
		let str = JSON.stringify(self,null,'\t');
		return str;
	}
	equals(t){
		return JSON.stringify(this) === JSON.stringify(t);
	}
	valueOf(){
		return this.toString;
	}
	static fromJSON(json){
		var obj = JSON.parse(json);
		if(!Array.isArray(obj)){
			obj = Object.values(obj);
		}
		return new Track(...obj);
	}
}
