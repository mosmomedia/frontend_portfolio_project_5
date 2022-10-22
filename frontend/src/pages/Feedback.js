import Component from '../core/Component.js';
import FeedbackForm from '../components/FeedbackForm.js';
import FeedbackStats from '../components/FeedbackStats.js';

export default class Feedback extends Component {
	setup() {
		this.$state = {
			isLoading: false,
		};
	}

	template() {
		const { isLoading } = this.$state;

		if (isLoading) {
			return 'Loading ...';
		} else {
			return `
		<div id='feedback'>
			<form id='feedback-form' class='card-header'></form>
			<div id='feedback-stats'></div>
		</div>`;
		}
	}

	mounted() {
		const { isLoading } = this.$state;
		if (isLoading) return;

		const $feedbackForm = this.$target.querySelector('#feedback-form');
		const $feedbackStats = this.$target.querySelector('#feedback-stats');
		new FeedbackForm($feedbackForm, { setState: this.setState.bind(this) });
		new FeedbackStats($feedbackStats);
	}
}
