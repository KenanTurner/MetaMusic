import EventTarget from '/src/event-target.js';
import Component from '/tests/shared/component.js';
export default class ConsoleComponent extends Component{
	static template = document.createElement('template');
	constructor(){
		super();
		this.output = this.shadowRoot.querySelector("#output");
		this.input = this.shadowRoot.querySelector("#input");
		this.eval = this.shadowRoot.querySelector("#eval");
		this.command = this.shadowRoot.querySelector("#command");
		this.eval.addEventListener("click",function(){
			if(this.command.value === "") return;
			window.top.console.log(this.command.value);
			this.exec(this.command.value);
			this.command.value = "";
		}.bind(this));
		this.command.addEventListener("keydown",function(e){
			if(e.key === 'Enter' || e.keyCode === 13){
				this.eval.click();
			}
		}.bind(this));
	}
	exec(str){
		try{
			let t = window.top.eval(str); //may God have mercy on my soul
			window.top.console.log(t);
		}catch(e){
			window.top.console.error(e);
		}
	}
}
ConsoleComponent.template.innerHTML = await(await fetch('/tests/shared/console.html')).text();
customElements.define('console-component',ConsoleComponent);

const console = EventTarget.observe(window.top.console);
const container = new ConsoleComponent();

const params = new URLSearchParams(window.location.search);
const DISPLAY_LOG = Boolean(params.get('log')) || true;
const DISPLAY_ERROR = Boolean(params.get('error')) || true;
const DISPLAY_WARN = Boolean(params.get('warn')) || true;
const DISPLAY_DEBUG = Boolean(params.get('debug')) || false;
const DISPLAY_CONSOLE = Boolean(params.get('console')) || window.location.pathname.includes("tests");
console.options = EventTarget.observe({log:DISPLAY_LOG,error:DISPLAY_ERROR,warn:DISPLAY_WARN,debug:DISPLAY_DEBUG});
console.options.observer.subscribe("all",{callback:function({type,state}){
	container.shadowRoot.querySelectorAll("."+type).forEach(function(node){
		state[type]? node.classList.remove("hidden"): node.classList.add("hidden");
	});
}});

function toText(item){
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
function toHTML(...args){
	return args.reduce(function(arr,item,index){
		if(index === 0 && typeof item === 'string' && /%c/.test(item)){
			return item.split(/%c/).map(function(text,i){
				let pre = document.createElement('pre');
				pre.innerText = toText(text);
				pre.style = args[i];
				if(i > 0) args.splice(1,1); //remove style tag from args
				return pre;
			});
		}
		let pre = document.createElement('pre');
		pre.innerText = toText(item);
		arr.push(pre);
		return arr;
	},[]).reduce(function(div,el){
		div.appendChild(el);
		return div;
	},document.createElement("div"));
}

let listener = {callback:function({type,state,args}){
	let node = toHTML(...args);
	node.classList.add(type);
	if(!state.options[type]) node.classList.add("hidden");
	container.output.appendChild(node);
}};
console.observer.subscribe("log",listener);
console.observer.subscribe("warn",listener);
console.observer.subscribe("error",listener);
console.observer.subscribe("debug",listener);

window.top.console = console;
if(DISPLAY_CONSOLE) document.body.appendChild(container);
console.log("Console Loaded");