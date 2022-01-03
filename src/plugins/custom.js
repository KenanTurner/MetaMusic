import T from '../track.js';
export default class Track extends T{
	constructor(obj){
		super(obj);
		this.duration = obj.duration;
		this.artist = obj.artist;
		this.artwork_url = obj.artwork_url;
		this.flags = obj.flags;
		this._total_views = obj._total_views;
		this._total_likes = obj._total_likes;
		this._upload_date = obj._upload_date? obj._upload_date: (new Date()).toJSON();
		this._user_id = obj._user_id? obj._user_id: Track.getUserId(this);
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
		tmp.elements = this.elements;
		return tmp;
	}
	static fromJSON(json){ //deserialization
		let obj = {...super.fromJSON(json),...JSON.parse(json)}; //merge the two objects
		return new Track(obj);
	}
	toHTML(){
		let el = document.createElement('button');
		el.innerText = this.title;
		el.addEventListener('click',this.constructor.onClick(this));
		this.elements.push(el);
		return el;
	}
	css(f='toggle',css_class){
		this.elements.forEach(function(e){
			e.classList[f](css_class);
		});
	}
	//to be overloaded later
	static onClick(track){}
	static getUserId(track){}
}
