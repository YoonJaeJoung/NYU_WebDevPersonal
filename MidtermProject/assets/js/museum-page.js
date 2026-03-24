/**
 * museum-page.js – Loads museum data from JSON and populates the template.
 * Expects to be loaded on museums/museum.html with ?id=<museumId>
 */
(function () {
	var params = new URLSearchParams(window.location.search);
	var museumId = params.get('id');

	if (!museumId) {
		document.getElementById('museum-left').innerHTML =
			'<p style="padding:2rem;color:#fff;">No museum selected. <a href="../museums.html" style="color:#fff;text-decoration:underline;">Go back</a></p>';
		return;
	}

	var BASE = '../assets/data/';

	Promise.all([
		fetch(BASE + 'museums.json').then(function (r) { return r.json(); }),
		fetch(BASE + 'artworks.json').then(function (r) { return r.json(); }),
		fetch(BASE + 'artists.json').then(function (r) { return r.json(); }),
		fetch(BASE + 'movements.json').then(function (r) { return r.json(); })
	]).then(function (data) {
		var allMuseums = data[0];
		var allArtworks = data[1];
		var allArtists = data[2];
		var allMovements = data[3];

		var museum = allMuseums.find(function (m) { return m.id === museumId; });
		if (!museum) {
			document.getElementById('museum-left').innerHTML =
				'<p style="padding:2rem;color:#fff;">Museum not found. <a href="../museums.html" style="color:#fff;text-decoration:underline;">Go back</a></p>';
			return;
		}

		// Left panel: brand color background
		var leftPanel = document.getElementById('museum-left');
		leftPanel.style.background = 'var(--brand-color)';
		document.documentElement.style.setProperty('--page-color', 'var(--brand-color)');

		// Title
		document.title = museum.name + ' — Modern Art Library';

		// Left panel content
		document.getElementById('museum-name').textContent = museum.name;
		document.getElementById('museum-address').textContent = museum.address;

		var descContainer = document.getElementById('museum-desc');
		descContainer.innerHTML = '';

		var descP = document.createElement('p');
		descP.className = 'movement-page__desc';
		descP.textContent = museum.description;
		descContainer.appendChild(descP);

		// Highlights
		if (museum.highlights && museum.highlights.length > 0) {
			var hlP = document.createElement('p');
			hlP.className = 'movement-page__desc';
			hlP.style.opacity = '0.8';
			hlP.style.fontWeight = '600';
			hlP.textContent = museum.highlights.join(' · ');
			descContainer.appendChild(hlP);
		}

		// Website link
		if (museum.website && museum.website !== '#') {
			var linkDiv = document.createElement('div');
			linkDiv.style.marginTop = '1.5rem';
			linkDiv.innerHTML = '<a href="' + museum.website + '" target="_blank" rel="noopener" class="btn btn--outline-white"><span class="material-symbols-outlined">launch</span> Visit website</a>';
			descContainer.appendChild(linkDiv);
		}

		// Right panel – artwork cards
		var artworks = allArtworks.filter(function (a) { return a.museumId === museumId; });
		var grid = document.getElementById('artwork-grid');
		grid.innerHTML = '';

		artworks.forEach(function (artwork) {
			var artist = allArtists.find(function (a) { return a.id === artwork.artistId; });
			var movement = allMovements.find(function (m) { return m.id === artwork.movementId; });
			var artistName = artist ? artist.name : '';
			var movColor = movement ? movement.color : '#888';
			var movName = movement ? movement.name : '';

			var card = document.createElement('div');
			card.className = 'art-card';
			card.style.setProperty('--page-color', movColor);
			card.style.background = movColor;

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

		if (artworks.length === 0) {
			grid.innerHTML = '<p style="color:#888;padding:2rem;grid-column:1/-1;">No artworks catalogued for this museum yet.</p>';
		}
	}).catch(function (err) {
		console.error('Failed to load museum data:', err);
	});

	function escapeHtml(str) {
		var div = document.createElement('div');
		div.textContent = str;
		return div.innerHTML;
	}
})();
