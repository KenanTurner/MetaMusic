var ModuleManager = {};
ModuleManager.relative_path = "../";
ModuleManager.import = function(...files){
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
		return dynamicImport(...files);
	})
}
ModuleManager.chainImports = function(import_obj){
	for(let obj in import_obj){
		import_obj[obj] = ModuleManager.import(...import_obj[obj])
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
