$(document).ready(function() {
	let cardList = {
		cards: [],
		length: function() {
			return this.cards.length;
		},
		add: function(card) {
			this.cards.push(card);
		},
		draw: function(card) {
			if (this.cards.length == 0) {
				return "empty";
			}
			return this.cards.pop(card);
		},
		shuffle: function() {
			let numCards = this.cards.length;
			if (numCards > 1) {
				for (let i = numCards - 1; i > 0; i--) {
					let randex = Math.floor(Math.random() * (i + 1));
					let temp = this.cards[randex];
					this.cards[randex] = this.cards[i];
					this.cards[i] = temp;
				}
			}
		}
	}
	/* populate the deck */
	/*
	for (let i = 2; i <= 10; i++) {
		cardList.add('s' + i);
		cardList.add('c' + i);
		cardList.add('d' + i);
		cardList.add('h' + i);
	}
	faces = ['j', 'q', 'k', 'a'];
	for (let face in faces) {
		cardList.add('s' + faces[face]);
		cardList.add('c' + faces[face]);
		cardList.add('d' + faces[face]);
		cardList.add('h' + faces[face]);
	}*/
	/* 
	 * just a few cards if you want to easily test
	 * finishing the pile
	 */
	
	cardList.add('c3');
	cardList.add('c4');
	cardList.add('c5');
	
	cardList.shuffle();
	
	$.fn.handleModelCardDraw = function() {
		$(this).children('.back').children('img').attr(
			'src', 'static/assets/' + cardList.draw() + '.png'
		);
		$(this).unbind('mouseup');
	}
	$.fn.spawnNewVisualTopCard = function() {
		let $newCard = $('<div><img src=""></img></div>');
		$newCard.addClass('card');
		$newCard.addClass('top-card');
		$newCard.addClass('draggable');
		$newCard.children('img').attr('src', 'static/assets/cardback.png');
		$newCard.insertBefore($(this));
		$newCard.draggable({
			containment: 'parent',
			stack: '.draggable'
		});
		$newCard.on('mouseup', function() {
			$(this).handleModelCardDraw();
		});
		$newCard.on('mousedown', function() {
			if(!$newCard.hasClass('flipped')) {
				// Check greater than 1, not 0, because
				// the actual card draw happens on mouseup,
				// meaning that at some point after this
				// mousedown, but before the next mousedown,
				// the list in the model will, decrement.
				// This must then be represented visually
				// before the list in the model is depopulated.
				$newCard.addClass('flipped');
				if (cardList.length() > 1) {
					$('.card-stack').spawnNewVisualTopCard();
				} else {
					$('.card-stack').remove();
				}
				$newCard.removeClass('top-card');
			}
		});
	}
	$('.top-card').on('mouseup', function() {
		$(this).children('.back').removeAttr('hidden');
		$(this).removeClass('top-card');
		$(this).handleModelCardDraw();
	});
	$('.top-card').on('mousedown', function() {
		if(!$(this).hasClass('flipped')) {
			if (cardList.length() > 1) {
				$('.card-stack').spawnNewVisualTopCard();
			} else {
				$('.card-stack').remove();
			}
			$(this).addClass('flipped');
		}
	});
	$('.draggable').draggable({
		containment: 'parent',
		stack: '.draggable'
	});
	$('.flip-button').on('click', function() {
		$(this).parent().flip();
	});
	$('.card').flip({
		autoSize: false
	});
});