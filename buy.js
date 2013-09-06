if (!window.ed10010) {
	$('#buyForm').submit(function(event){
		var price = parseFloat($('.lineThrough').text().substring(1));
		if (isNaN(price)) {
			price = parseFloat($('.goodsPrice').text());
			if (isNaN(price)) {
				price = 3000;
			} else {
				price *= 0.8
			}
		} else {
			price *= 0.6;
		}

		console.log('期待价格不大于 ' + price);
		localStorage.setItem('lessthan', price);
		localStorage.setItem('ed10010', JSON.stringify($(this). serializeArray()));
		return true;
	});
	window.ed10010 = true;
}

$('#submit_btn_id').click();
