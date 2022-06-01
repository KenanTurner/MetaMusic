export default class Component extends HTMLElement {
	static template = document.createElement('template');
	constructor(){
		super();
		const content = this.constructor.template.content;
		const root = this.attachShadow({mode:'open'});
		root.appendChild(content.cloneNode(true));		
	}
}
//customElements.define('component-element',Component);