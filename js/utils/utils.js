var utils = utils || {}

function gList_key(aDic){
	key_list = []
	for(var key in aDic) {
		if(aDic.hasOwnProperty(key)) {
			key_list.push(key)
		}
	}	
	return key_list
}
function keys(aDic){
	
	return gList_key(aDic)
}

function isInArray(myarr,elm){
	return (myarr.indexOf(elm) > -1);
}

function removeInArray(array,search_term){
	for (var i=array.length-1; i>=0; i--) {
		if (array[i] === search_term) {
			array.splice(i, 1);
			// break;       //<-- Uncomment  if only the first term has to be removed
		}
	}
	return array
}
function gTimeHeader(){
	var d = new Date()
	
	var YYYY 	= d.getFullYear().toString()
	var MM   	= ('0' + (d.getMonth()+1).toString()).slice(-2);
	var DD 		= ('0' + d.getDate().toString()).slice(-2); 
	
	var hh 		= ('0' + d.getHours().toString()).slice(-2); 
	var mm 		= ('0' + d.getMinutes().toString()).slice(-2); 
	var ss 		= ('0' + d.getSeconds().toString()).slice(-2); 
	
	var ms 		=  d.getUTCMilliseconds().toString() 

	var timeHeader = YYYY + MM + DD + '_' + hh + mm + ss + '_' + ms 
	return timeHeader
	
}

function clean_form(list_field){
	for (var i=0;i<list_field.length;i++){
		$('#'+list_field[i]).val('')
	}
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function disable_field_list(list_field){
	for (i = 0; i < list_field.length; i++) {	
		$('#' + list_field[i]).css({'background-color':'#eee'})
	}
}
function enable_field_list(list_field){
	for (i = 0; i < list_field.length; i++) {	
		$('#' + list_field[i]).css({'background-color':'#fff'})
	}
}

function fade_elem(list_field){
	for (i = 0; i < list_field.length; i++) {	
		$('#' + list_field[i]).css({'opacity':0.4})
	}
}

function unfade_elem(list_field){
	for (i = 0; i < list_field.length; i++) {	
		$('#' + list_field[i]).css({'opacity':1})
	}
}

function display_spinner(id){
	var current_item_id = $('#current_item_id').val()
	$('#' + id+'_spinner').css({'display':'inline'})
}
function hide_spinner(id){
	$('#' + id+'_spinner').css({'display':'none'})
}
			
function display_spinner_id(id){
	var current_item_id = $('#current_item_id').val()
	$('#' + id+'_spinner').css({'display':'inline'})
}
function hide_spinner_id(id){
	$('#' + id+'_spinner').css({'display':'none'})
}


function slug_name(text){
	text 		= $.trim(text)
	var slug 	=''
	var words 	= text.split(" ");
	for (var i = 0; i < words.length; i++) {
		if($.trim(words[i]).length>0){
			slug 	+= cleanAccent($.trim(words[i]))+'-';
		}
	}
	if(slug.length>0){
		slug = slug.slice(0,-1)				
	}
	return slug
}

function match_field(source,target){
	var value = $('#'+source).val()
	$('#'+target).val(value)
}
function match_slug_field(source,target){
	var slugged = slug_name($('#'+source).val())
	$('#'+target).val(slugged.toLowerCase())
}
function check_photo(source_id,target_id){
	$('#'+target_id).attr('src',$('#'+source_id).val())
}
function match_char_count(source,target){
	$('#'+target).html($.trim($('#'+source).val()).length)
}

function defer(method) {
    if (window.$){
		console.log('ready $')
		console.log($)
        method();
	}else{
		console.log('not ready')
		console.log(window.$)
        setTimeout(function() { defer(method) }, 2000);
	}
}
function defer_prealable(method,prealable) {
    if (window[prealable]){
		console.log('ready ' + prealable)
        method();
	}else{
		console.log('not ready' + prealable)
        setTimeout(function() { defer_prealable(method,prealable) }, 2000);
	}
}

function modify_select_list(source_select,target_input,add_or_remove){
	var list_target_text = $('#'+target_input).val()
	var list_target_1 = list_target_text.split(',');
	var list_target = [];
	var value_elm = ''
	for(var i=0;i<list_target_1.length;i++){
		value_elm = $.trim(list_target_1[i])
		if(value_elm.length>0){
			list_target.push(value_elm)	
		}
	}
	
	var value_source = $('#'+source_select).val()
	var is_source_in_list_bool = isInArray(list_target,value_source)

	if(add_or_remove=='add'){
		if(!is_source_in_list_bool){
			if($.trim(value_source)){
				list_target.push(value_source)
			}
		}
	}else if(add_or_remove=='remove'){
		if(is_source_in_list_bool){
			list_target = removeInArray(list_target,value_source)
		}
	}

	var list_target_text = list_target.join(',')
	$('#'+target_input).val(list_target_text)
	
}

function htmlize_area(list_area){
	for (var i=0;i<list_area.length;i++){
		$('#'+list_area[i]).htmlarea('updateHtmlArea');
	}
	return;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function replaceAll(word,before,after){
	return word.split(before).join(after);
}

function cleanAccent(word){
	word 	= replaceAll(word,'щ','e')
	word 	= replaceAll(word,'ра','a')
	return word
}



function compare_for_sort(a,b,key,defaultval,reverse) {
	var a_value = a[key] || defaultval
	var b_value = b[key] || defaultval
	var test_num_a = parseInt(a_value.toLowerCase())
	// there must be a place where it is used as a number
	//but when sorting alphabetical we must use alphabet value like in dashboard 
	if(isNaN(test_num_a)){
	}else{
		a_value 	= parseInt(a_value.toLowerCase())
		b_value 	= parseInt(b_value.toLowerCase())
	}
	var reverse = reverse || ''
	var reverse_coeff = 1
	if (reverse=='reverse'){reverse_coeff=-1}else{reverse_coeff=1} 
  if (a_value < b_value)
    return -1*reverse_coeff;
  if (a_value > b_value)
    return 1*reverse_coeff;
  return 0;
}

function sort_wparam(obj_list,key,defaultval,reverse){
	var compare = function(a,b){
		return compare_for_sort(a,b,key,defaultval,reverse)
	}
	
	var new_obj_list = []
	for(var i=0;i<obj_list.length;i++){
		new_obj_list[i] = jQuery.extend(true, {},obj_list[i]);
	}
	new_obj_list.sort(compare)
	return new_obj_list
}

function spinner_activate(spinner_id){
	display_spinner_id(spinner_id)
	setTimeout(function(){
		hide_spinner_id(spinner_id)
	},600)
}

function removeMobileOnclick() {
    if(isMobile()) {
    }
}

function isMobile() {
    if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
            || navigator.userAgent.match(/Opera Mini/i)
            || navigator.userAgent.match(/IEMobile/i)
            ) {
        return true;
    }
}

function touch_start(e){
  e.preventDefault();
  e.target.onclick();
}
function custom_menu_transition(elm_id,way){
	console.log('in custom_menu_transition:' +elm_id + ' - ' + way)
	if(way=='in'){
		$('#'+elm_id).css({'transform':'translate3d(235px, 0, 0px)','transition': 'all 0.5s ease-in-out'})
		setTimeout(function(){ $('#container').on('click.menumobile',function(){custom_menu_transition(elm_id,'out')}) },1000)
	}else{
		$('#'+elm_id).css({'transform':'translate3d(0px, 0, 0px)','transition': 'all 0.5s ease-in-out'})
		setTimeout(function(){ $('#container').off('click.menumobile') },1000)
	}
}

function isOverflown_h(element) {
    return element.scrollHeight > element.clientHeight;
}

function date_from_component_id(item_id,prefix){
	item_id = replaceAll(item_id,prefix,'')
	var year 	= item_id.slice(0,4)
	var month 	= item_id.slice(4,6)
	var day 	= item_id.slice(6,8)
	return {'year':year,'month':month,'day':day}
}
/*
*add the remove function to arrays
*used by panel_popup.js
*/
Array.remove = function(array, from, to) {
	var rest = array.slice((to || from) + 1 || array.length);
	array.length = from < 0 ? array.length + from : from;
	return array.push.apply(array, rest);
};


// javascript helper functions
var	getdate =  function(){
			var currentdate = new Date(); 
			var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + "-"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
			return datetime;
	}

function between(x, min, max) {
  return x >= min && x <= max;
}

utils.clone 	= function(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}