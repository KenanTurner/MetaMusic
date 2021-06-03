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

//console implementation
let code = document.getElementById("code");
let go_btn = document.getElementById("go");

code.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    go_btn.click();
  }else if(event.keyCode === 38) { //up
	  event.preventDefault();
	  if(cindex == chistory.length) ctmp = code.value;
	  if(cindex>0){
		  cindex--;
		  code.value = chistory[cindex];
	  }
  }else if(event.keyCode === 40) { //down
	  event.preventDefault();
	  if(cindex == -1)cindex++;
	  if(cindex<chistory.length){
		  cindex++;
		  code.value = chistory[cindex];
		  if(cindex==chistory.length) code.value = ctmp;
	  }
  }
});

//console history
let chistory = [];
let cindex = 0;
let ctmp = "";
go_btn.addEventListener("click",function(){
	try{
		//let t = eval.call(window,code.value); //super terrible but I don't care
		let t = window.eval(code.value); //super terrible but I don't care
		console.log(t);
	}catch(e){
		console.log(e);
	}
	chistory.push(code.value);
	cindex = chistory.length;
	code.value = "";
});

window.onerror = function(error, url, line) {
    console.log(error);
};
