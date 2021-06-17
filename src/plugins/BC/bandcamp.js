import HTML from '../../html.js';
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
		if(!window.jQuery) throw new Error("Jquery needs to be imported first!");
	}
	load(track){
		if(!this.constructor._validTrack(track)) throw new Error("Invalid Filetype");
		if(track.bc_url == track.src){
			//this._player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA='; //stop playing silently
			//console.log("Loading bc_url...");
			let self = this;
			let p = this.waitForEvent('loaded');
			new Promise(function(resolve,reject){
				$.ajax({
					url: self._bc_php,
					type: 'POST',
					data: {href:track.bc_url},
					success: function(data) {
						var tracks = JSON.parse(data);
						if(Object.values(tracks).length != 1) return reject("Invalid Url");
						track.src = Object.values(tracks)[0];
						self.load(track).then(resolve,reject);
					},
					error: function(xhr,status,error){
						reject(xhr);
					}
				});
			}).catch(function(error){
				let data = self._publish('error');
			});
			return p;
		}
		return super.load(track);
	}
	seek(time){
		let status = this.getStatus();
		if(status.paused && time>=status.duration){
			return super.seek(time)
			.then(function(){
				this._publish('ended');
			}.bind(this));
		}
		return super.seek(time);
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
