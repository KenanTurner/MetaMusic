import Cases from '../../players/js/cases.js';
let cases = Cases.map(function(f){
    let g = async function({MetaMusic,track,err_track}){
        return f({Player:MetaMusic,track,err_track});
    }
    Object.defineProperty(g,"name",{value:f.name});
    return g;
})
export default cases.concat([
	/*function constructor(MetaMusic,players,album){
		MetaMusic.players = players;
		let mm = new MetaMusic(); //default constructor
		let nn = new MetaMusic(mm);
		let oo = mm.clone();
		let pp = MetaMusic.fromJSON(JSON.stringify(mm))
		if(!mm.equals(nn)) throw new Error("Bad constructor!");
		if(!mm.equals(oo)) throw new Error("Bad clone method!");
		if(!mm.equals(pp)) throw new Error("Bad fromJson method!");
		return mm.waitForEvent('ready')
		.then(mm.chain('destroy'))
		.then(nn.chain('destroy'))
		.then(oo.chain('destroy'))
		.then(pp.chain('destroy'))
		//TODO add case for non default constructor
	},
	function playPause(MetaMusic,players,album){
		MetaMusic.players = players;
		let mm = new MetaMusic(album);
		return mm.waitForEvent('ready')
		.then(mm.chain('play')) //play
		.then(mm.chain('pause'))
		.then(mm.chain('pause'))
		.then(mm.chain('play'))
		.then(mm.chain('play'))
		.then(mm.chain('pause'))
		.finally(mm.chain('destroy'));
	},
	//Test cases may need more time to complete
	function next(MetaMusic,players,album){
		MetaMusic.players = players;
		let mm = new MetaMusic(album);
		let wait = function(time){
			return function(){
				return new Promise(function(res,rej){
					setTimeout(res,time);
				});
			}
		}
		return mm.waitForEvent('ready')
		.then(mm.chain('setVolume',0))
		.then(mm.chain('play')) //play t1
		.then(wait(500))
		.then(mm.chain('next')) //t2
		.then(wait(500))
		.then(mm.chain('next')) //t3
		.then(wait(500))
		.then(mm.chain('next')) //t4
		.then(wait(500))
		.then(mm.chain('next')) //t1
		.then(mm.chain('next')) //t2
		.then(mm.chain('next')) //t3
		.then(mm.chain('next')) //t4
		.then(mm.chain('next')) //t1
		.finally(mm.chain('destroy'));
	},
	//TODO update shuffle test
	function shuffle(MetaMusic,players,album){
		MetaMusic.players = players;
		let mm = new MetaMusic(album);
		let copy = new MetaMusic(album);
		return mm.waitForEvent('ready').then(function(){
			return copy.waitForEvent('ready');
		}).then(function(){
			if(mm.length <= 1) throw new Error("shuffle test must be completed with >1 tracks!");
			if(mm.tracks[0].equals(mm.tracks[1])) throw new Error("First two tracks need to be different!");
			if(!copy.equals(mm)) throw new Error("Cloning fails to keep track order!");
			//swap the first two values to simulate shuffling
			[mm.tracks[0], mm.tracks[1]] = [mm.tracks[1], mm.tracks[0]];
			if(copy.equals(mm)) throw new Error("Shuffling fails to produce unique ordering!");
		})
		.then(mm.chain('destroy'))
		.then(copy.chain('destroy'))
	},
	function subs(MetaMusic,players,album){
		MetaMusic.players = players;
		let mm = new MetaMusic(album);
		var check = {
			loaded:false,
			play:false,
			pause:false,
			ended:false,
			error:false,
			timeupdate:false,
			volumechange:false
		}
		var f = function(evt){
			console.log(evt);
			check[evt.type] = true;
		}
		mm.subscribe('loaded',f);
		mm.subscribe('play',f);
		mm.subscribe('pause',f);
		mm.subscribe('ended',f);
		mm.subscribe('error',f);
		mm.subscribe('timeupdate',f);
		mm.subscribe('volumechange',f);
		return mm.waitForEvent('ready')
		.then(mm.chain('setVolume',0))
		.then(mm.chain('play'))
		.then(function(){
			return new Promise(function(res,rej){
				setTimeout(res,1000); //play for 1 sec
			})
		})
		.then(mm.chain('next'))
		.then(mm.chain('next'))
		.then(mm.chain('pause'))
		.then(mm.chain('next'))
		.then(mm.chain('next'))
		.then(mm.chain('load',new (Object.values(mm.constructor.players)[0].Track)({title:"Error",src:"http://e"})))
		.then(function(){
			throw new Error("This Error should not be thrown");
		})
		.catch(function(evt){
			if(evt.message) throw evt;
			return Promise.resolve()
		})
		.then(function(){
			return new Promise(function(res,rej){
				for(let evt in check){
					if(!check[evt]) return rej(check);
				}
				return res("Finished");
			});
		})
		.finally(mm.chain('destroy'));
	},*/
]);
