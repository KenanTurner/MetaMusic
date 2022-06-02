const innerHTML = `<style>
:host > * {
	padding: 0px;
	margin: 0px;
	background: hsl(225deg 5.8% 13.3%);
	color: #E6E6E6;
	font-family: monospace;
}
.hidden {
	display: none !important;
}
.input {
	display: flex;
	padding: 4px;
	border-style: solid;
	border-width: 0px;
	border-bottom-width: 1px;
	border-color: hsl(240deg 0% 22.9%);
}
.eval {
	all: unset;
	flex-grow: 0;
	padding-left: 7px;
	padding-right: 7px;
	color: #539ee0;
}
.command {
	all: unset;
	flex-grow: 1;
	min-height: 15px;
	overflow: hidden;
}
.output > *{
	display: flex;
	flex-wrap: wrap;
	padding: 4px;
	padding-left: 25px;
	padding-right: 25px;
	border-style: solid;
	border-width: 0px;
	border-bottom-width: 1px;
	border-color: hsl(240deg 0% 22.9%);
}
.output > * > *{
	all: unset;
	padding-right: 8px;
	white-space: pre-wrap;
	word-wrap: break-word;
	overflow: auto;
}
.warn {
	background: hsl(51deg 100% 9.1%);
	color: hsl(40.5deg 100% 60%);
}
.error {
	background: hsl(0deg 100% 7.5%);
	color: hsl(0deg 100% 75%);
}
</style>
<div class="output" id="output"></div>
<div class="input" id="input">
	<button id="eval" class="eval">&gt;</button>
	<input id="command" class="command" autocomplete="off" autocapitalize="off" spellcheck="false">
</div>`;
export default innerHTML;