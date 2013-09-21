(function(){
	var fakedata = JSON.parse(localStorage.getItem('ed10010'));
	var numInfo = localStorage.getItem('hm10010') ? JSON.parse(localStorage.getItem('hm10010')) : {};
	var original = localStorage.getItem('original');

	var numPrice = 0;

	var numberChecker;
	var pingNumber = function() {
		if (window.stopRobot) {
			clearInterval(numberChecker);
			return;
		}

		logOnTitle('问候新号码');

		$.ajax({
			url: 'http://mall.10010.com/mall-web/GoodsDetailAjax/occupyNumberAjax',
			type: 'POST',
			data: numInfo,
			error: null
		});
	};

	$.each(fakedata, function(i, obj) {
		if (obj.name == 'numberFee') {
			numPrice = obj.value / 1000;
		} else if (obj.name == 'custTag' && obj.value == '1') {
			console.log('新用户');
			numberChecker = setInterval(pingNumber, 120000);
		}
	});

	original -= numPrice;
	var expected = original*0.6 + numPrice;

	console.log('手机原价 ' + original + ', 号码价格 ' + numPrice + ', 期待价格不大于 ' + expected);

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

			logOnTitle('发现价格 ' + price + ', 下单！');
			$('#orderSubmitForm').submit();
		}
	};

	var deferTrigger = function() {
		var d = new Date();
		var interval = 60;
		switch (d.getHours()) {
			case 8:
			case 12:
			case 19:
				if (d.getMinutes() > 57)
					interval = !!window.robotInterval ? window.robotInterval : 0;
				break;
			case 9:
			case 13:
			case 20:
				interval = !!window.robotInterval ? window.robotInterval : 0;
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

	var onPostError = function(request, textStatus, errorThrown) {
		logOnTitle('刷新失败: ' + textStatus);
		deferTrigger();
	};

	var trigger = function() {
		if (window.stopRobot) {
			logOnTitle('手动结束!');
			return;
		}
		logOnTitle('刷新');

		$.ajax({
			url: 'http://mall.10010.com/mall-web/GoodsDetail/promtlyBuy',
			type: 'POST',
			data: fakedata,
			timeout: 15000,
			success: onPostReturn,
			error: onPostError
		});
	};

	var preSubmitted = false;
	var preSubmit = function() {
		$('#orderSubmitForm').submit(function(event) {
			if (preSubmitted) return true;

			if (!$('#orderSubmitForm #paramStr').val()) {
				logOnTitle('信息不完整，无法保存下单数据');
			} else {
				logOnTitle('保存下单数据');
				$('#orderSubmit').removeClass('clicked')
				preSubmitted = true;
				trigger();
			}

			return false;
		});

		orderSubmit();
	};

	delete window.stopRobot;
	preSubmit();
})();
