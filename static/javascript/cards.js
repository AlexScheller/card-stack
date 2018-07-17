$(document).ready(function() {

	/*
	 * "deck" is just a wrapper for an array
	 * giving it more thematic verbs, and
	 * including a shuffle.
	 */
	let deck = {
		cards: [],
		isEmpty: function() {
			return this.cards.length <= 0;
		},
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
		deck.add('s' + i);
		deck.add('c' + i);
		deck.add('d' + i);
		deck.add('h' + i);
	}
	faces = ['j', 'q', 'k', 'a'];
	for (let face in faces) {
		deck.add('s' + faces[face]);
		deck.add('c' + faces[face]);
		deck.add('d' + faces[face]);
		deck.add('h' + faces[face]);
	}*/
	/* 
	 * just a few cards if you want to easily test
	 * finishing the pile
	 */

	deck.add('c3');
	deck.add('c4');
	deck.add('c5');
	deck.shuffle();

	$.fn.flipCard = function() {
		$(this).toggleClass('front-showing');
		$(this).toggleClass('back-showing');
	}

	/* 
	 * if there are cards left in the deck,
	 * a card is assigned as a card spawner.
	 * note that cardSpawner and cardSetup
	 * are mutually recursive (on handlers).
	 */
	$.fn.cardSpawner = function() {
		$(this).one('mousedown', function() {
			console.log('haha clicked me');
			$newCard = $(`
				<div class="card back-showing draggable">
					<i class="fas fa-sync-alt flip-button"></i>
					<div class="back">
						<img src="static/assets/cardback.png">
					</div>
					<div class="front">
						<img src="">
					</div>
				</div>
			`);
			$newCard.cardSetup();
			if (!deck.isEmpty()) {
				$newCard.addClass('prototype');
			}
			$('#content-container').append($newCard)
		});
	}

	$.fn.cardSetup = function() {
		$(this).children('.front').children('img').attr(
			'src', 'static/assets/' + deck.draw() + '.png'
		);
		if (!deck.isEmpty()) {
			$(this).cardSpawner();
		}
		$(this).one('mouseup', function() {
			$(this).removeClass('prototype');
			$(this).removeClass('back-showing');
			$(this).addClass('front-showing');
		});
		$(this).children('.flip-button').on('click', function() {
			$(this).parent().flipCard();
		});
		$(this).draggable({
			containment: 'parent',
			stack: '.draggable'
		});
	}

	$('.prototype').cardSetup();

});