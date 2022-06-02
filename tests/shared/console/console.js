import EventTarget from './event-target.js';
import ConsoleComponent from './component.js';
const console = EventTarget.observe(window.top.console);

const params = new URLSearchParams(window.location.search);
const DISPLAY_LOG = params.get('log') !== 'false';
const DISPLAY_ERROR = params.get('error') !== 'false';
const DISPLAY_WARN = params.get('warn') !== 'false';
const DISPLAY_DEBUG = params.get('debug')? params.get('debug') !== 'false': false;
const DISPLAY_CONSOLE = params.get('console')? params.get('console') !== 'false': window.location.pathname.includes("tests");
console.options = EventTarget.observe({log:DISPLAY_LOG,error:DISPLAY_ERROR,warn:DISPLAY_WARN,debug:DISPLAY_DEBUG});
const container = new ConsoleComponent(console);

window.top.console = console;
if(DISPLAY_CONSOLE) document.body.appendChild(container);
console.log("Console Loaded");