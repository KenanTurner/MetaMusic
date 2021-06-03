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
	//TODO add Promise.race for timeouts
	_testPlayer(Players,c){
		if(Players.length == 0) return Promise.resolve();
		let obj = Players.shift();
		let self = this;
		let pass = function(f){
			return function(){
				c("\tPassed");
				self.test_obj.success_cases++;
				if(f){
					c("Testing "+f.name);
					//return f(obj.player,obj.args,obj.track,obj.track_err);
					let p = f(obj.player,obj.args,obj.track,obj.track_err);
					let t = new Promise(function(resolve, reject) {
						setTimeout(function(){reject("Timed out")}, 15000);
					});
					return Promise.race([p, t])
				}
				return Promise.resolve(self);
			}
		}
		let fail = function(f){
			return function(result){
				c("\tFailed",result);
				self.test_obj.fail_cases++;
				if(f){
					c("Testing "+f.name);
					//return f(obj.player,obj.args,obj.track,obj.track_err);
					let p = f(obj.player,obj.args,obj.track,obj.track_err);
					let t = new Promise(function(resolve, reject) {
						setTimeout(function(){reject("Timed out")}, 15000);
					});
					return Promise.race([p, t])
				}
				return Promise.resolve(self);
			}
		}
		c("Testing "+obj.player.name+":");
		c("Testing test_tracks");
		return this.test_tracks(obj.player,obj.args,obj.track,obj.track_err)
		.then(pass(self.test_basic),fail(self.test_basic))
		.then(pass(self.test_events),fail(self.test_events))
		.then(pass(self.test_subs),fail(self.test_subs))
		.then(pass(),fail())
		.finally(function(){
			return self._testPlayer(Players,c);
		});
	}
	runAll(show_console_output = false){
		this.test_obj.reset();
		let cases = Object.getOwnPropertyNames(TestCases).filter(function (p) {
			return typeof TestCases[p] === 'function';
		});
		let self = this;
		console.log("Running Tests...");
		let c = console.log;
		if(!show_console_output) console.log = function(){};
		return this._runAll(cases,c).then(function(){
			console.log = c;
			console.log("Successful Cases: ",self.test_obj.success_cases);
			console.log("Failed Cases: ",self.test_obj.fail_cases);
			return Promise.resolve(self.test_obj);
		});
	}
	run(f){
		this.test_obj.reset();
		let self = this;
		return this._runAll([f.name]).then(function(){
			console.log("Successful Cases: ",self.test_obj.success_cases);
			console.log("Failed Cases: ",self.test_obj.fail_cases);
			return Promise.resolve(self.test_obj);
		});
	}
	_runAll(cases,c){ //recursively iterate over all tests
		if(cases.length == 0) return Promise.resolve();
		let f = TestCases[cases.shift()];
		let self = this;
		c("Testing "+f.name);
		return this.test_obj.testPromise(f).then(function(result){
			c("Passed");
			return self._runAll(cases,c);
		}).catch(function(result){
			c("Failed: ",result);
			return self._runAll(cases,c);
		});
	}
	test_tracks(Player,args,obj,obj_err){
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
	test_basic(Player,args,obj,obj_err){
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
	test_subs(Player,args,obj,obj_err){
		var html = new Player(...args);
		var t1 = new Player.Track(obj);
		var t2 = new Player.Track(obj_err);
		var num_events = 0;
		var f = function(evt){
			console.log(evt);
			num_events++;
		}
		html.subscribe('loaded',{callback:f});
		html.subscribe('play',{callback:f});
		html.subscribe('pause',{callback:f});
		html.subscribe('ended',{callback:f});
		html.subscribe('error',{callback:f});
		html.subscribe('timeupdate',{callback:f});
		html.subscribe('volumechange',{callback:f});
		
		return html.waitForEvent('ready')
		.then(html.chain('load',t1)) //loaded
		.then(html.chain('play')) //play
		.then(html.chain('pause')) //pause
		.then(html.chain('setVolume',0)) //volumechange
		.then(html.chain('seek',10)) //timeupdate
		.then(html.chain('seek',999)) //ended
		.then(html.chain('load',t2)) //error
		.then(function(){
			throw new Error("This Error should not be thrown");
		})
		.catch(function(evt){
			if(evt.message) throw evt;
			return Promise.resolve("Finished")
		})
		.then(function(){
			return new Promise(function(res,rej){
				console.log(num_events);
				if(num_events>=7) return res("Finished");
				return rej("Not enough events");
			});
		})
		.finally(html.chain('destroy'));
	}
	test_events(Player,args,obj,obj_err){
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
