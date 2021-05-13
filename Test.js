class TestCases{
	constructor(){
		this.test_obj = new TestObj();
	}
	runAll(verbose = false){
		this.test_obj.reset();
		let cases = Object.getOwnPropertyNames(TestCases).filter(function (p) {
			return typeof TestCases[p] === 'function';
		});
		let self = this;
		let c = console.log;
		//console.log = function(){} //disable logging to console
		cases.forEach(function(func){
			let result = self.test_obj.test(TestCases[func]);
			if(result && verbose){
				c("\tERROR: ",result);
			}
		});
		console.log = c;
		console.log("Total Cases: ",cases.length);
		console.log("Successful Cases: ",this.test_obj.success_cases);
		console.log("Failed Cases: ",this.test_obj.fail_cases);
	}
	static testTracks(){
		var t1 = new HTML.Track({src:"src",title:"title"});
		var t2 = new HTML.Track({src:"src",title:"title",filetype:"HTML",track_num:0,duration:-1,
			artist:"artist",artwork:"artwork",flags:["FAV"],total_views:100,total_likes:10});
		var t3 = t1.clone();
		t1.toJSON();
		t1.toString();
		t2.toJSON();
		t2.toString();
		if(!t1.equals(t3))throw new Error("Bad comparison");
		t1 = t1.clone();
		t3 = HTML.Track.fromJSON(JSON.stringify(t3));
		if(!t3.equals(t1))throw new Error("Bad comparison");
		if(t1.equals(t2))throw new Error("Bad comparison");
		t3 = HTML.Track.fromJSON(t1.toString());
		var t4 = HTML.Track.fromJSON(t2.toString());
		if(!t4.equals(t2))throw new Error("Bad comparison");
		t1 += "E";
	}
	static testAlbums(){
		var t1 = new HTML.Track({src:"src",title:"t1"});
		var t2 = new HTML.Track({src:"src",title:"t2",filetype:"HTML",track_num:0,duration:-1,
			artist:"artist",artwork:"artwork",flags:["FAV"],total_views:100,total_likes:10});
		var t3 = t1.clone();
		t3.title = "t3";
		window.a1 = new Album("title",[t1,t2,t3]); //t2,t1,t3
		window.a2 = new Album("title",[t3,t1,t2]); //t2,t3,t1
		window.a3 = a1.clone(); //t2,t1,t3
		a1.toJSON();
		a1.toString();
		a2.toJSON();
		a2.toString();
		if(a1.equals(a2))throw new Error("Bad comparison");
		if(!a1.equals(a3))throw new Error("Bad comparison");
		a1 = a1.clone();
		a3 = Album.fromJSON(JSON.stringify(a3));
		if(!a3.equals(a1))throw new Error("Bad comparison");
		a2 = Album.fromJSON(a2.toString());
		a1 + a2; //string concatenation
		
		a1.sort("title");
		if(a1.track_list[0].title != "t1")throw new Error("Bad sort");
		a1.sort("title",true);
		if(a1.track_list[0].title != "t3")throw new Error("Bad sort");
		a1.sort("track_num");
		if(a1.track_list[0].title != "t2")throw new Error("Bad sort");
		
		
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
	reset(){
		this.success_cases = 0;
		this.fail_cases = 0;
	}
}

var test_cases = new TestCases();
test_cases.runAll(true);

//TODO cleanup
//var tmp = new bc_Track("bc_url","SRC","Title");
//var tmp = new Album("title",[],"desc","genre","artwork","src",["FAV"])
var dict = {};
dict["HTML"] = new HTML();
dict["BC"] = new BC();
//override getUserId()
HTML.getUserId = function(){
	return "Override";
}

var base = {src:"http://crusader.company/old/music/Unsorted/Santa%20Clara%20Vanguard%202018%20Finals.flac",title:"title",bc_url:"bc_url"};
var tr = new HTML.Track(base);
base.src = "https://austinwintory.bandcamp.com/track/then-were-created-the-gods-in-the-midst-of-heaven";
var bc = new BC.Track(base);
var list = [bc,tr];
var jlist = [JSON.stringify(bc),JSON.stringify(tr)];
