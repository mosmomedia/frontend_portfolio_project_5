import Component from '../core/Component.js';
import FeedbackForm from '../components/FeedbackForm.js';
import FeedbackStats from '../components/FeedbackStats.js';

export default class Feedback extends Component {
	template() {
		return `
		<div id='feedback'>
			<form id='feedback-form' class='card-header'></form>
			<div id='feedback-stats'></div>
		</div>`;
	}

	mounted() {
		const $feedbackForm = this.$target.querySelector('#feedback-form');
		const $feedbackStats = this.$target.querySelector('#feedback-stats');
		new FeedbackForm($feedbackForm);
		new FeedbackStats($feedbackStats);
	}
}
