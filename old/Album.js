class Album{
	constructor(title,track_list,description="",genre="",artwork_url="",upload_src="",flags=[]){
		if(title === undefined || title=="" || track_list === undefined || !Array.isArray(track_list)) {
			throw new Error('Invalid Constructor');
		}
		this.title = title;
		this.track_list = [];
		for (const element of track_list) {
		  this.insertTrack(element);
		}
		this.description = description;
		this.genre = genre;
		this.artwork_url = artwork_url;
		this.flags = flags;
		this.upload_src = upload_src;
		this.sort_by = "track_num";
	}
	toJSON(){
		return [this.title,JSON.parse(JSON.stringify(this.track_list)),this.description,this.genre,this.artwork_url,this.upload_src,this.flags];
	}
	clone(){
		return Album.fromJSON(JSON.stringify(this));
	}
	toString(){
		let self = this.clone();
		self.track_list.forEach(function(entry, index, theArray){
			entry.toJSON = undefined;
		});
		self.toJSON = undefined;
		let str = JSON.stringify(self,null,'\t');
		return str;
	}
	equals(a){
		return JSON.stringify(this) === JSON.stringify(a);
	}
	valueOf(){
		return this.toString;
	}
	static fromJSON(json){
		var obj = JSON.parse(json);
		if(!Array.isArray(obj)){
			obj = Object.values(obj);
		}
		obj[1].forEach(function(entry, index, theArray){
			theArray[index] = Track.fromJSON(JSON.stringify(entry))
		});
		return new Album(...obj);
	}
	insertTrack(track){ //track_num cannot conflict as it enables deterministic sorting.
		if(!(track instanceof Track)){return false;}
		
		let tmp = this.sort_by;
		this.sort();
		
		if(track.track_num < 0){
			this.track_list.push(track.clone());
		}else{
			this.track_list.splice(track.track_num, 0, track.clone());
		}
		for(let i=0; i<this.track_list.length; i++){
			this.track_list[i].track_num = i;
		}
		
		this.sort(tmp);
		return true;
	}
	sort(key="track_num",reversed=false){
		if(!this.track_list.length){return true};
		switch(typeof(this.track_list[0][key])){
			case "number":
				this.track_list.sort(function(a,b){
					let tmp = a[key]-b[key];
					if(tmp!=0){return tmp;}
					if (a["track_num"] < b["track_num"]) {
						return -1;
					}
					if (a["track_num"] > b["track_num"]) {
						return 1;
					}
					return 0;
				});
				break;
			case "string":
				this.track_list.sort(function(a,b){
					var nameA = a[key].toUpperCase(); // ignore upper and lowercase
					var nameB = b[key].toUpperCase(); // ignore upper and lowercase
					if(nameA.length==0 || nameB.length==0){
						if (nameA < nameB) {
							return 1;
						}
						if (nameA > nameB) {
							return -1;
						}
					}
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					// names must be equal
					if (a["track_num"] < b["track_num"]) {
						return -1;
					}
					if (a["track_num"] > b["track_num"]) {
						return 1;
					}
					return 0;
				});
				break;
			case "object": //sort by flags
			default:
				throw new Error("Invalid Sort Key");
		}
		if(reversed){
			this.track_list.reverse();
		}
		this.sort_by = key;
	}
	includes(track){ //problems with track num
		if(track instanceof Track){
			
		}
		return false;
	}
	/*removeTrack(key="track_num",value=this.track_list.length-1){
		if(key instanceof Track){
			value = containsObject(key,this.track_list);
			if(value!=-1){
				this.track_list.splice(value,1);
				return true;
			}
			return false;
		}
		let tmp = this.track_list.find(function(entry){return entry[key] === value});
		if(tmp === undefined){return false;}
		return this.removeTrack(tmp);
	}
	getTotalDuration(){
		let total = 0;
		this.track_list.forEach(function(track){
			if(track['duration'] != -1){
				total += track['duration'];
			}
		});
		return total;
	}
	getArtists(){
		let artist = "";
		this.track_list.forEach(function(track){
			if(track["artist"]){
				if(!artist){
					artist = track["artist"];
				}else if(track["artist"] != artist){
					artist = "Various Artists";
				}
			}
		});
		return artist;
	}
	setArtists(artist){
		this.track_list.forEach(function(track){
			track.artist = artist;
		});
	}
	setArtwork(url){
		this.track_list.forEach(function(track){
			track.artwork_url = url;
		});
	}
	hasTrack(track){
		let index = containsObject(track,this.track_list);
		if(index != -1){
			return true;
		}else{
			return false;
		}
	}
	hasLikedTrack(track){
		var i;
		for (i = 0; i < this.track_list.length; i++) {
			let comparison_track = Track.fromJSON(JSON.stringify(this.track_list[i]));
			if (comparison_track.title === track.title && comparison_track.src === track.src) {
				return i;
			}
		}
		return -1;
	}
	findTrack(track){
		let index = containsObject(track,this.track_list);
		if(index != -1){
			return index;
		}else{
			return false;
		}
	}*/
}
