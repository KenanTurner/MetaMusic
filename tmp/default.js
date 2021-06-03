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
	toString(){
		return JSON.stringify(this);
	}
	valueOf(){
		return this.src;
	}
	static fromJSON(json){ //deserialization
		return new Track(JSON.parse(json));
	}
}
