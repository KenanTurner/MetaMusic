import A from '../../../src/album.js';
export default class Album extends A{
	constructor(obj){
		super(obj);
		this.artwork_url = obj.artwork_url;
	}
	toJSON(){ //serialization
		let obj = super.toJSON();
		obj.artwork_url = this.artwork_url;
		return obj;
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
		album_div.addEventListener('click',function(e){
			this.constructor.onClick(this);
		}.bind(this));
		return album_div;
	}
	updateHTML(){
		return false;
	}
	//to be overloaded later
	static onClick(){}
	static onLoad(){}
	static onUnload(){}
}
