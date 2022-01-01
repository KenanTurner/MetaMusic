import Cases from '../../albums/js/cases.js';
let cases = Cases.map(function(f){
    let g = async function({Queue,tracks}){
        return f({Album:Queue,tracks});
    }
    Object.defineProperty(g,"name",{value:f.name});
    return g;
})
export default cases.concat([
	async function unsorted({Queue,tracks}){
		let a1 = new Queue({tracks});
		let arr = Array.from({length: 64}, function(){
			let tmp = a1.clone();
			tmp.shuffle();
			return tmp;
		});
		let result = arr.some(function(queue){
			return !queue.equals(a1); //equals calls toJSON which should leave it unsorted
		});
		if(!result) throw new Error("Failed to keep queue unsorted when comparing!");
	},
	async function next({Queue,tracks}){
		let a1 = new Queue({tracks});
		throwIfNoError("Failed to throw error if current_track is undefined!",a1.next.bind(a1));
		a1.current_track = tracks[0];
		for(let i = 0; i < tracks.length; i++){
			if(!a1.current_track.equals(tracks[i])) throw new Error("Failed to move to the next track!");
			a1.next();
		}
		for(let i = 0; i < tracks.length; i++){
			a1.next(-1);
			if(!a1.current_track.equals(tracks[tracks.length-i-1])) throw new Error("Failed to move to the previous track!");
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