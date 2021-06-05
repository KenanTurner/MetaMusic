//output console to screen
let c = console.log;
console.log = function(...data){
    update_text_area(...data);
    c(...data);
}
function update_text_area(...data){
	var div = document.createElement('pre');
	div.className = "console";
	data.forEach(function(item){
		switch(typeof item){
			case "string":
				div.textContent += item + " ";
				break;
			case "function":
				div.textContent += item.toString() + " ";
				break;
			case "object":
				if(Error.prototype.isPrototypeOf(item)){
					div.textContent += item.constructor.name + " " + item.stack + " ";
				}else if(item){
					div.textContent += item.constructor.name + " " + JSON.stringify(item,null,'\t') + " ";
				}
				break;
			default:
				div.textContent += JSON.stringify(item,null,'\t') + " ";
		}
	});
	document.getElementById('console').append(div);
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        div.scrollIntoView();
    }
}

//fix header
let header = document.getElementById("header");
let _c = document.getElementById("console");
_c.style.marginTop = header.offsetHeight+"px";

