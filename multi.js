(function(){
	var fakedata;
	try {
		fakedata = JSON.parse(localStorage.getItem('ed10010'));
		if (!fakedata) throw 'null';
	} catch (e) {
		window.alert('找不到订单信息。在商品页面需要用buy.js购买，并且此脚本需要在 http://mall.10010.com/ 下的任意地址执行');
		return;
	}

	var count = 5;

	var openNew = function() {
		console.log('创建隐藏表单 ' + count);
		console.log(fakedata);

		var $form = $('<form></form')
		.attr('action', 'http://mall.10010.com/mall-web/GoodsDetail/promtlyBuy')
		.appendTo('body');

		$.each(fakedata, function(i, obj){
			$('<input></input>')
			.attr('type', 'hidden')
			.attr('name', obj.name)
			.attr('value', obj.value)
			.appendTo($form);
		});
		
		window.open('about:blank', 'bw' + count);
		$form.attr('target', 'bw' + count).submit().empty().remove();

		if (--count > 0)
			setTimeout(openNew, 100);
	};

	openNew();
		
})();