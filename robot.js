(function(){
	var fakedata = JSON.parse(localStorage.getItem('ed10010'));
	var original = localStorage.getItem('original');
	console.log('原价 ' + original + ', 期待价格不大于 ' + (original*0.6));
	var expected = original*0.6;

	var $newPage;

	var lastTitle = '';
	var logOnTitle = function(msg) {
		console.log(msg);
		document.title = msg + ' <--' + lastTitle;
		lastTitle = msg;
	};

	var onPostReturn = function(data) {
		$newPage = $(data);

		$('span#Price').attr('goodsPrice', $newPage.filter('div').find('span#Price').attr('goodsPrice'));
		$('span#Price').html($newPage.filter('div').find('span#Price').html());

		var price = parseFloat($newPage.filter('div').find('span#Price').attr('goodsPrice'));

		if (isNaN(price)) {
			logOnTitle('找不到价格');
			deferTrigger();
		} else if (price > expected) {
			logOnTitle('价格太高 ' + price + ' > ' + expected);
			deferTrigger();
		} else {
			$('#orderSubmitForm #_m_token').attr('value', $newPage.filter('#orderSubmitForm').find('#_m_token').attr('value'));
			$('#orderSubmitForm #_m_state').attr('name', $newPage.filter('#orderSubmitForm').find('#_m_state').attr('name'));
			$('#orderSubmitForm #_m_state').attr('value', $newPage.filter('#orderSubmitForm').find('#_m_state').attr('value'));

			logOnTitle('下单！');

			var submitted = false;
			$('#orderSubmitForm').submit(function(event) {
				submitted = true;
				return true;
			});
			fromJSON();

			setTimeout(function() {
				if (!submitted) {
					logOnTitle('亡羊补牢，现在按按钮还来得及吗？');
					$('#orderSubmit').click();
				}
			}, 200);
		}
	};

	var deferTrigger = function() {
		var d = new Date();
		var interval = 1;
		switch (d.getHours()) {
			case 8:
			case 12:
			case 19:
				if (d.getMinutes() > 57)
					interval = 0;
				break;
			case 9:
			case 13:
			case 20:
				interval = 0;
				break;
			default:
		}

		logOnTitle('下次刷新间隔 ' + interval + ' 秒');

		if (interval == 0) {
			trigger();
		} else {
			setTimeout(trigger, interval * 1000);
		}
	};

	var trigger = function() {
		if (window.stopRobot) {
			logOnTitle('手动结束!');
			return;
		}
		logOnTitle('重新提交');
		$.post('http://mall.10010.com/mall-web/GoodsDetail/promtlyBuy', fakedata, onPostReturn);
	};

	delete window.stopRobot;
	trigger();
})();
