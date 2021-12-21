export default class Console{
	constructor(){
		if(window.top.console._console) return window.top.console;
		let options = {debug:false,log:true,warn:true,error:true};
		this._options = new Proxy(options,{
			set(target,prop,value){
				if(value === true) window.top.console.show(prop);
				if(value === false) window.top.console.hide(prop);
				return Reflect.set(...arguments);
			}
		});
		this._console = {};
		for(let f in window.top.console){
			this._console[f] = window.top.console[f];
			Reflect.set(this,f,window.top.console[f]);
		}
		this._div = document.createElement("div");
		this._div.classList.add("console");
		this._div.id = "console";
		this._output = this.output();
		this._div.appendChild(this._output);
		this._controls = this.controls();
		this._div.appendChild(this._controls);
		return new Proxy(this,this);
	}
	get(target,prop,receiver){
		if(prop === 'clear'){
			return function(...data){
				while(this._output.firstChild){
					this._output.removeChild(this._output.lastChild);
				}
				this._console[prop](...data);
			}
		}
		if(this._console[prop]){
			return function(...data){
				let div = this.toHTML(...data);
				div.classList.add(prop);
				if(this._options[prop] === false) div.classList.add('hidden');
				this._output.appendChild(div);
				this._console[prop](...data);
				this._controls.scrollIntoView();
			}.bind(this);
		}
		return Reflect.get(...arguments);
	}
	toHTML(...data){
		let divs = data.map(function(item){
			let pre = document.createElement('pre');
			pre.innerText = this.toText(item);
			return pre;
		}.bind(this));
		if(data.length > 0 && typeof data[0] === 'string' && /%c/.test(data[0])){
			let arr = data[0].split(/%c/);
			divs[0].innerText = arr[0];
			for(let i = 1; i < arr.length; i++){
				if(!data[i]) continue;
				divs[i].style = data[i];
				divs[i].innerText = arr[i];
			}
		}
		let div = document.createElement('div');
		divs.forEach(function(pre){
			div.appendChild(pre);
		});
		return div;
	}
	toText(item){
		switch(typeof item){
			case "string":
				if(item === '') return '\n';
				return item;
			case "function":
				return item.toString();
			case "object":
				if(Error.prototype.isPrototypeOf(item)){
					return item.stack;
				}else if(item){
					return item.constructor.name + " " + JSON.stringify(item,null,'\t');
				}
			default:
				return JSON.stringify(item,null,'\t');
		}
		return "ERROR CONVERTING ITEM";
	}
	controls(){
		let controls = document.createElement("div");
		controls.classList.add("controls");
		controls.id = "console-controls";
		let btn = document.createElement("button");
		btn.innerText = ">";
		btn.classList.add("eval");
		btn.addEventListener("click",function(){
			if(input.value === "") return;
			window.top.console.log(input.value);
			this.eval(input.value);
			input.style.height = "15px";
			input.value = "";
		}.bind(this));
		let input = document.createElement("textarea");
		input.style.height = "15px";
		input.rows = "1";
		input.autocomplete = "off";
		input.autocorrect = "off";
		input.autocapitalize = "off";
		input.spellcheck = false;
		input.wrap = "soft";
		input.classList.add("input");
		input.addEventListener("keydown",function(e){
			if(e.key === 'Enter' || e.keyCode === 13){
				if(e.shiftKey){
					input.style.height = Number(input.style.height.slice(0,-2))+15+"px";
				}else{
					event.preventDefault();
					btn.click();
				}
			}
		}.bind(this));
		controls.appendChild(btn);
		controls.appendChild(input);
		return controls;
	}
	output(){
		let output = document.createElement("div");
		output.classList.add("output");
		output.id = "console-output";
		return output;
	}
	eval(str){
		try{
			let t = window.top.eval(str); //super terrible but I don't care
			window.top.console.log(t);
		}catch(e){
			window.top.console.error(e);
		}
	}
	show(level){
		for(let div of Array.from(this._output.children)){
			if(!div.classList.contains(level)) continue;
			div.classList.remove('hidden');
		}
	}
	hide(level){
		for(let div of Array.from(this._output.children)){
			if(!div.classList.contains(level)) continue;
			div.classList.add('hidden');
		}
	}
}