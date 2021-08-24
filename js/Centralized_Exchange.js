var config_portfolio = {
	type: 'line',
	data: {
		labels: ["2020-12-23", "2020-12-24", "2020-12-25", "2020-12-26", "2020-12-27", "2020-12-28", "2020-12-29", "2020-12-30", ],
		datasets: [{
			label: 'Portfolio',
			fill: false,
			backgroundColor: "rgb(54, 162, 235)",
			borderColor: "rgb(54, 162, 235)",
			data: [ 17122,20417,23964,23964,23964,23964,23964,23964,],
		}]
	},
	options: {
		responsive: true,
		title: {
			display: true,
			text: 'Overall Gains %'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Weeks'
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: '%'
				}
			}]
		}
	}
};


var Centralized_Exchange  	= function(contract,price_init,sigma,delay){ 

	var _prototype = {
		contract:{},
		data:{
			contract_price_history:[],
			price_history:[],
			trader_profit_history:[],
			price_init:0.2,
		},
		last_price: function(){
			if(this.data.price_history.length==0){return 0}
			return this.data.price_history[this.data.price_history.length-1]
		},
		change:function(token_name,token_qty,trader){
			var trader_id = trader.data.trader_id
			if(token_name=='augur'){
				var counterpart_qty = token_qty*this.last_price()
				trader.receive_transact({
					'sender_id':'centralized exchange',
					'token_name':'ethereum',
					'token_qty':counterpart_qty
				})
			}
			if(token_name=='ethereum'){
				var counterpart_qty = token_qty/this.last_price()
				trader.receive_transact({
					'sender_id':'centralized exchange',
					'token_name':'augur',
					'token_qty':counterpart_qty
				})
			}
		},
		
		draw_price:function(){
			console.log('drawed_price:',drawed_price)
			
			var drawed_price 			= this.data.price_history.slice(-20)
			var contract_drawed_price 	= this.data.contract_price_history.slice(-20)
			var trader_drawed_profit 	= this.data.trader_profit_history.slice(-20)
			
			while(drawed_price.length<19){
				drawed_price.unshift(0)
			}
			while(contract_drawed_price.length<19){
				contract_drawed_price.unshift(0)
			}
			while(trader_drawed_profit.length<19){
				trader_drawed_profit.unshift(0)
			}

			
			var label = [] 
			for(var i=0;i<20;i++){
				var index  	= Math.max(this.data.price_history.length-i,0)
				label.unshift(index)
			}

			
			var color_secondary 							= "rgba(0,0,0,0.2)"
			var datasets 									= []
			var datasets_profit 							= []
			if(drawed_price[drawed_price.length-1] > contract_drawed_price[contract_drawed_price.length-1]){
				

				datasets.push({
					label: 'contract price',
					fill: true,
					backgroundColor: "rgba(54, 162, 235,0.7)",
					borderColor: "rgba(0,0,0,0.5)",
					data: JSON.parse(JSON.stringify(contract_drawed_price)),
				})
				datasets.push({
					label: 'exchange price',
					fill: true,
					backgroundColor: "rgba(54, 262, 135,0.7)",
					borderColor: color_secondary,
					data: JSON.parse(JSON.stringify(drawed_price)),
				})
				
			}else{

				
				datasets.push({
					label: 'exchange price',
					fill: true,
					backgroundColor: "rgba(54, 262, 135,0.7)",
					borderColor: color_secondary,
					data: JSON.parse(JSON.stringify(drawed_price)),
				})
				datasets.push({
					label: 'contract price',
					fill: true,
					backgroundColor: "rgba(54, 162, 235,0.7)",
					borderColor: "rgba(0,0,0,0.5)",
					data: JSON.parse(JSON.stringify(contract_drawed_price)),
				})
				
			}


			var config_block 					= JSON.parse(JSON.stringify(config_portfolio))
			config_block.data.labels 			= label
			config_block.data.datasets 			= datasets

			
			$('.graph_content_overlay').css({"opacity":0})
			$('.overlay.canvas').remove()
			$('.graph_content_overlay').html('<canvas class="canvas overlay" style="width:1000px;height:350px;"></canvas>')

			var ctx 		= $(".overlay.canvas")[0].getContext('2d');
			var myLine 		= new Chart(ctx, config_block);
			
			setTimeout(function(){

				$('.graph_content_overlay').css({"opacity":1})
				
				$('.main.canvas').remove()
				$('.graph_content').html('<canvas class="canvas main" style="width:1000px;height:350px;"></canvas>')

				var ctx 		= $(".main.canvas")[0].getContext('2d');
				var myLine 	= new Chart(ctx, config_block);

				setTimeout(function(){
					$('.graph_content_overlay').css({"opacity":0})
				},1000)
				
			},2000)

			datasets_profit.push({
				label: 'Arbitrage Profits',
				fill: false,
				backgroundColor: "rgba(54, 162, 235,0.7)",
				borderColor: "rgba(0,0,0,0.5)",
				data: JSON.parse(JSON.stringify(trader_drawed_profit)),
			})

			$('.profit.canvas').remove()
			$('.graph_content_profit').html('<canvas class="canvas profit" style="width:1000px;height:350px;"></canvas>')

			var config_block_profit				= JSON.parse(JSON.stringify(config_portfolio))
			config_block_profit.data.labels 	= label
			config_block_profit.data.datasets 	= datasets_profit


			var ctx 		= $(".profit.canvas")[0].getContext('2d');
			var myLine 		= new Chart(ctx, config_block_profit);

		},
		'get_price_history':function(){
			return this.data.price_history
		},
		'get_price':function(price_init){
			/* compute a price following a standard stochastic process */
			
			var n 				= this.data.price_history.length
			var sigma  			= 0.05
			var random_process 	= 2*Math.random()-1
			var exponent 		= sigma*random_process*Math.sqrt(n)
			
			price 				= price_init*Math.exp(1)**(exponent) 				 
			return price
		},
		
		'init':function(contract,price_init,sigma,delay){
			var elem 			= this
			this.contract 		= contract
			var new_price 		= elem.get_price(elem.data.price_init)
			elem.data.price_history.push(new_price)
			elem.data.contract_price_history.push(this.contract.get_price())
			
			setInterval(function(){
				var new_price = elem.get_price(elem.data.price_init)
				elem.data.price_history.push(new_price)
				elem.data.contract_price_history.push(elem.contract.get_price())
				elem.data.trader_profit_history.push(trader_arbitrageur.get_profit())
				elem.draw_price()
			},delay)
		},
	}	

	if(!price_init){ price_init=10	}
	if(!delay){	delay=5000}
	if(!sigma){	sigma=1	}
	
	var object = Object.create(_prototype)
	object.init(contract,price_init,sigma,delay)
	
	return object
}
