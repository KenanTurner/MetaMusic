import _Track from '../track.js';
export default class Track extends _Track{
	constructor(obj){
		super(obj);
		this.filetype = "CUSTOM";
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
		this.elements = [];
	}
	toJSON(){ //serialization
		let obj = super.toJSON();
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
		let tmp = this.constructor.fromJSON(JSON.stringify(this));
		this.elements.forEach(function(el){
			tmp.elements.push(el);
		});
		return tmp;
	}
	static fromJSON(json){ //deserialization
		//TODO is this order correct?
		let obj = {...super.fromJSON(json),...JSON.parse(json)}; //merge the two objects
		return new Track(obj);
	}
	static getUserId(){ //override later
		return "TODO Override getUserId";
	}
	toHTML(){
		let el = document.createElement('button');
		el.innerText = this.title;
		el.addEventListener('click',this.constructor.onClick(this));
		this.elements.push(el);
		return el;
	}
	updateHTML(){
		this.elements.forEach(function(el){
			el.innerText = this.title;
		}.bind(this));
	}
	//to be overloaded later
	static onClick(){}
	static onLoad(){}
	static onUnload(){}
}
