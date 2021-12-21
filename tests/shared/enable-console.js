import Console from './console.js';

window.top.console = new Console();
document.body.appendChild(window.top.console._div);
console.log("Loaded");