import PROXY from '../../src/plugins/PROXY/proxy.js';

let params = new URLSearchParams(window.location.search);
export const CONCURRENT = Number(params.get('concurrent')) || 64;
export const TIMEOUT = Number(params.get('timeout'));

export function map(src,dest={},key=function({k}){return k},value=function({v}){return v}){
	for(let k in src){
		let v = src[k];
		dest[key({k,v})] = value({k,v});
	};
	return dest;
}

export function casesToOptions(Cases){
	return map(Cases,{},function({k}){return Cases[k].name},function({v}){
		return params.get(v.name) !== "false";
	});
}

export function playersToOptions(players){
	return map(players,{},function({k}){return k},function({k,v}){
		if(window.location.href.includes('.github.io/') && getProtoChain(v).includes(PROXY)){
			console.warn(`${k} playback has been disabled. See the README for more information.`);
			return false;
		}
		return params.get(k) !== "false";
	});
}

export function argsToOptions(args){
	return playersToOptions(map(args,{},function({k}){return k},function({v}){
		return v.Player;
	}));
}

export function getProtoChain(obj){
    obj = obj.constructor === Object.constructor? obj: obj.constructor;
    if(obj === Object.getPrototypeOf(Object)) return [];
    let chain = getProtoChain(Object.getPrototypeOf(obj));
    chain.push(obj);
    return chain;
}

export function displayOptions(options,id){
	let el = document.getElementById(id);
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
	Object.keys(options).forEach(function(name){
		let input = document.createElement("INPUT");
		let label = document.createElement("LABEL");
		input.type = "checkbox";
		input.id = "option-"+name;
		input.name = "option-"+name;
		input.checked = options[name];
		input.onclick = updateOptions.bind(options);
		label.for = "option-"+name;
		label.innerText = name+": ";
		el.appendChild(label);
		el.appendChild(input);
	});
}

function updateOptions(evt){
	let name = evt.target.id.substring(7);
	this[name] = evt.target.checked;
	if(window.history.pushState){
		let params = new URLSearchParams(window.location.search);
		for(let o in this){
			if(this[o]){
				params.delete(o);
			}else{
				params.set(o,'false');
			}
		}
		let url = window.location.origin + window.location.pathname + "?" + params;
        window.history.pushState({path:url}, '', url);
	}
}