/**
 * nav.js – Shared navigation toggle logic
 * Include this on every page that uses the top-nav component.
 */
(function () {
	const bodyEl = document.body;
	const topNavEl = document.getElementById('top');
	const menuToggleEl = document.getElementById('menu-toggle');
	const navLinkEls = document.querySelectorAll('.nav-links a');

	if (!topNavEl || !menuToggleEl) return;

	function closeMenu() {
		topNavEl.classList.remove('is-menu-open');
		bodyEl.classList.remove('is-menu-open');
		menuToggleEl.setAttribute('aria-expanded', 'false');
		menuToggleEl.setAttribute('aria-label', 'Open menu');
	}

	function toggleMenu() {
		const willOpen = !topNavEl.classList.contains('is-menu-open');
		topNavEl.classList.toggle('is-menu-open', willOpen);
		bodyEl.classList.toggle('is-menu-open', willOpen);
		menuToggleEl.setAttribute('aria-expanded', String(willOpen));
		menuToggleEl.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
	}

	menuToggleEl.addEventListener('click', toggleMenu);

	navLinkEls.forEach(function (link) {
		link.addEventListener('click', closeMenu);
	});

	document.addEventListener('click', function (event) {
		if (!topNavEl.contains(event.target)) {
			closeMenu();
		}
	});

	window.addEventListener('resize', function () {
		if (window.innerWidth > 800) {
			closeMenu();
		}
	});
})();
