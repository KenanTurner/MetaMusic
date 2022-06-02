import innerHTML from './html.js';
export default class ConsoleComponent extends HTMLElement{
	static template = document.createElement('template');
	constructor(console){
		super();
		const content = this.constructor.template.content;
		const root = this.attachShadow({mode:'open'});
		root.appendChild(content.cloneNode(true));
		
		this.console = console;
		this.output = this.shadowRoot.querySelector("#output");
		this.input = this.shadowRoot.querySelector("#input");
		this.eval = this.shadowRoot.querySelector("#eval");
		this.command = this.shadowRoot.querySelector("#command");
		this.eval.addEventListener("click",function(){
			if(this.command.value === "") return;
			this.exec(this.command.value);
			this.command.value = "";
		}.bind(this));
		this.command.addEventListener("keydown",function(e){
			if(e.key === 'Enter' || e.keyCode === 13){
				this.eval.click();
			}
		}.bind(this));
		
		this.console.options.observer.subscribe("all",{callback:this.onOption.bind(this)});
		this.console.observer.subscribe("log",{callback:this.onEvent.bind(this)});
		this.console.observer.subscribe("warn",{callback:this.onEvent.bind(this)});
		this.console.observer.subscribe("error",{callback:this.onEvent.bind(this)});
		this.console.observer.subscribe("debug",{callback:this.onEvent.bind(this)});
	}
	display(str,style){
		let node = ConsoleComponent.toHTML(str);
		node.style = style;
		this.output.appendChild(node);
	}
	exec(str){
		this.display(str);
		try{
			let t = window.top.eval(str); //may God have mercy on my soul
			this.display(t);
		}catch(e){
			this.display(e,"background: hsl(0deg 100% 7.5%);color: hsl(0deg 100% 75%);");
		}
		if(str.includes("let ") || str.includes("const ")) this.display("WARNING: Scoped variables are not persistent! Use 'var' instead!","background: hsl(51deg 100% 9.1%);color: hsl(40.5deg 100% 60%)");
	}
	onEvent({type,state,args}){
		let node = this.constructor.toHTML(...args);
		node.classList.add(type);
		if(!state.options[type]) node.classList.add("hidden");
		this.output.appendChild(node);
	}
	onOption({type,state}){
		this.shadowRoot.querySelectorAll("."+type).forEach(function(node){
			state[type]? node.classList.remove("hidden"): node.classList.add("hidden");
		});
	}
	static toText(item){
		switch(typeof item){
			case "string":
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
		return `ERROR: unable to convert ${item} to text!`;
	}
	static toHTML(...args){
		return args.reduce(function(arr,item,index){
			if(index === 0 && typeof item === 'string' && /%c/.test(item)){
				return item.split(/%c/).map(function(text,i){
					let pre = document.createElement('pre');
					pre.innerText = ConsoleComponent.toText(text);
					pre.style = args[i];
					if(i > 0) args.splice(1,1); //remove style tag from args
					return pre;
				});
			}
			let pre = document.createElement('pre');
			pre.innerText = ConsoleComponent.toText(item);
			arr.push(pre);
			return arr;
		},[]).reduce(function(div,el){
			div.appendChild(el);
			return div;
		},document.createElement("div"));
	}
}
ConsoleComponent.template.innerHTML = innerHTML;
customElements.define('console-component',ConsoleComponent);