import HTML from '../HTML/html.js';
export default class BC extends HTML{
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
	constructor(bc_php = "../../src/plugins/BC/loadBC.php"){
		super();
		this._bc_php = bc_php;
	}
	load(track){
		if(!this.constructor._validTrack(track)) throw new Error("Invalid Filetype");
		if(track.bc_url == track.src){
			//this._player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA='; //stop playing silently
			return fetch(this._bc_php, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({href:track.bc_url}),
			})
			.then(function(r){return r.json()})
			.then(function(obj){
				if(Object.values(obj).length == 0) return Promise.reject("Invalid Url");
				track.src = Object.values(obj)[0];
				return this.load(track);
			}.bind(this))
			.catch(function(error){
				return Promise.reject(this._publish('error'));
			}.bind(this));
		}
		return super.load(track);
	}
	static _validURL(url){
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
	}
}
