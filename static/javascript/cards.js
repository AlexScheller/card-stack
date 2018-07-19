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
			console.log('adding');
			console.log(this.cards);
		},
		draw: function(card) {
			if (this.cards.length == 0) {
				return 'empty';
			}
			let ret =  this.cards.pop(card);
			console.log('drawing');
			console.log(this.cards);
			return ret
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
	deck.add('c6');
	// deck.shuffle();

	$.fn.flipCard = function() {
		$(this).toggleClass('front-showing');
		$(this).toggleClass('back-showing');
	}

	$.fn.finalizeDraw = function() {
		console.log('finalizing card draw');
		$(this).flipCard();
		$(this).removeClass('finalization-pending');
		$flipButton = $('<i class="fas fa-sync-alt flip-button"></i>');
		$(this).prepend($flipButton);
		$flipButton.on('click', function() {
			$(this).parent().flipCard();
		});
		$(this).droppable('disable');
	}

	$.fn.handleCardDraw = function() {
		console.log('handling card draw');
		$(this).one('mousedown', function() {
			$(this).removeClass('top-card');
			$(this).addClass('finalization-pending');
		});
		$(this).one('mousedown', function() {
			if (!deck.isEmpty()) {
				$newCard = $(`
					<div class="card back-showing draggable top-card">
						<p class="data-holder" hidden=""></p>
						<div class="back">
							<img src="static/assets/cardback.png">
						</div>
						<div class="front">
							<img src="">
						</div>
					</div>
				`);
				$newCard.setupTopCard();
				$('#content-container').append($newCard)
			}
		});
	}

	$.fn.handleDroppable = function() {
		$(this).droppable({
			hoverClass: "hovered-over",
			over: function(event, ui) {
				if (!$(ui.draggable).hasClass('finalization-pending') &&
					$(ui.draggable).hasClass('front-showing')) {
					$(ui.draggable).addClass('hover-flip');
					$(ui.draggable).flipCard();
				}
			},
			out: function(event, ui) {
				if (!$(ui.draggable).hasClass('finalization-pending') &&
					$(ui.draggable).hasClass('hover-flip')) {
					$(ui.draggable).removeClass('hover-flip');
					$(ui.draggable).flipCard();
				}
			},
			// NOTE: I attempted to use data attributes
			// instead of a holding "p" div, but there
			// a weird bug I couldn't figure out where
			// removing a card, then dropping it, then
			// dropping it again caused the top card to
			// take on its orinal value, rather than the
			// new top card. Haven't seen this bug with
			// using a p div to hold the data.
			drop: function(event, ui) {
				console.log("dropped on me!");
				let oldCardVal = $(ui.draggable).children('.data-holder').text();
				deck.add($(this).children('.data-holder').text());
				$(this).children('.data-holder').text(oldCardVal);
				$(this).children('.front').children('img').attr(
					'src', 'static/assets/' + oldCardVal + '.png'
				);
				$(ui.draggable).remove();
			}
		});
	}

	$.fn.setupTopCard = function() {
		let newCardVal = deck.draw();
		$(this).children('.data-holder').text(newCardVal);
		$(this).children('.front').children('img').attr(
			'src', 'static/assets/' + newCardVal + '.png'
		);
		$(this).handleCardDraw();
		$(this).one('mouseup', function() {
			$(this).finalizeDraw();
		});
		$(this).draggable({
			containment: 'parent',
			stack: '.draggable'
		});
		$(this).handleDroppable();
	}

	$('.top-card').setupTopCard();

});