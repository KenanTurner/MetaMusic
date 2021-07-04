import T from '../../shared/test.js';
export default class TestCases extends T{
	static constructor(MusicManager,players,album){
		MusicManager.players = players;
		let mm = new MusicManager(); //default constructor
		let nn = new MusicManager(mm);
		let oo = mm.clone();
		let pp = MusicManager.fromJSON(JSON.stringify(mm))
		if(!mm.equals(nn)) throw new Error("Bad constructor!");
		if(!mm.equals(oo)) throw new Error("Bad clone method!");
		if(!mm.equals(pp)) throw new Error("Bad fromJson method!");
		return mm.waitForEvent('ready')
		.then(mm.chain('destroy'))
		.then(nn.chain('destroy'))
		.then(oo.chain('destroy'))
		.then(pp.chain('destroy'))
		//TODO add case for non default constructor
	}
	static playPause(MusicManager,players,album){
		MusicManager.players = players;
		let mm = new MusicManager();
		mm.push(album);
		return mm.waitForEvent('ready')
		.then(mm.chain('play')) //play
		.then(mm.chain('pause'))
		.then(mm.chain('pause'))
		.then(mm.chain('play'))
		.then(mm.chain('play'))
		.then(mm.chain('pause'))
		.finally(mm.chain('destroy'));
	}
	static next(MusicManager,players,album){
		MusicManager.players = players;
		let mm = new MusicManager();
		mm.push(album);
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
	}
	//TODO fix shuffle case
	static shuffle(MusicManager,players,album){
		MusicManager.players = players;
		let mm = new MusicManager();
		mm.push(album);
		let copy = mm.clone();
		if(!copy.equals(mm)) throw new Error("Cloning fails to keep track order!");
		mm.shuffle();
		if(!copy.equals(mm)) throw new Error("Shuffling fails?");
		return mm.waitForEvent('ready')
		.then(mm.chain('destroy'))
		.then(copy.chain('destroy'))
	}
	
	static subs(MusicManager,players,album){
		MusicManager.players = players;
		let mm = new MusicManager();
		mm.push(album);
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
		.then(mm.chain('next'))
		.then(mm.chain('next'))
		.then(mm.chain('pause'))
		.then(mm.chain('next'))
		.then(mm.chain('next'))
		.then(mm.chain('load',new players.HTML.Track({title:"Error",src:"http://e"})))
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
	}
}
