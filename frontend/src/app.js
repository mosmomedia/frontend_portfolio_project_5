import Component from './core/Component.js';

import Header from './components/Header.js';
import About from './pages/About.js';
import Feedback from './pages/Feedback.js';
import SignIn from './pages/SignIn.js';

import NotFound from './components/shared/NotFound.js';

const routes = [
	{ path: '/', component: Feedback },
	{ path: '/about', component: About },
	{ path: '/sign-in', component: SignIn },
];

export default class App extends Component {
	template() {
		return `
			<header></header>
	    <main></main>
    `;
	}

	mounted() {
		const $header = this.$target.querySelector('header');
		new Header($header);

		window.addEventListener('DOMContentLoaded', () => {
			this.render();
		});

		window.addEventListener('popstate', () => {
			this.render();
		});
	}

	setEvent() {
		this.addEvent('click', '#navigation', (e) => {
			if (!e.target.matches('#navigation > li > a')) return;
			e.preventDefault();

			const path = e.target.getAttribute('href');

			window.history.pushState(null, null, path);
			this.render(path);
		});
	}

	render = (path) => {
		const _path = path ?? window.location.pathname;
		try {
			const component =
				routes.find((route) => route.path === _path)?.component || NotFound;
			const $main = this.$target.querySelector('main');
			const $navItem = this.$target.querySelectorAll('a');
			$navItem.forEach((element) => {
				const path = element.getAttribute('href');
				if (path === _path) {
					element.setAttribute('class', 'selectedNavItem');
				} else {
					if (element.className === 'selectedNavItem') {
						element.removeAttribute('class');
					}
				}
			});

			new component($main);
		} catch (err) {
			console.error(err);
		}
	};
}
