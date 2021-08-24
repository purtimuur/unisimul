var BlockChain = function(dic_in){
	
	var _prototype = {
		
		data:{
			list_instruction:[],
			address_registry:{},
		},
		
		
		add_instruction:function(name_instruction,dic_param){
			console.log(' blockchain - add_transaction')
			console.log(name_instruction,':',dic_param)
			this.data.list_instruction.push([name_instruction,dic_param])
			return
		},
		exec_instruction:function(name_instruction,dic_param){
			if(name_instruction=='send'){
				this.send(dic_param)
			}
		},
		process_list_instruction:function(){
			console.log('len list:',this.data.list_instruction.length)
			while(this.data.list_instruction.length>0){
				let instruction = this.data.list_instruction.shift()
				console.log(instruction)
				this.exec_instruction(instruction[0],instruction[1])
			}
		},
		
		
		register_contract:function(contract_id,contract_object){
			this.data.address_registry[contract_id] = contract_object
		},
		
		send:function(dic_param){
			
			console.log('sending')
			if(this.data.address_registry[dic_param.receiver_id]==undefined){
				console.log('no receiver to send')
				return
			}
			this.data.address_registry[dic_param.receiver_id].receive_transact({
				sender_id:dic_param.sender_id,
				token_name:dic_param.token_name,
				token_qty:dic_param.token_qty
			})
			return
		},
		tick:function(){
			
			console.log('tick')
			this.process_list_instruction()
			
			var elem =	this
			setTimeout(function(){ elem.tick() },5000)
		},
		
		
		
		init:function(dic_in){
			this.tick()
		},
		
	}
	
	var object = Object.create(_prototype)
	object.init(dic_in)
	return object
}

