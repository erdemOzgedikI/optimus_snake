(function () {
	var snakeBody = jQuery('<div class="snakeBody">');
	var food = jQuery('<div class="food">'); // food defination 
	var scoreDiv = jQuery( // score defination
		'<div class="score">Skor:<label class="scoreValue"></label></div>'
	);

	var positionList = JSON.parse(localStorage.getItem('positionList') || '[]');
	// local storage da score varsa onu getir ve snake length varsa onu getir yoksa default degerleri set et 
	var score = JSON.parse(localStorage.getItem('score')) || 0;
	var snakeLength = JSON.parse(localStorage.getItem('snakeLength')) || 5;

	var direction = JSON.parse(localStorage.getItem('direction')) || {
		horizontal: 0, // 1 saga  -1 sola gider
		vertical: 1 // 1 asagi -1 yukari gider 
	};

	var foodPosition = { // food position random bir sekilde olusturmak icin kullanildi 
		left: 60,
		top: 0
	};

	var setFoodPosition = function (x, y) { // food positionin css fonksiyonu ile set edilmesi
		foodPosition.left = x;
		foodPosition.top = y;
		jQuery('.food').css({ left: `${x}px`, top: `${y}px` });
	};
	var setScore = function (value) { // div'e score deegrinin set edilmesi
		jQuery('.scoreValue').text(value);
	};

	var getNextPosition = function (elem) {
		var position = {};
		//*
		direction.horizontal &&
			(position.left =
				Number(
					jQuery(elem)
						.css('left')
						.replace('px', '')
				) +
				direction.horizontal * 15);
		direction.vertical &&
			(position.top =
				Number(
					jQuery(elem)
						.css('top')
						.replace('px', '')
				) +
				direction.vertical * 15);

		// max width ve height ulasildiginda bu koda giriyor.
		position.top &&
			((position.top > jQuery(window).height() && (position.top = 0)) ||
				(position.top < 0 && (position.top = jQuery(window).height())));
		position.left &&
			((position.left > jQuery(window).width() && (position.left = 0)) ||
				(position.left < 0 && (position.left = jQuery(window).width())));

		return position;
	};

	var getElement = function () {
		var targetArea = {
			top:
				Number(
					jQuery('.snakeBody:first')
						.css('top')
						.replace('px', '')
				) + (direction.vertical && direction.vertical * 15),
			left:
				Number(
					jQuery('.snakeBody:first')
						.css('left')
						.replace('px', '')
				) + (direction.horizontal && direction.horizontal * 15)
		};
		return jQuery(document.elementFromPoint(targetArea.left, targetArea.top));
	};

	var saveGameData = function () {
		localStorage.setItem('positionList', JSON.stringify(positionList));
		localStorage.setItem('direction', JSON.stringify(direction));
		localStorage.setItem('score', JSON.stringify(score)); // score ve snake length' in local storage eklenmesi
		localStorage.setItem('snakeLength', JSON.stringify(snakeLength));
	};

	jQuery(document).keydown(function (e) {
		console.log(positionList);
		console.log(e);
		if (jQuery.inArray(e.keyCode, [32, 37, 38, 39, 40]) == -1) return;

		// ters yöne hareket etme bug fix
		// vertical ve horizontal degerleri key code basildiginda ayni ise return et.
		if (
			(direction.vertical === 1 && e.keyCode === 38) ||
			(direction.vertical === -1 && e.keyCode === 40)
		) {
			return;
		}

		if (
			(direction.horizontal === 1 && e.keyCode === 37) ||
			(direction.horizontal === -1 && e.keyCode === 39)
		) {
			return;
		}
		if (e.keyCode == 32) {
			saveGameData();
			getElement().length > 0 && getElement()[0].click();
			e.preventDefault();
			return;
		}

		direction = {
			horizontal: (e.keyCode == 37 && -1) || (e.keyCode == 39 && 1) || 0,
			vertical: (e.keyCode == 38 && -1) || (e.keyCode == 40 && 1) || 0
		};
		// console.log(direction.vertical);
		// console.log(direction.horizontal);

		e.preventDefault();
	});

	setInterval(function () {
		jQuery('.snakeBody').each(function (key) {
			positionList[key] = {
				top: Number(
					jQuery(this)
						.css('top')
						.replace('px', '')
				),
				left: Number(
					jQuery(this)
						.css('left')
						.replace('px', '')
				)
			};
			// key 0 bizim head'imiz 
			if (key == 0) {


				if ( // eger head'imiz foot positiona degerse yeni bir position ekle score degerini ve snake length atrrir.
					positionList[key].left >= foodPosition.left &&
					positionList[key].left < foodPosition.left + 15 &&
					positionList[key].top >= foodPosition.top &&
					positionList[key].top < foodPosition.top + 15
				) {
					positionList.push({
						top: positionList[snakeLength - 1].top,
						left: positionList[snakeLength - 1].left + 15
					});
					score += 2;
					snakeLength += 1;
					jQuery('body').append( // yeni gelen item'i css ile html'e ekle
						snakeBody.clone().css(positionList[snakeLength] || {})
					);
					setScore(score); //score set et
					// random yeni bir position ekle ve onu set et
					var foodX = Math.floor(Math.random() * 20);
					var foodY = Math.floor(Math.random() * 20);
					setFoodPosition(foodX * 15, foodY * 15);
				}
				// console.log("THIS:", this)
				jQuery(this).css(getNextPosition(jQuery(this)));
			} else jQuery(this).css(positionList[key - 1]);
		});
	}, 200);

	setInterval(function () {
		setScore((score += 1));
	}, 10000); // 10 saniye de bir score ekle 

	jQuery('body').append(
		'<style>.snakeBody { z-index:99999999; width: 15px; height: 15px; position: fixed; top: 0; left:0; background: black;} .snakeBody:first-child {background: red;}</style>'
	);

	jQuery('body').append( // food itemimiz
		'<style>.food { z-index:99999999; width: 15px; height: 15px; position: fixed;  background: green;}</style>'
	);

	jQuery('body').append( // score itemimiz
		'<style>.score { z-index:99999999;color:red;  position: fixed; top: 0; right:25px;}</style>'
	);

	var i = 0;
	while (i < snakeLength) {
		jQuery('body').append(snakeBody.clone().css(positionList[i] || {}));
		i++;
	}
	jQuery('body').append(food.clone()); // food ve score divlerinin baslangicta gosterilmesi

	setFoodPosition(60, 60);
	jQuery('body').append(scoreDiv.clone());
	jQuery('.snakeBody:first').css('background', 'red');
	setScore(score);
})();