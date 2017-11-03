(function(){

	var snakeBody = jQuery('<div class="snakeBody">');

	var positionList = JSON.parse(localStorage.getItem('positionList') || "[]");

	var direction = JSON.parse(localStorage.getItem('direction')) || {
		horizontal: 1,
		vertical: 0
	};

	var getNextPosition = function(elem){
		var position = {};
        //***
		direction.horizontal && (position.left = Number(jQuery(elem).css('left').replace('px','')) + (direction.horizontal * 15));
		direction.vertical && (position.top = Number(jQuery(elem).css('top').replace('px','')) + (direction.vertical * 15));

		position.top && ((position.top > jQuery(window).height() && (position.top = 0)) || (position.top < 0 && (position.top = jQuery(window).height())));
		position.left && ((position.left > jQuery(window).width() && (position.left = 0)) || (position.left < 0 && (position.left = jQuery(window).width())));

		return position;
	};

	var elemaniGetir = function(){
		var targetArea = {
			top: Number(jQuery('.snakeBody:first').css('top').replace('px','')) + (direction.vertical && direction.vertical * 15),
			left: Number(jQuery('.snakeBody:first').css('left').replace('px','')) + (direction.horizontal && direction.horizontal * 15)
		};
		return jQuery(document.elementFromPoint(targetArea.left, targetArea.top));
	};

	var saveGameData = function(){
		localStorage.setItem('positionList', JSON.stringify(positionList));
		localStorage.setItem('direction', JSON.stringify(direction));
	};

	jQuery(document).keydown(function(e){

		if(jQuery.inArray(e.keyCode , [32,37,38,39,40]) == -1) return;

		if(e.keyCode == 32){
			saveGameData();
			elemaniGetir().length >0 && (elemaniGetir()[0].click());
			e.preventDefault();
			return;
		}

		direction = {
			horizontal: (e.keyCode == 37 && -1) || (e.keyCode == 39 && 1) || 0,
			vertical: (e.keyCode == 38 && -1) || (e.keyCode == 40 && 1) || 0
		};
		e.preventDefault();

	});


	setInterval(function(){
		
		jQuery('.snakeBody').each(function(key){
			positionList[key] = {
				top: Number(jQuery(this).css('top').replace('px','')),
				left: Number(jQuery(this).css('left').replace('px',''))
			};
			if(key == 0)
				jQuery(this).css(getNextPosition(jQuery(this)));
			else 
				jQuery(this).css(positionList[key-1]);			

		});

	}, 200);



	jQuery('body').append('<style>.snakeBody { z-index:99999999; width: 15px; height: 15px; position: fixed; top: 0; left:0; background: black;} .snakeBody:first-child {background: red;}</style>');

	var i=0;
	while(i<20){
		jQuery('body').append(snakeBody.clone().css(positionList[i] || {}));
		i++;
	}
	jQuery('.snakeBody:first').css('background','red');

})();