import Cases from '../../event-target/js/cases.js';
let cases = Cases.map(function(f){
    let g = async function({Album,album_args}){
        return f({EventTarget:Album});
    }
    Object.defineProperty(g,"name",{value:f.name});
    return g;
})
export default cases.concat([
	async function constructor({Album,tracks}){
		let a0 = new Album();
		let a1 = new Album({tracks:[]});
		throwIfNotEqual("Failed to create identical default albums!",a0,a1);
		let a2 = new Album({title:"title"});
		let a3 = new Album({title:"title",tracks:[]});
		throwIfNotEqual("Failed to create identical empty albums!",a2,a3);
		let a4 = new Album({title:"title",tracks});
		let a5 = new Album(a4);
		let a6 = new Album(a4.toJSON());
		let a7 = a4.clone();
		let a8 = Album.fromJSON(JSON.stringify(a4));
		throwIfNotEqual("Failed to create identical albums!",a4,a5,a6,a7,a8);
		if(!tracks.every(function(track,i,arr){
			return track.equals(a4.tracks[i]);
		})) throw new Error("Failed to include supplied tracks");
		if(a4.title !== "title") throw new Error("Failed to include the original title");
	},
	async function push({Album,tracks}){
		let a1 = new Album({tracks});
		let a2 = new Album();
		let a3 = new Album();
		let a4 = new Album();
		a1.tracks.forEach(function(track){
			a2.push(track);
		});
		a3.push(...a1.tracks);
		a4.push(a1);
		throwIfNotEqual("Failed to create identical albums!",a1,a2,a3,a4);
	},
	async function clear({Album,tracks}){
		let a0 = new Album();
		let a1 = new Album({tracks:[]});
		a0.clear();
		a1.clear();
		throwIfNotEqual("Failed to create identical default albums!",a0,a1);
		if(a0.tracks.length !== 0) throw new Error("Failed to clear all tracks");
		let a2 = new Album({title:"title"});
		let a3 = new Album({title:"title",tracks:[]});
		a2.clear();
		a3.clear();
		throwIfNotEqual("Failed to create identical empty albums!",a2,a3);
		if(a2.tracks.length !== 0) throw new Error("Failed to clear all tracks");
		let a4 = new Album({title:"title",tracks});
		let a5 = new Album(a4);
		let a6 = new Album(a4.toJSON());
		let a7 = a4.clone();
		let a8 = Album.fromJSON(JSON.stringify(a4));
		a4.clear();
		a5.clear();
		a6.clear();
		a7.clear();
		a8.clear();
		throwIfNotEqual("Failed to create identical albums!",a4,a5,a6,a7,a8);
		if(a4.tracks.length !== 0) throw new Error("Failed to clear all tracks");
	},
	async function insert({Album,tracks}){
		let a1 = new Album({tracks});
		let a2 = new Album();
		let a3 = new Album();
		let a4 = new Album();
		a1.tracks.forEach(function(track,i){
			a2.insert(i,track);
		});
		a3.insert(0,...a1.tracks);
		a4.insert(0,a1);
		throwIfNotEqual("Failed to create identical albums!",a1,a2,a3,a4);
		for(let i = 0; i < a1.tracks.length; i++){
			a2.insert(i*2,a1.tracks[i]); //aa,bb,cc,dd
			a3.insert(i+a1.tracks.length,a1.tracks[i]); //abcd,abcd
			a4.insert(a1.tracks.length-i,a1.tracks[i]); //a,b,c,d,d,c,b,a
		}
		for(let i = 0; i < a1.tracks.length; i++){
			if(!a2.tracks[i*2].equals(a2.tracks[i*2+1])) throw new Error("Failed to insert at the correct index!");
			if(!a3.tracks[i].equals(a3.tracks[i+a1.tracks.length])) throw new Error("Failed to insert at the correct index!");
			if(!a4.tracks[i].equals(a4.tracks[a4.tracks.length-i-1])) throw new Error("Failed to insert at the correct index!");
		}
	},
	async function remove({Album,tracks}){
		let a0 = new Album();
		let a1 = new Album({tracks});
		a1.remove(a1);
		throwIfNotEqual("Failed to remove self!",a0,a1);
		a1.push(...tracks);
		for(let i = 0; i < tracks.length; i++){
			a1.remove(a1.tracks[0]);
		}
		throwIfNotEqual("Failed to remove singular track",a0,a1);
		a1.push(...tracks);
		a1.remove(...tracks);
		throwIfNotEqual("Failed to remove multiple tracks",a0,a1);
		a1.push(...tracks);
		a0.push(...tracks.slice(0,tracks.length-2));
		a1.remove(...tracks.slice(tracks.length-2));
		throwIfNotEqual("Failed to remove subset of tracks",a0,a1);
	},
	async function shuffle({Album,tracks}){
		let a1 = new Album({tracks});
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
	},
	async function sort({Album,tracks}){
		let a1 = new Album({tracks});
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
		f(a1,"src");
		f(a1,"title",true);
		f(a1,"track_num",true);
		f(a1,"src",true);
	},
	async function clone({Album,tracks}){
		let a1 = new Album({tracks});
		a1.tracks.forEach(function(track){
			if(track.filetype !== "BC") return;
			track.src = "http://lol-no-one-cares";
		});
		//BC tracks overwrite their src when cloned
		let a2 = a1.clone();
		for(let i = 0; i < tracks.length; i++){
			if(tracks[i].src !== a2.tracks[i].src) throw new Error("Failed to clone track correctly!");
		}
	},
	async function filter({Album,tracks}){
		let a1 = new Album({tracks});
		let a2 = a1.clone();
		let f = function(filetype){
			return function(track){
				return track.filetype === filetype;
			}
		}
		let g = function(filetype){
			let filtered = a1.filter(f(filetype));
			if(!tracks.filter(f(filetype)).every(function(t,i,arr){
				return filtered[i].equals(t);
			})) throw new Error("Failed to filter selected tracks!");
		}
		g('HTML');
		g('YT');
		g('BC');
		g('SC');
		throwIfNotEqual("Failed to filter on a cloned album!",a1,a2);
	},
	async function getInfo({Album,tracks}){
		let a1 = new Album({tracks});
		let f = function(key){
			let arr = a1.getInfo(key);
			if(!tracks.map(function(track){
				return track[key];
			}).every(function(t,i,arr){
				return arr[i] === t;
			})) throw new Error("Missing info!");
		}
		f("title");
		f("src");
		f("filetype");
		let info = a1.getInfo("this_key_does_not_exist");
		if(info.length !== 0) throw new Error("Failed to returned an empty array!");
	},
	async function validTrack({Album,tracks}){
		let tmp = {title:"title",src:"src",filetype:"THIS_FILETYPE_DOES_NOT_EXIST"};
		if(Album.isValidTrack(tmp)) throw new Error("Failed to reject invalid track!");
		Object.values(Album.players).forEach(function(player){
			let track = new player.Track({title:"title",src:"src"});
			if(!Album.isValidTrack(track)) throw new Error("Failed to accept valid track!");
		});
	},
	async function events({Album,tracks}){
		let check = {
			add:false, //push,insert
			remove:false, //remove
			clear:false, //clear
			shuffle:false, //shuffle
			sort:false, //sort
		}
		let f = function(evt){
			console.debug(evt);
			check[evt.type] = true;
		}
		let a1 = new Album();
		a1.subscribe({type:'all',callback:f});
		a1.push(...tracks);
		a1.remove(tracks[0]);
		a1.clear();
		a1.insert(0,...tracks);
		a1.shuffle();
		a1.sort("title");
		for(let evt in check){
			if(!check[evt]) throw new Error("Failed to fire event: "+evt);
		}
	},
]);
async function throwsError(f,...args){
	try{
		await f(...args);
		return false;
	}catch(e){
		return true;
	}
}
async function throwIfNoError(message,f,...args){
	if(!await throwsError(f,...args)) throw new Error(message);
}
function throwIfNotEqual(message,...items){
	for(let i = 1; i < items.length; i++){
		if(items[i-1].equals && items[i-1].equals(items[i])) continue;
		if(items[i].equals && items[i].equals(items[i-1])) continue;
		if(items[i-1] === items[i]) continue;
		throw new Error(message);
	}
}