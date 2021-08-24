
		blockchain 					= BlockChain({})
		contract 					= Contract({blockchain:blockchain,contract_id:'uniswap_1'})
		centralized_exchange 		= Centralized_Exchange(contract)

		trader_uninformed_buyer		= Trader({blockchain:blockchain,exchange:centralized_exchange,trader_id:'trader_buyer',portfolio_qty:{'ethereum':300}})
		trader_uninformed_seller	= Trader({blockchain:blockchain,exchange:centralized_exchange,trader_id:'trader_seller',portfolio_qty:{'augur':400}})
		trader_arbitrageur 			= Trader({blockchain:blockchain,exchange:centralized_exchange,trader_id:'trader_arbitrageur',portfolio_qty:{'ethereum':200,'augur':600}})
		
		setTimeout(function(){		$('.loading').remove()	},6500)
		
		var random_strategy 		= function(trader,token_name){
			/** 
				Uninformed trader exchange randomly with the Uniswap contract for exogenous reason
				(lack of trust in exchange,... )
			**/
			
			var portfolio_qty 		= trader.display_portfolio_qty()
			var total_token_qty 	= portfolio_qty[token_name] || 0
			var max_trade_qty 		= Math.min(20, 	parseInt(total_token_qty/5)	)

			var token_qty			= parseInt(max_trade_qty *Math.random()) 
		
			trader.send_transact({receiver_id:'uniswap_1',token_name:token_name,token_qty:token_qty})

			var time_delay 			= parseInt((20*Math.random() +20)*1000)
			setTimeout(function(){random_strategy(trader,token_name)},time_delay)
		}




		var arbitrage_balancing		= function(){
			/**
				The arbitrage bot sell part of augur profit on the exchange to keep a stable around 
				of ethereum around 200
			**/
			
			var centralized_price 	= centralized_exchange.last_price()
			var ethereum_reserve	= trader_arbitrageur.display_portfolio_qty()['ethereum']
			var augur_reserve		= trader_arbitrageur.display_portfolio_qty()['augur']
			
			if( ethereum_reserve < 200 ){
				trader_arbitrageur.send_exchange({receiver_id:'centralized_exchange',token_name:'augur',token_qty:(200-ethereum_reserve) / centralized_price})
			}
			if( ethereum_reserve > 201 ){
				trader_arbitrageur.send_exchange({receiver_id:'centralized_exchange',token_name:'ethereum',token_qty:(ethereum_reserve-200) * centralized_price})
			}
			
		}
		
		
		
		
		var arbitrage_strategy		= function(){
			/** 
				When the price gets out of sync arbitrageur bot try to capture a riskless profit 
				by sending an order on uniswap and on the centralized exchange simultaneously.
			**/
			
			var contract_price 		= contract.get_price()
			var centralized_price 	= centralized_exchange.last_price()
			
			arbitrage_bool 			= false
			var diff_price 			= (centralized_price - contract_price) / contract_price 
			var ethereum_reserve	= trader_arbitrageur.display_portfolio_qty()['ethereum']
			
			arbitrage_balancing()
			
			if(diff_price>0.15){
				
				setTimeout(function(){
					trader_arbitrageur.send_transact({receiver_id:'uniswap_1',token_name:'ethereum',token_qty:6})
					trader_arbitrageur.send_exchange({receiver_id:'centralized_exchange',token_name:'augur',token_qty:(6) / contract_price})
				},2000)
				
				arbitrage_bool 		= true
				
			}else if(diff_price<-0.15){
			
				setTimeout(function(){
					trader_arbitrageur.send_transact({receiver_id:'uniswap_1',token_name:'augur',token_qty:30})
					trader_arbitrageur.send_exchange({receiver_id:'centralized_exchange',token_name:'ethereum',token_qty:(30)* contract_price})
				},2000)

				arbitrage_bool 		= true
			}
			
			
			if(arbitrage_bool){
				setTimeout(function(){arbitrage_strategy()},30*1000)
			}else{
				setTimeout(function(){arbitrage_strategy()},15*1000)
			}
		}
		
		
		
		
		contract.add_liquidity_pair({'pair_1':{'name':'ethereum','qty':100},'pair_2':{'name':'augur','qty':500}})		
		setTimeout(function(){
			random_strategy(trader_uninformed_buyer,'ethereum')
		},20*1000)

		setTimeout(function(){
			random_strategy(trader_uninformed_seller,'augur')
		},30*1000)
		
		setTimeout(function(){arbitrage_strategy()},60*1000)
