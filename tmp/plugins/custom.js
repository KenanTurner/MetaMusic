import _Track from '../default.js';
export default class Track extends _Track{
	constructor(obj){
		super(obj);
		this.filetype = "CUSTOM";
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
		if(!obj._user_id) this._user_id = Track.getUserId();
	}
	toJSON(){ //serialization
		let obj = super.toJSON();
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
	static fromJSON(json){ //deserialization
		return new Track(JSON.parse(json));
	}
	static getUserId(){ //override later
		return "TODO Override getUserId";
	}
}
