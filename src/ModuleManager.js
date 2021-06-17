var ModuleManager = {};
ModuleManager.relative_path = "../";
ModuleManager.importModule = function(...files){
	if(files.length == 0) return Promise.reject({});
	let file = files.shift();
	return import(ModuleManager.relative_path + file)
	.then(function(module){
		let obj = {};
		for(let item in module){
			obj[item] = module[item];
		}
		return Promise.resolve(obj);
	}).catch(function(err){
		console.log("Error loading "+file,err);
		return ModuleManager.importModule(...files);
	})
}
ModuleManager.importModules = function(import_obj){
	for(let obj in import_obj){
		import_obj[obj] = ModuleManager.importModule(...import_obj[obj])
		.then(function(val){
			import_obj[obj] = val;
		},function(o){
			console.log(obj+" failed to load any files!");
		});
	}
	return Promise.allSettled(Object.values(import_obj)).then(function(){
		return Promise.resolve(import_obj);
	});
}
ModuleManager.importScript = function(...files){
	if(files.length == 0) return Promise.reject({});
	let file = files.shift();
	let head = document.head;
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = file;
	return new Promise(function(resolve,reject){
		script.onreadystatechange = resolve;
		script.onload = resolve;
		script.onerror = reject;
		head.appendChild(script);
	}).catch(function(err){
		console.log("Error loading "+file,err);
		return ModuleManager.importScript(...files);
	});
}
ModuleManager.importScripts = function(import_obj){
	for(let obj in import_obj){
		import_obj[obj] = ModuleManager.importScript(...import_obj[obj])
		.catch(function(o){
			console.log(obj+" failed to load any files!");
		});
	}
	return Promise.allSettled(Object.values(import_obj)).then(function(){
		return Promise.resolve(import_obj);
	});
}
