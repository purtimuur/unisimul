utilsModule_factory = function(){
	
	var __prototype = {
		'require':function(path_to_file){

			if(this.list_path_loaded.indexOf(path_to_file)==-1){
				
				var url= path_to_file; var jsElm = document.createElement("script");
				jsElm.type = "application/javascript"; jsElm.src = url;  jsElm.id = '';
				document.body.appendChild(jsElm);
				this.list_path_loaded.push(path_to_file)
			}
		}, 
		 
	}
 
	var __object 	= Object.create(__prototype) 
	var __data 		=  	{
		'list_path_loaded':[],
	}
	var list_key__data = keys(__data)
	for(var i=0;i<list_key__data.length;i++){
		var key = list_key__data[i]
		__object[key] 	= __data[key]
	}

	return __object

}

var utils_module = utilsModule_factory()