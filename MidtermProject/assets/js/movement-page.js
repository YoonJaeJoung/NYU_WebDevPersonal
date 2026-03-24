/**
 * movement-page.js – Loads movement data from JSON and populates the template.
 * Expects to be loaded on movements/movement.html with ?id=<movementId>
 */
(function () {
	const params = new URLSearchParams(window.location.search);
	const movementId = params.get('id');

	if (!movementId) {
		document.querySelector('.movement-page__left').innerHTML =
			'<p style="padding:2rem;color:#fff;">No movement selected. <a href="../index.html" style="color:#fff;text-decoration:underline;">Go back</a></p>';
		return;
	}

	const BASE = '../assets/data/';

	Promise.all([
		fetch(BASE + 'movements.json').then(r => r.json()),
		fetch(BASE + 'artworks.json').then(r => r.json()),
		fetch(BASE + 'artists.json').then(r => r.json())
	]).then(function ([movements, allArtworks, allArtists]) {
		const movement = movements.find(m => m.id === movementId);
		if (!movement) {
			document.querySelector('.movement-page__left').innerHTML =
				'<p style="padding:2rem;color:#fff;">Movement not found. <a href="../index.html" style="color:#fff;text-decoration:underline;">Go back</a></p>';
			return;
		}

		// Set movement-specific theme color
		document.documentElement.style.setProperty('--page-color', movement.color);
		document.querySelector('.movement-page__left').style.background = movement.color;

		// Title
		document.title = movement.name + ' — Modern Art Library';

		// Left panel content
		document.getElementById('mv-name').textContent = movement.name;
		document.getElementById('mv-period').textContent = movement.period;

		var descContainer = document.getElementById('mv-desc');
		descContainer.innerHTML = '';
		movement.description.forEach(function (para) {
			var p = document.createElement('p');
			p.className = 'movement-page__desc';
			p.textContent = para;
			descContainer.appendChild(p);
		});

		// Right panel – artwork cards
		var artworks = allArtworks.filter(a => a.movementId === movementId);
		var grid = document.getElementById('artwork-grid');
		grid.innerHTML = '';

		artworks.forEach(function (artwork) {
			var artist = allArtists.find(a => a.id === artwork.artistId);
			var artistName = artist ? artist.name : '';

			var card = document.createElement('div');
			card.className = 'art-card';

			var detailUrl = '../artworks/artwork.html?id=' + artwork.id;
			var artistUrl = '../artists/artist.html?id=' + artwork.artistId;

			card.innerHTML =
				'<div class="art-card__info">' +
				'<div class="art-card__title">' + escapeHtml(artwork.title) + '</div>' +
				'<div class="art-card__artist">' + escapeHtml(artistName) + '</div>' +
				'<div class="art-card__medium">' + escapeHtml(artwork.medium || '') + '</div>' +
				'<div class="art-card__year">' + escapeHtml(artwork.year) + '</div>' +
				'</div>' +
				'<img class="art-card__image" src="' + artwork.imageUrl + '" alt="' + escapeHtml(artwork.title) + '" loading="lazy">' +
				'<a class="art-card__mobile-browse" href="' + artistUrl + '">Learn more about ' + escapeHtml(artistName) + ' →</a>' +
				'<a class="art-card__mobile-detail" href="' + detailUrl + '">View Details →</a>' +
				'<div class="art-card__overlay">' +
				'<div class="art-card__overlay-info">' +
				'<div class="art-card__title">' + escapeHtml(artwork.title) + '</div>' +
				'<div class="art-card__artist">' + escapeHtml(artistName) + '</div>' +
				'<div class="art-card__medium">' + escapeHtml(artwork.medium || '') + '</div>' +
				'<div class="art-card__year">' + escapeHtml(artwork.year) + '</div>' +
				'</div>' +
				'<div class="art-card__overlay-spacer"></div>' +
				'<a class="art-card__overlay-browse" href="' + artistUrl + '">Learn more about ' + escapeHtml(artistName) + ' →</a>' +
				'<a class="art-card__overlay-detail" href="' + detailUrl + '">View Details →</a>' +
				'</div>';

			card.addEventListener('click', function (e) {
				if (!e.target.closest('a')) {
					window.location.href = detailUrl;
				}
			});

			grid.appendChild(card);
		});

		// If no artworks, show placeholder message
		if (artworks.length === 0) {
			grid.innerHTML = '<p style="color:#888;padding:2rem;grid-column:1/-1;">No artworks catalogued for this movement yet.</p>';
		}
	}).catch(function (err) {
		console.error('Failed to load movement data:', err);
	});

	function escapeHtml(str) {
		var div = document.createElement('div');
		div.textContent = str;
		return div.innerHTML;
	}
})();
