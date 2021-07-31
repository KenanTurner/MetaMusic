import _Track from '../../../src/track.js';
export default class Track extends _Track{
	constructor(obj){
		super(obj);
		this.filetype = "CUSTOM";
		this.elements = [];
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
	toHTML(){
		let track_div = document.createElement('div');
		track_div.classList.add('track');
		track_div.title = this.title;
			let track_img_div = document.createElement('div');
			track_img_div.classList.add('track-img-container');
				let track_img = document.createElement('img');
				track_img.classList.add('track-img');
				//track_img.src = this.artwork_url || "./images/default-white.png";
				track_img.src = "./images/default-white.png";
				track_img_div.appendChild(track_img);
			track_div.appendChild(track_img_div);
			let track_text_div = document.createElement('div');
			track_text_div.classList.add('track-text-container');
				let track_title = document.createElement('div');
				track_title.classList.add('track-title');
				track_title.innerText = this.title;
				track_text_div.appendChild(track_title);
				let track_subtitle = document.createElement('div');
				track_subtitle.classList.add('track-subtitle');
				track_subtitle.innerText = this.src;
				track_text_div.appendChild(track_subtitle);
			track_div.appendChild(track_text_div);
		track_div.addEventListener('click',function(e){
			this.constructor.onClick(this);
		}.bind(this));
		this.elements.push(track_div);
		return track_div;
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
