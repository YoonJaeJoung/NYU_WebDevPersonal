/**
 * artist-page.js – Loads artist data from JSON and populates the template.
 * Expects to be loaded on artists/artist.html with ?id=<artistId>
 */
(function () {
	var params = new URLSearchParams(window.location.search);
	var artistId = params.get('id');

	if (!artistId) {
		document.getElementById('artist-left').innerHTML =
			'<p style="padding:2rem;color:#fff;">No artist selected. <a href="../artists.html" style="color:#fff;text-decoration:underline;">Go back</a></p>';
		return;
	}

	var BASE = '../assets/data/';

	Promise.all([
		fetch(BASE + 'artists.json').then(function (r) { return r.json(); }),
		fetch(BASE + 'artworks.json').then(function (r) { return r.json(); }),
		fetch(BASE + 'movements.json').then(function (r) { return r.json(); })
	]).then(function (data) {
		var allArtists = data[0];
		var allArtworks = data[1];
		var allMovements = data[2];

		var artist = allArtists.find(function (a) { return a.id === artistId; });
		if (!artist) {
			document.getElementById('artist-left').innerHTML =
				'<p style="padding:2rem;color:#fff;">Artist not found. <a href="../artists.html" style="color:#fff;text-decoration:underline;">Go back</a></p>';
			return;
		}

		// Left panel: brand color background
		var leftPanel = document.getElementById('artist-left');
		leftPanel.style.background = 'var(--brand-color)';
		document.documentElement.style.setProperty('--page-color', 'var(--brand-color)');

		// Title
		document.title = artist.name + ' — Modern Art Library';

		// Left panel content
		document.getElementById('artist-name').textContent = artist.name;
		document.getElementById('artist-period').textContent =
			artist.born + ' – ' + artist.died + ' · ' + artist.nationality;

		// Movements list
		var movementNames = artist.movementIds.map(function (mid) {
			var m = allMovements.find(function (mv) { return mv.id === mid; });
			return m ? m.name : '';
		}).filter(Boolean);

		var descContainer = document.getElementById('artist-desc');
		descContainer.innerHTML = '';

		// Movement tags
		if (movementNames.length > 0) {
			var movP = document.createElement('p');
			movP.className = 'movement-page__desc';
			movP.style.opacity = '0.8';
			movP.style.fontWeight = '600';
			movP.textContent = movementNames.join(' · ');
			descContainer.appendChild(movP);
		}

		// Bio
		var bioP = document.createElement('p');
		bioP.className = 'movement-page__desc';
		bioP.textContent = artist.bio;
		descContainer.appendChild(bioP);

		// Right panel – artwork cards
		var artworks = allArtworks.filter(function (a) { return a.artistId === artistId; });
		var grid = document.getElementById('artwork-grid');
		grid.innerHTML = '';

		artworks.forEach(function (artwork) {
			var movement = allMovements.find(function (m) { return m.id === artwork.movementId; });
			var movColor = movement ? movement.color : '#888';
			var movName = movement ? movement.name : '';

			var card = document.createElement('div');
			card.className = 'art-card';
			card.style.setProperty('--page-color', movColor);
			card.style.background = movColor;

			var detailUrl = '../artworks/artwork.html?id=' + artwork.id;
			var movUrl = '../movements/movement.html?id=' + artwork.movementId;

			card.innerHTML =
				'<div class="art-card__info">' +
				'<div class="art-card__title">' + escapeHtml(artwork.title) + '</div>' +
				'<div class="art-card__artist">' + escapeHtml(artist.name) + '</div>' +
				'<div class="art-card__medium">' + escapeHtml(artwork.medium || '') + '</div>' +
				'<div class="art-card__year">' + escapeHtml(artwork.year) + '</div>' +
				'</div>' +
				'<img class="art-card__image" src="' + artwork.imageUrl + '" alt="' + escapeHtml(artwork.title) + '" loading="lazy">' +
				'<a class="art-card__mobile-browse" href="' + movUrl + '">Learn more about ' + escapeHtml(movName) + ' →</a>' +
				'<a class="art-card__mobile-detail" href="' + detailUrl + '">View Details →</a>' +
				'<div class="art-card__overlay">' +
				'<div class="art-card__overlay-info">' +
				'<div class="art-card__title">' + escapeHtml(artwork.title) + '</div>' +
				'<div class="art-card__artist">' + escapeHtml(artist.name) + '</div>' +
				'<div class="art-card__medium">' + escapeHtml(artwork.medium || '') + '</div>' +
				'<div class="art-card__year">' + escapeHtml(artwork.year) + '</div>' +
				'</div>' +
				'<div class="art-card__overlay-spacer"></div>' +
				'<a class="art-card__overlay-browse" href="' + movUrl + '">Learn more about ' + escapeHtml(movName) + ' →</a>' +
				'<a class="art-card__overlay-detail" href="' + detailUrl + '">View Details →</a>' +
				'</div>';

			card.addEventListener('click', function (e) {
				if (!e.target.closest('a')) {
					window.location.href = detailUrl;
				}
			});

			grid.appendChild(card);
		});

		// Right panel background stays default (#f5f5f5)
		// Each card gets its own movement color

		if (artworks.length === 0) {
			grid.innerHTML = '<p style="color:#888;padding:2rem;grid-column:1/-1;">No artworks catalogued for this artist yet.</p>';
		}
	}).catch(function (err) {
		console.error('Failed to load artist data:', err);
	});

	function escapeHtml(str) {
		var div = document.createElement('div');
		div.textContent = str;
		return div.innerHTML;
	}
})();
