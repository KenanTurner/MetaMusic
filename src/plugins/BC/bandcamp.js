import HTML from '../HTML/html.js';
export default class BC extends HTML{
	static proxy_url = "../../src/plugins/BC/bandcamp-proxy.php";
	static Track = class Track extends HTML.Track{
		constructor(obj){
			super(obj);
			this.filetype = "BC";
			this.bc_url = this.src; //copy for later
		}
		toJSON(){
			let obj = super.toJSON();
			obj.src = this.bc_url;
			return obj;
		}
		static fromJSON(json){
			return new BC.Track(JSON.parse(json));
		}
	}
	constructor(is_ready=true){
		super(is_ready);
	}
	async load(track){
		if(!this.constructor.isValidTrack(track)) throw new Error("Invalid Filetype");
		if(track.bc_url !== track.src) return super.load(track);
		let p = this.waitForEvent('loaded');
		try{
			let result = await fetch(this.constructor.proxy_url,{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({href:track.bc_url}),
			});
			let obj = await result.json();
			if(Object.values(obj).length === 0) throw new Error("Invalid BC url");
			track.src = Object.values(obj)[0];
			super.load(track);
		}catch(e){
			this.publish(new this.constructor.Event('error'));
		}
		return p;
	}
	async seek(time){
		let status = await this.getStatus();
		let p = await super.seek(time);
		if(time >= status.duration) this.publish(new this.constructor.Event('ended'));
		return p;
	}
	/*static _validURL(url){
		try{
			let tmp = new URL(url);
			let arr = tmp.hostname.split('.');
			arr.shift();
			arr = arr.join('.');
			if(arr == "bandcamp.com") return true;
			return false;
		}catch(e){
			return false;
		}
	}*/
}
