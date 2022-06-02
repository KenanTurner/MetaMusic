import innerHTML from './html.js';
export default class ConsoleComponent extends HTMLElement{
	static template = document.createElement('template');
	constructor(){
		super();
		const content = this.constructor.template.content;
		const root = this.attachShadow({mode:'open'});
		root.appendChild(content.cloneNode(true));
		
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
ConsoleComponent.template.innerHTML = innerHTML;
customElements.define('console-component',ConsoleComponent);