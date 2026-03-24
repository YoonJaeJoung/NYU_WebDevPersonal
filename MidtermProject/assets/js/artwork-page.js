/**
 * artwork-page.js – Loads artwork data from JSON and populates the template.
 * Expects to be loaded on artworks/artwork.html with ?id=<artworkId>
 */
(function () {
	var params = new URLSearchParams(window.location.search);
	var artworkId = params.get('id');

	if (!artworkId) {
		document.getElementById('artwork-left').innerHTML =
			'<p style="padding:2rem;">No artwork selected. <a href="../gallery.html" style="text-decoration:underline;">Go back to gallery</a></p>';
		return;
	}

	var BASE = '../assets/data/';

	Promise.all([
		fetch(BASE + 'artworks.json').then(function (r) { return r.json(); }),
		fetch(BASE + 'artists.json').then(function (r) { return r.json(); }),
		fetch(BASE + 'movements.json').then(function (r) { return r.json(); }),
		fetch(BASE + 'museums.json').then(function (r) { return r.json(); })
	]).then(function (data) {
		var allArtworks = data[0];
		var allArtists = data[1];
		var allMovements = data[2];
		var allMuseums = data[3];

		var artwork = allArtworks.find(function (a) { return a.id === artworkId; });
		if (!artwork) {
			document.getElementById('artwork-left').innerHTML =
				'<p style="padding:2rem;">Artwork not found. <a href="../gallery.html" style="text-decoration:underline;">Go back to gallery</a></p>';
			return;
		}

		var artist = allArtists.find(function (a) { return a.id === artwork.artistId; });
		var movement = allMovements.find(function (m) { return m.id === artwork.movementId; });
		var museum = allMuseums.find(function (m) { return m.id === artwork.museumId; });
		var artistName = artist ? artist.name : '';
		var movColor = movement ? movement.color : '#888';
		var movName = movement ? movement.name : '';
		var museumName = museum ? museum.name : '';

		// Set movement color for right panel
		document.documentElement.style.setProperty('--page-color', movColor);

		// Title
		document.title = artwork.title + ' — Modern Art Library';

		// Left panel: white bg, black text
		var leftPanel = document.getElementById('artwork-left');
		leftPanel.style.background = '#ffffff';
		leftPanel.style.color = '#111111';

		document.getElementById('artwork-title').textContent = artwork.title;
		document.getElementById('artwork-title').style.color = '#111111';

		var metaEl = document.getElementById('artwork-meta');
		metaEl.textContent = artistName + ' · ' + artwork.year;
		metaEl.style.color = '#444444';

		var descContainer = document.getElementById('artwork-desc');
		descContainer.innerHTML = '';

		// Medium
		if (artwork.medium) {
			var medP = document.createElement('p');
			medP.className = 'movement-page__desc';
			medP.style.color = '#666666';
			medP.style.fontWeight = '600';
			medP.textContent = artwork.medium;
			descContainer.appendChild(medP);
		}

		// Movement
		if (movName) {
			var movP = document.createElement('p');
			movP.className = 'movement-page__desc';
			movP.style.color = movColor;
			movP.style.fontWeight = '600';
			movP.textContent = movName;
			descContainer.appendChild(movP);
		}

		// Description
		if (artwork.description) {
			var descP = document.createElement('p');
			descP.className = 'movement-page__desc';
			descP.style.color = '#333333';
			descP.textContent = artwork.description;
			descContainer.appendChild(descP);
		}



		// CTA buttons
		var ctaEl = document.getElementById('artwork-cta');
		ctaEl.innerHTML = '';
		ctaEl.style.display = 'flex';
		ctaEl.style.flexDirection = 'column';
		ctaEl.style.alignItems = 'flex-start';
		ctaEl.style.gap = '0.6rem';

		if (museum) {
			var musBtn = document.createElement('a');
			musBtn.className = 'btn btn--outline-dark';
			musBtn.href = '../museums/museum.html?id=' + museum.id;
			musBtn.innerHTML = '<span class="material-symbols-outlined">account_balance</span> ' + escapeHtml(museumName);
			ctaEl.appendChild(musBtn);
		}

		if (artist) {
			var artistBtn = document.createElement('a');
			artistBtn.className = 'btn btn--outline-dark';
			artistBtn.href = '../artists/artist.html?id=' + artist.id;
			artistBtn.innerHTML = '<span class="material-symbols-outlined">person</span> ' + escapeHtml(artistName);
			ctaEl.appendChild(artistBtn);
		}

		if (movement) {
			var movBtn = document.createElement('a');
			movBtn.className = 'btn btn--outline-dark';
			movBtn.href = '../movements/movement.html?id=' + movement.id;
			movBtn.innerHTML = '<span class="material-symbols-outlined">palette</span> ' + escapeHtml(movName);
			ctaEl.appendChild(movBtn);
		}

		// Right panel: movement color bg with artwork image
		var rightPanel = document.getElementById('artwork-right');
		rightPanel.style.background = movColor;

		var imageWrap = document.getElementById('artwork-image-wrap');
		imageWrap.innerHTML = '';

		var img = document.createElement('img');
		img.className = 'artwork-detail__full-image';
		img.src = artwork.imageUrl;
		img.alt = artwork.title;
		img.loading = 'lazy';
		imageWrap.appendChild(img);
	}).catch(function (err) {
		console.error('Failed to load artwork data:', err);
	});

	function escapeHtml(str) {
		var div = document.createElement('div');
		div.textContent = str;
		return div.innerHTML;
	}
})();
