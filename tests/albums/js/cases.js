export default [
	function constructor(Album,obj){
		let a1 = new Album(obj);
		let a2 = new Album(a1);
		let a3 = new Album({title:"title"});
		let a4 = new Album({title:"title",tracks:[]});
		try{
			let a5 = new Album();
			return Promise.reject("Empty constructor is invalid");
		}catch(e){}
		return Promise.resolve();
	},
	function json(Album,obj){
		let a1 = new Album(obj);
		let jason_obj = a1.toJSON();
		let a2 = new Album(jason_obj);
		let json = JSON.stringify(a1);
		let a3 = Album.fromJSON(json);
		let a4 = a1.clone();

		if(!a1.equals(a2)) throw new Error("Bad comparison");
		if(!a1.equals(a3)) throw new Error("Bad comparison");
		if(!a1.equals(a4)) throw new Error("Bad comparison");
		if(!a2.equals(a3)) throw new Error("Bad comparison");
		if(!a2.equals(a4)) throw new Error("Bad comparison");
		if(!a3.equals(a4)) throw new Error("Bad comparison");
		return Promise.resolve();
	},
	function tracks(Album,obj){
		let a1 = new Album({title:"title"})
		obj.tracks.forEach(function(track){
			a1.push(track);
		});
		obj.tracks.forEach(function(track){
			if(!a1.has(track)) throw new Error("Track is missing");
		});
		if(a1.length != obj.tracks.length) throw new Error("Mismatched lengths");
		obj.tracks.forEach(function(track){
			a1.remove(track);
		});
		if(a1.length > 0) throw new Error("Failed to remove track");
		a1 = new Album(obj);
		a1.clear();
		if(a1.length > 0) throw new Error("Failed to clear");
		return Promise.resolve();
	},
	function events(Album,obj){
		let check = {
			add:false,
			sort:false,
			remove:false,
			clear:false,
		}
		let f = function(evt){
			check[evt.type] = true;
		}
		let g = function(evt){console.log(evt)}
		let a1 = new Album({title:"title"})
		a1.subscribe('all',g);
		a1.subscribe('add',f);
		a1.subscribe('sort',f);
		a1.subscribe('remove',f);
		a1.subscribe('clear',f);
		a1.push(...obj.tracks);
		a1.sort("title");
		a1.remove(obj.tracks[0]);
		a1.clear();
		for(let evt in check){
			if(!check[evt]) return Promise.reject(check);
		}
		return Promise.resolve();
	},
	function getInfo(Album,obj){
		let a1 = new Album(obj);
		let info = a1.getInfo("title");
		if(info.length != obj.tracks.length) throw new Error("Missing info");
		info = a1.getInfo("src");
		if(info.length != obj.tracks.length) throw new Error("Missing info");
		info = a1.getInfo("this_key_does_not_exist");
		if(info.length != 0) throw new Error("Returned a non-empty array");
		return Promise.resolve();
	},
	function validTrack(Album,obj){
		console.log(Album.players);
		let tmp = {title:"title",src:"src"};
		let v = Album._validTrack(tmp);
		if(v) throw new Error("Object is not a valid track");
		Object.values(Album.players).forEach(function(player){
			let track = new player.Track(tmp);
			v = Album._validTrack(track);
			if(!v) throw new Error("Track is invalid");
		});
		return Promise.resolve();
	},
	function sort(Album,obj){
		let a1 = new Album(obj);
		let f = function(album,key,reversed=false){
			album.sort(key,reversed);
			let arr = album.tracks;
			for(let i = 0; i < arr.length-1; i++){
				if(reversed){
					if(arr[i][key] < arr[i+1][key]) throw new Error("Invalid sort: "+key);
				}else{
					if(arr[i][key] > arr[i+1][key]) throw new Error("Invalid sort: "+key);
				}
			}
		}
		f(a1,"title");
		f(a1,"track_num");
		f(a1,"duration");
		f(a1,"title",true);
		f(a1,"track_num",true);
		f(a1,"duration",true);
		return Promise.resolve();
	},
	function conversion(ALbum,obj){
		let a1 = new Album(obj);
		//a1.tracks[2] is type BC
		//BC tracks overwrite their src when cloned
		a1.tracks[2].src = "http://lol-no-one-cares";
		let a2 = new Album(a1);
		if(!a1.equals(a2)) throw new Error("Tracks are handled incorrectly");
		return Promise.resolve();
	},
	function addRemove(Album,obj){
		let a1 = new Album(obj);
		let a2 = new Album({title:obj.title});
		a2.push(...obj.tracks);
		//console.log(a1,a2);
		if(!a1.equals(a2)) throw new Error("Push fails to add a track!");
		a2.remove(...obj.tracks);
		if(a2.length !== 0) throw new Error("Removing a track fails!");
		console.log(a1,a2);
		a2.insert(0,...obj.tracks);
		if(!a1.equals(a2)) throw new Error("Insert fails to add a track");
		return Promise.resolve();
	},
	function addRemoveAlbum(Album,obj){
		let a1 = new Album(obj);
		let a2 = new Album(obj);
		a1.insert(0,a1);
		a2.push(a2);
		console.log(a1,a2);
		if(!a1.equals(a2)) throw new Error("Adding an album fails!");
		return Promise.resolve();
	},
	function shuffle(Album,obj){
		let a1 = new Album(obj);
		let arr = Array.from({length: 64}, function(){
			let tmp = a1.clone();
			tmp.shuffle();
			return tmp;
		});
		let result = arr.some(function(album){
			//return !album.equals(a1); //lol you can't use equals because it sorts it first
			return !album.tracks[0].equals(a1.tracks[0]);
		});
		if(!result) throw new Error("Shuffling an album fails to generate unique permutations!");
		return Promise.resolve();
	},
	function trackNum(Album,obj){
		let a1 = new Album(obj);
		let a2 = new Album({...obj,...{_unsorted:true}});

		return Promise.resolve();
	},
]
