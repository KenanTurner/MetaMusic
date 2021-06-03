class TMP extends HTML{
	static _id = "TMP";
	static Track = class Track extends HTML.Track{
		_parent = TMP;
		constructor(obj){
			super(obj);
			this.filetype = "TMP";
		}
		toJSON(){
			return super.toJSON();
		}
		static fromJSON(json){
			return new TMP.Track(JSON.parse(json));
		}
	}
	//overload as you see fit
}
