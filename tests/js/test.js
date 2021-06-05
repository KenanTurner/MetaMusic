class TestCases{
	constructor(){
		this.test_obj = new TestObj();
	}
	testPlayers(show_console_output = false,...test_players){
		this.test_obj.reset();
		console.log("Running Tests...");
		let c = console.log;
		if(!show_console_output) console.log = function(){};
		let self = this;
		return this._testPlayer(test_players,c)
		.then(function(){
			console.log = c;
			console.log("Successful Cases: ",self.test_obj.success_cases);
			console.log("Failed Cases: ",self.test_obj.fail_cases);
			return Promise.resolve(self.test_obj);
		});
	}
	_testPlayer(Players,c){
		if(Players.length == 0) return Promise.resolve();
		let obj = Players.shift();
		let self = this;
		let pass = function(f){
			return function(){
				c("%c      Passed","color: #00FF2D;");
				self.test_obj.success_cases++;
				if(f){
					c("    Testing "+f.name+"...");
					//return f(obj.player,obj.args,obj.track,obj.track_err);
					let p = f(obj.player,obj.args,obj.track,obj.track_err);
					let t = new Promise(function(resolve, reject) {
						setTimeout(function(){reject("Timed out")}, 10000);
					});
					return Promise.race([p, t])
				}
				return Promise.resolve(self);
			}
		}
		let fail = function(f){
			return function(result){
				c("%c      Failed: ","color: #FF0000;",result);
				self.test_obj.fail_cases++;
				if(f){
					c("    Testing "+f.name+"...");
					//return f(obj.player,obj.args,obj.track,obj.track_err);
					let p = f(obj.player,obj.args,obj.track,obj.track_err);
					let t = new Promise(function(resolve, reject) {
						setTimeout(function(){reject("Timed out")}, 10000);
					});
					return Promise.race([p, t])
				}
				return Promise.resolve(self);
			}
		}
		c("Testing "+obj.player.name+":");
		c("    Testing _tracks...");
		return this._tracks(obj.player,obj.args,obj.track,obj.track_err)
		.then(pass(self._playPause),fail(self._playPause))
		.then(pass(self._seek),fail(self._seek))
		.then(pass(self._events),fail(self._events))
		.then(pass(self._subs),fail(self._subs))
		.then(pass(),fail())
		.finally(function(){
			return this._testPlayer(Players,c);
		}.bind(this))
	}
	_tracks(Player,args,obj,obj_err){
		var t1 = new Player.Track(obj);
		var t2 = new Player.Track(obj_err);
		var t3 = t1.clone();
		t1.toJSON();
		t1.toString();
		t2.toJSON();
		t2.toString();
		if(!t1.equals(t3))throw new Error("Bad comparison");
		t1 = t1.clone();
		t3 = Player.Track.fromJSON(JSON.stringify(t3));
		if(!t3.equals(t1))throw new Error("Bad comparison");
		if(t1.equals(t2))throw new Error("Bad comparison");
		t3 = Player.Track.fromJSON(t1.toString());
		var t4 = Player.Track.fromJSON(t2.toString());
		if(!t4.equals(t2))throw new Error("Bad comparison");
		t1 += "E";
		return Promise.resolve("Finished");
	}
	_playPause(Player,args,obj,obj_err){
		var html = new Player(...args);
		var t1 = new Player.Track(obj);
		return html.waitForEvent('ready')
		.then(html.chain('load',t1)) //loaded
		.then(html.chain('play')) //play
		.then(html.chain('pause'))
		.then(html.chain('pause'))
		.then(html.chain('play'))
		.then(html.chain('play'))
		.then(html.chain('pause'))
		.finally(html.chain('destroy'));
	}
	_subs(Player,args,obj,obj_err){
		var html = new Player(...args);
		var t1 = new Player.Track(obj);
		var t2 = new Player.Track(obj_err);
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
		html.subscribe('loaded',f);
		html.subscribe('play',f);
		html.subscribe('pause',f);
		html.subscribe('ended',f);
		html.subscribe('error',f);
		html.subscribe('timeupdate',f);
		html.subscribe('volumechange',f);
		
		return html.waitForEvent('ready')
		.then(html.chain('load',t1)) //loaded
		.then(html.chain('play')) //play
		.then(html.chain('pause')) //pause
		.then(html.chain('setVolume',0)) //volumechange
		.then(html.chain('seek',10)) //timeupdate
		.then(html.chain('seek',9999)) //ended
		.then(function(){
			return new Promise(function(resolve,reject){
				setTimeout(resolve,100); //wait so ended is called
			});
		})
		.then(html.chain('load',t2)) //error
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
		.finally(html.chain('destroy'));
	}
	_events(Player,args,obj,obj_err){
		var html = new Player(...args);
		var t1 = new Player.Track(obj);
		var t2 = new Player.Track(obj_err);
		return html.waitForEvent('ready')
		.then(html.chain('load',t1))
		.then(html.chain('play'))
		.then(html.chain('seek',10))
		.then(html.chain('pause'))
		.then(html.chain('pause'))
		.then(html.chain('fastForward',10))
		.then(html.chain('play'))
		.then(html.chain('setVolume',0))
		.then(html.chain('stop'))
		.then(html.chain('play'))
		.then(function(){
			return new Promise(function(resolve,reject){
				setTimeout(resolve,1000);
			});
		})
		.then(html.chain('load',t2))
		.then(function(){
			throw new Error("This Error should not be thrown");
		})
		.catch(function(evt){
			if(evt.message) throw evt;
			return Promise.resolve("Finished")
		})
		.finally(html.chain('destroy'));
	}
	_seek(Player,args,obj,obj_err){
		var html = new Player(...args);
		var t1 = new Player.Track(obj);
		var g = function(evt){console.log(evt)}
		var f = function(time){
			return function(obj){
				let diff = Math.abs(obj.time - time);
				if(diff > 0.1) return Promise.reject(obj);
				return Promise.resolve(obj);
			}
		}
		html.subscribe('all',g);
		return html.waitForEvent('ready')
		.then(html.chain('load',t1))
		.then(html.chain('fastForward',10))
		.then(html.chain('getStatus'))
		.then(f(10))
		.then(html.chain('fastForward',13))
		.then(html.chain('getStatus'))
		.then(f(23))
		.then(html.chain('seek',3.1415))
		.then(html.chain('getStatus'))
		.then(f(3.1415))
		.then(html.chain('seek',15))
		.then(html.chain('getStatus'))
		.then(f(15))
		.then(html.chain('seek',0))
		.then(html.chain('setVolume',0))
		.then(html.chain('play'))
		.then(html.chain('fastForward',10))
		.then(html.chain('getStatus'))
		.then(f(10))
		.then(html.chain('fastForward',13.3))
		.then(html.chain('getStatus'))
		.then(f(23.3))
		.then(html.chain('seek',3.1415))
		.then(html.chain('getStatus'))
		.then(f(3.1415))
		.then(html.chain('seek',15))
		.then(html.chain('getStatus'))
		.then(f(15))
		.then(function(obj){ //play for 1 second
			return html.seek(obj.duration - 1);
		})
		.then(function(){
			return html.waitForEvent('ended');
		})
		.finally(html.chain('destroy'));
	}
}

class TestObj{
	constructor(){
		this.success_cases = 0;
		this.fail_cases = 0;
	}
	test(func){
		try{
			func();
			this.success_cases++;
		}catch(e){
			this.fail_cases++;
			return e;
		}
	}
	testPromise(func){
		let self = this;
		return new Promise(function(res,rej){
			try{
				func().then(function(){
					self.success_cases++;
					res();
				}).catch(function(error){
					self.fail_cases++;
					rej(error);
				});
			}catch(error){
				self.fail_cases++;
				rej(error);
			}
		});
	}
	reset(){
		this.success_cases = 0;
		this.fail_cases = 0;
	}
}

export {TestObj, TestCases}
