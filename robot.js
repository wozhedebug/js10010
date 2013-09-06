(function(){
	var fakedata = JSON.parse(localStorage.getItem('ed10010'));
	var expected = localStorage.getItem('lessthan');
	console.log('期待价格不大于 ' + expected);

	var $newPage;

	var onPostReturn = function(data) {
		console.log('提交返回');
		$newPage = $(data);

		$('span#Price').attr('goodsPrice', $newPage.filter('div').find('span#Price').attr('goodsPrice'));
		$('span#Price').html($newPage.filter('div').find('span#Price').html());

		var price = parseFloat($newPage.filter('div').find('span#Price').attr('goodsPrice'));

		if (isNaN(price)) {
			console.log('找不到价格，等1秒重试');
			setTimeout(trigger, 1000);
		} else if (price > expected) {
			console.log('价格太高 ' + price + ' > ' + expected);
			trigger();
		} else {
			$('#orderSubmitForm #_m_token').attr('value', $newPage.filter('#orderSubmitForm').find('#_m_token').attr('value'));
			$('#orderSubmitForm #_m_state').attr('name', $newPage.filter('#orderSubmitForm').find('#_m_state').attr('name'));
			$('#orderSubmitForm #_m_state').attr('value', $newPage.filter('#orderSubmitForm').find('#_m_state').attr('value'));

			console.log('下单！');

			var submitted = false;
			$('#orderSubmitForm').submit(function(event) {
				submitted = true;
				return true;
			});
			fromJSON();

			setTimeout(function() {
				if (!submitted) {
					console.log('亡羊补牢，现在按按钮还来得及吗？');
					$('#orderSubmit').click();
				}
			}, 200);
		}
	};

	var trigger = function() {
		if (window.stopRobot) {
			console.log('手动结束!');
			return;
		}
		console.log('重新提交');
		$.post('http://mall.10010.com/mall-web/GoodsDetail/promtlyBuy', fakedata, onPostReturn);
	};

	delete window.stopRobot;
	trigger();
})();
