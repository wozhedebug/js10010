(function(){
	var fakedata;
	try {
		fakedata = JSON.parse(localStorage.getItem('ed10010'));
		if (!fakedata) throw 'null';
	} catch (e) {
		window.alert('找不到订单信息。在商品页面需要用buy.js购买，并且此脚本需要在订单页面执行');
		return;
	}

	var count = 1;

	var makeid = function() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 3; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	var prefix = makeid();

	var paramString = '';
	var first = true;

	$.each(fakedata, function(i, obj) {
		if (first) {
			first = false;
		} else {
			paramString += '&';
		}

		paramString += (obj.name + '=' + obj.value);
	});

	var openNew = function() {
		console.log('打开新窗口 ' + prefix + '_' + count);
		window.open('http://mall.10010.com/mall-web/GoodsDetail/promtlyBuy?' + paramString, prefix + '_' + count);
		count++
	};

	$('#header div.logo img').click(openNew).click(openNew).click(openNew).click(openNew).click(openNew);

})();