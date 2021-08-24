		utils_component = {}
		utils_component.list_script_url_name = []
		utils_component.list_css_url_name = []
		utils_component.require = function(url){ 

				if(utils_component.list_script_url_name.indexOf($.trim(url))>-1){
					console.log('already loaded url: ' + url)
					return
				}
				var jsElm = document.createElement("script");
				jsElm.type = "application/javascript";
				jsElm.src = url;
				jsElm.id = 'last_download';
				document.body.appendChild(jsElm);
		}

		utils_component.load_css = function(url){ 
			if(utils_component.list_css_url_name.indexOf($.trim(url))>-1){
				console.log('already loaded url css: ' + url)
				return
			}
			$('head').append('<link rel="stylesheet" type="text/css" href="'+url+'">')	
		}	
