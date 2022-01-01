import _Track from '../../../src/track.js';
export default class Track extends _Track{
	constructor(obj){
		super(obj);
		this.elements = [];
	}
	clone(){
		let track = super.clone();
		track.elements = this.elements;
		return track;
	}
	static fromJSON(json){ //deserialization
		let obj = {...super.fromJSON(json),...JSON.parse(json)}; //merge the two objects
		return new Track(obj);
	}
	toHTML(){
		let el = document.createElement('button');
		el.innerText = this.title;
		el.addEventListener('click',this.constructor.onclick.bind(this));
		this.elements.push(el);
		return el;
	}
	updateHTML(){
		this.elements.forEach(function(el){
			el.innerText = this.title;
		}.bind(this));
	}
	css(f='toggle',css_class){
		this.elements.forEach(function(e){
			e.classList[f](css_class);
		});
	}
	static async onclick(){} //To be overloader elsewhere
}
