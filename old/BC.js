class BC extends HTML{
	static _id = "BC";
	static Track = class Track extends HTML.Track{
		_parent = BC;
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
	load(track){
		if(track.bc_url == track.src){
			//console.log("Loading bc_url...");
			let self = this;
			$.ajax({
				url: 'loadBC.php',
				type: 'POST',
				data: {href:track.bc_url},
				success: function(data) {
					var tracks = JSON.parse(data);
					track.src = Object.values(tracks)[0];
					self.load(track);
				}
			});
		}else{
			this._player.src = track.src;
		}
	}
}
