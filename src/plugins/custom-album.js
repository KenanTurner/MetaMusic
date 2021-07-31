import A from '../album.js';
export default class Album extends A{
	constructor(obj){
		super(obj);
		this.genre = obj.genre;
		this.description = obj.description;
		this.artwork_url = obj.artwork_url;
		this.album_url = obj.album_url;
		this.flags = obj.flags;
		this._upload_date = obj._upload_date;
		if(!obj._upload_date) this._upload_date = (new Date()).toJSON();
		this._user_id = obj._user_id;
		if(!obj._user_id) this._user_id = Album.getUserId();
	}
	toJSON(){ //serialization
		let obj = super.toJSON();
		obj.genre = this.genre;
		obj.description = this.description;
		obj.artwork_url = this.artwork_url;
		obj.album_url = this.album_url;
		obj.flags = this.flags;
		obj._upload_date = this._upload_date;
		obj._user_id = this._user_id;
		return obj;
	}
	static fromJSON(json){ //deserialization
		let obj = {...JSON.parse(json),...super.fromJSON(json)}; //merge the two objects
		return new Album(obj);
	}
	static getUserId(){ //override later
		return "TODO Override getUserId";
	}
}
