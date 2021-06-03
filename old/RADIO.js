class RADIO extends HTML{
	static _id = "RADIO";
	static Track = class Track extends HTML.Track{
		_parent = RADIO;
		constructor(obj){
			super(obj);
			this.filetype = "RADIO";
			this.metadata_url = obj.metadata_url;
		}
		toJSON(){
			var obj = super.toJSON();
			obj.metadata_url = this.metadata_url;
			return obj;
		}
		static fromJSON(json){
			return new RADIO.Track(JSON.parse(json));
		}
	}
	//overload as you see fit
	//TODO show dynamic metadata
}
