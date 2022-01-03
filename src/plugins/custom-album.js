import A from '../album.js';
export default class Album extends A{
	constructor(obj){
		super(obj);
		this.genre = obj.genre;
		this.description = obj.description;
		this.artwork_url = obj.artwork_url;
		this.album_url = obj.album_url;
		this.flags = obj.flags;
		this._upload_date = obj._upload_date? obj._upload_date: (new Date()).toJSON();
		this._user_id = obj._user_id? obj._user_id: Album.getUserId(this);
		this.elements = [];
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
	clone(){
		let tmp = this.constructor.fromJSON(JSON.stringify(this));
		tmp.elements = this.elements;
		return tmp;
	}
	static fromJSON(json){ //deserialization
		let obj = {...JSON.parse(json),...super.fromJSON(json)}; //merge the two objects
		return new Album(obj);
	}
	toHTML(){
		let album_div = document.createElement('div');
		album_div.classList.add('album');
		album_div.title = this.title;
			let album_img_div = document.createElement('div');
			album_img_div.classList.add('album-img-container');
				let album_img = document.createElement('img');
				album_img.classList.add('album-img');
				album_img.src = this.artwork_url || "./images/default-white.png";
				album_img_div.appendChild(album_img);
			album_div.appendChild(album_img_div);
			let album_text_div = document.createElement('div');
			album_text_div.classList.add('album-text-container');
				let album_title = document.createElement('div');
				album_title.classList.add('album-title');
				album_title.innerText = this.title;
				album_text_div.appendChild(album_title);
			album_div.appendChild(album_text_div);
		album_div.addEventListener('click',this.constructor.onClick.bind(null,this));
		return album_div;
	}
	css(f='toggle',css_class){
		this.elements.forEach(function(e){
			e.classList[f](css_class);
		});
	}
	//to be overloaded later
	static onClick(album){}
	static getUserId(album){}
}
