var Trader = function(dic_in){
	
	var _prototype = {
		
		BlockChain:{},
		data:{
			trader_id:'',
			flag_available:true,
			portfolio_qty:{}
		},
		draw:function(){
			$('.'+this.data.trader_id+' .ethereum.reserve').html(parseInt(this.data.portfolio_qty['ethereum']))
			$('.'+this.data.trader_id+' .augur.reserve').html(parseInt(this.data.portfolio_qty['augur']))

			if(this.data.trader_id=='trader_arbitrageur'){
				var profit 	 			= (this.data.portfolio_qty['augur'] - 600).toFixed(2)
				$('.profit.reserve').html(profit)
			}
		},
		display_messages:function(msg){
			$('.'+this.data.trader_id+' .messages').prepend('<div class="msg_item reveal dur1">'+msg+'</div>')
		},
		get_profit:function(){
			if(this.data.trader_id=='trader_arbitrageur'){
				var profit 	 			= (this.data.portfolio_qty['augur'] - 600).toFixed(2)
				return profit
			}else{
				return 0
			}
		},

		receive_transact:function(dic_in){
			console.log('Trader',this.data.trader_id,' - receiving transact')
			console.log(dic_in)
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
			this.data.portfolio_qty[dic_in.token_name] 	= (this.data.portfolio_qty[dic_in.token_name] || 0) + dic_in.token_qty
			this.data.flag_available 	= true
			this.draw()
			this.display_messages('receiving '+dic_in.token_qty.toFixed(3)+' '+ dic_in.token_name + ' from ' + dic_in.sender_id)
		},
		send_transact:function(dic_in){
			
			this.data.portfolio_qty[dic_in.token_name] = (this.data.portfolio_qty[dic_in.token_name] || 0) - dic_in.token_qty
			this.draw()
			this.display_messages('sending '+dic_in.token_qty.toFixed(3)+' '+ dic_in.token_name  + ' to ' + dic_in.receiver_id )

			this.BlockChain.add_instruction('send',{
				'receiver_id':dic_in.receiver_id,
				'sender_id':this.data.trader_id,
				'token_qty':dic_in.token_qty,
				'token_name':dic_in.token_name
			})
			
			
		},
		send_exchange:function(dic_in){
			
			this.data.portfolio_qty[dic_in.token_name] = (this.data.portfolio_qty[dic_in.token_name] || 0) - dic_in.token_qty
			this.draw()
			this.display_messages('sending '+dic_in.token_qty.toFixed(3)+' '+ dic_in.token_name  + ' to ' + dic_in.receiver_id )

			this.exchange.change(dic_in.token_name,dic_in.token_qty,trader)
		},
		
		
		display_portfolio_qty:function(){
			return JSON.parse(JSON.stringify(this.data.portfolio_qty))
		},
		init:function(dic_in){
			
			this.BlockChain 			= dic_in.blockchain
			this.data.trader_id 		= dic_in.trader_id
			this.data.portfolio_qty 	= dic_in.portfolio_qty || {}
			this.exchange 				= dic_in.exchange
			
			this.BlockChain.register_contract(dic_in.trader_id,this)
			var elem 					= this
			setTimeout(function(){
				elem.draw()
			},500)
		}
	
	}
	
	
	var trader = Object.create(_prototype)
	trader.init(dic_in)
	
	return trader
}
