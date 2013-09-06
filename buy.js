(function(){
	if (!window.ed10010) {
		$('#buyForm').submit(function(event){
			var price = parseFloat($('.lineThrough').text().substring(1));
			if (isNaN(price)) {
				window.alert('找不到原价，刷新页面后重试');
				window.location.reload();
				return;
			}

			console.log('原价 ' + price);
			localStorage.setItem('original', price);
			localStorage.setItem('ed10010', JSON.stringify($(this). serializeArray()));
			return true;
		});
		window.ed10010 = true;
	}

	$('#submit_btn_id').click();
})();