import Component from '../core/Component.js';
import Spinner from './shared/Spinner.js';

export default class FeedbackList extends Component {
	setup() {
		this.$state = {
			isLoading: true,
		};
		const { fetchAllFeedback } = this.$props;
		// get feedbacks list from db
		fetchAllFeedback(this);
	}

	template() {
		const { getFeedbackList, getLoadingState } = this.$props;
		const isLoading = getLoadingState();
		const feedbackList = getFeedbackList();

		if (isLoading)
			return `
				<div id='spinner'></div>
		`;

		if (feedbackList.length === 0) return `<div>No Feedback</div>`;

		return feedbackList
			.map(({ rating, text, name }) => {
				return `
				<li class='feedback-item-card'>
					<div class='feedback-rating'>${rating}</div>
					<p class='feedback-text'>${text}</p>
				</li>`;
			})
			.join('');
	}

	mounted() {
		const { getLoadingState } = this.$props;
		const isLoading = getLoadingState();

		if (isLoading) {
			const $spinner = this.$target.querySelector('#spinner');
			new Spinner($spinner);
		}
	}
}
