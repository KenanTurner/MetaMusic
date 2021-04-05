//creates a string variable in local storage
function setLocalStorage(name,value,jsonify=false){
	if(jsonify){
		var json_str = JSON.stringify(value);
		window.localStorage.setItem(name, json_str);
	}else{
		window.localStorage.setItem(name, value);
	}
}

//retrieves a variable in local storage
function getLocalStorage(name,jsonify=false){
	if(window.localStorage.getItem(name)==null){
		return null;
	}
	if(jsonify){
		return JSON.parse(localStorage.getItem(name));
	}else{
		return window.localStorage.getItem(name);
	}
}

function getAllStorage() {

    var archive = [],
        keys = Object.keys(localStorage),
        i = 0, key;

    for (; key = keys[i]; i++) {
        archive.push( key + '=' + localStorage.getItem(key));
    }
    //console.log(archive);
    return archive;
}
