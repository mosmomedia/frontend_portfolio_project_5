import Component from '../core/Component.js';

export default class Header extends Component {
	template() {
		return `
		<nav>
		<ul id="navigation">
			<li>
				<a href="/about">About</a>
			</li>
			<li><a href="/">Feedback</a></li>
			<li>
				<a href="/login">Login</a>
			</li>
		</ul>
	</nav>`;
	}
}
