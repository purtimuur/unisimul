var Contract = function(dic_in){
	
	var _prototype = {
		
		data:{
			name:'',
			contract_id:'',
			pair_qty:{},
			trader_name:'',
			flag_available:true
		},
		
		draw:function(){
			$('.contract .ethereum.reserve').html(parseInt(this.data.pair_qty['ethereum']))
			$('.contract .augur.reserve').html(parseInt(this.data.pair_qty['augur']))
			
			var price 	= this.data.pair_qty['ethereum']/this.data.pair_qty['augur']
			$('.contract .price.reserve').html(price.toFixed(3))
		},
		get_price:function(){
			var price 	= this.data.pair_qty['ethereum']/this.data.pair_qty['augur']
			if(!price){price = 0}
			return price
		},
		display_messages:function(msg){
			$('.contract .messages').prepend('<div class="msg_item reveal dur1">'+msg+'</div>')
		},



		
		receive_qty:function(pair_name,pair_qty,sender_id){
			this.data.pair_qty[pair_name] = (this.data.pair_qty[pair_name] || 0) + pair_qty
			this.draw()
			try{
				this.display_messages('receiving '+pair_qty.toFixed(3)+' '+ pair_name +' from '+ sender_id)
			}catch(err){
				console.log(err)
				console.log('pair_1_qty:',pair_1_qty)
			}
		},
		send_transact:function(counterpart_name,counterpart_qty,wallet_id){
			
			this.data.pair_qty[counterpart_name] = (this.data.pair_qty[counterpart_name] || 0) - counterpart_qty
			this.draw()
			this.display_messages('sending '+counterpart_qty.toFixed(3)+' '+ counterpart_name + ' to ' + wallet_id)
			
			this.BlockChain.add_instruction('send',{
				'receiver_id':wallet_id,
				'sender_id':this.data.contract_id,
				'token_qty':counterpart_qty,
				'token_name':counterpart_name
			})
			
		},
		receive_transact:function(dic_in){
			if(this.data.flag_available){
				var elem 					= this
				this.data.flag_available 	= false
				setTimeout(function(){elem.process_transact(dic_in)	},100)
				return {bool:true}
			}else{
				return {bool:false}
			}
		},
		process_transact:function(dic_in){
			
			var pair_name 				= dic_in.token_name 	|| ''
			var pair_qty 				= dic_in.token_qty 		|| ''
			var trade_sender_id 		= dic_in.sender_id
			
			var list_pair_available 	= Object.keys(this.data.pair_qty)
			var index_pair_name 		= list_pair_available.indexOf(pair_name)
			var index_counterpart_name 	= (index_pair_name==0) ? 1 : 0
			
			this.receive_qty(pair_name,pair_qty,trade_sender_id)
			var counterpart_name 		= list_pair_available[index_counterpart_name]
			
			var price 					= this.data.pair_qty[counterpart_name] / this.data.pair_qty[pair_name] 
			var counterpart_qty 		= Math.min( pair_qty*price, this.data.pair_qty[counterpart_name] / 5 )
			
			this.send_transact(counterpart_name,counterpart_qty,trade_sender_id)

			this.data.flag_available 	= true
		},




		display_pair_qty:function(){
			return JSON.parse(JSON.stringify( this.data.pair_qty))
		},
		add_liquidity_pair:function(dic_in){
			pair_1_name 	= dic_in['pair_1'].name 
			pair_1_qty 		= dic_in['pair_1'].qty
			
			this.data.pair_qty[pair_1_name] 	= pair_1_qty
			
			pair_2_name 	= dic_in['pair_2'].name 
			pair_2_qty 		= dic_in['pair_2'].qty

			this.data.pair_qty[pair_2_name] 	= pair_2_qty
			
			this.draw()
			return {bool:true}
		},
		
		
		
		
		init:function(dic_in){
			
			this.BlockChain 		= dic_in.blockchain
			this.data.contract_id 	= dic_in.contract_id || ''

			this.BlockChain.register_contract(dic_in.contract_id,this)
			var elem 				= this
			setTimeout(function(){
				elem.draw()
			},500)
		}
	}
	
	var contract = Object.create(_prototype)
	contract.init(dic_in)
	return contract
}
