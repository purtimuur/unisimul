var utils 			= utils || {}
utils.template 		= {}

utils.template.replaceAll 	= function (str,search,replacement){
	return str.split(search).join(replacement)	
}
utils.template.fillTempl 	= function(template,dic){
	template    	= utils.template.replaceAll(template,'[[[','{{{')
	template    	= utils.template.replaceAll(template,']]]','}}}')

	template    	= utils.template.replaceAll(template,'[[','{{')
	template 		= utils.template.replaceAll(template,']]','}}')
	var rendered 	= Mustache.render(template, dic);
	return rendered
}
utils.template.fillTemplFile = function(template_name,dic){
	var template = $('#'+template_name).html()
	return utils.template.fillTempl(template,dic)
}
utils.template.ftf =function(template_name,dic){
	return utils.template.fillTemplFile(template_name,dic)
}
