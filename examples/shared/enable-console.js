import Console from '../../tests/shared/console.js';

window.top.console = new Console();
window.top.console._div.classList.add('hidden');
document.body.appendChild(window.top.console._div);
console.log("Console Loaded");

document.addEventListener("keyup", function(e){
	if(e.key === '`' || e.keyCode === 192){
		window.top.console._div.classList.toggle('hidden');
	}
});