import _Track from '../../../src/track.js';
export default class Track extends _Track{
	static MusicManager;
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
		let el = document.createElement('button');
		el.innerText = this.title;
		el.addEventListener('click',this.onclick.bind(this));
		this.elements.push(el);
		return el;
	}
	onclick(){
		let mm = this.constructor.MusicManager;
		let paused = mm._status.paused;
		mm.load(this).then(function(){
			if(!paused) mm.play();
		});
	}
	updateHTML(){
		this.elements.forEach(function(el){
			el.innerText = this.title;
		}.bind(this));
	}
}
