export default class Track{
	constructor(obj){
		if(!obj.src || !obj.title) {
			throw new Error('Invalid Constructor');
		}
		this.filetype = "DEFAULT";
		this.src = obj.src;
		this.title = obj.title;
	}
	toJSON(){ //serialization
		let obj = {};
		obj.filetype = this.filetype;
		obj.src = this.src;
		obj.title = this.title;
		return obj;
	}
	clone(){
		return this.constructor.fromJSON(JSON.stringify(this));
	}
	equals(t){
		return JSON.stringify(this) === JSON.stringify(t);
	}
	compare(track,key="title"){
		if(this[key] < track[key]) return -1;
		if(this[key] > track[key]) return 1;
		if(this[key] === track[key]) return 0; //beware of undefined
		if(this[key] === undefined) return -1;
		if(track[key] === undefined) return 1;
		return 0; //??
	}
	toString(){
		return JSON.stringify(this);
	}
	valueOf(){
		return JSON.stringify({src:this.src,title:this.title}); //TODO?
	}
	static fromJSON(json){ //deserialization
		return new Track(JSON.parse(json));
	}
}
