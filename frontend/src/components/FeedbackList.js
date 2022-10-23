import Component from '../core/Component.js';

import FeedbackStats from '../components/FeedbackStats.js';

import Spinner from './shared/Spinner.js';

export default class FeedbackList extends Component {
	setup() {
		const { fetchAllFeedback } = this.$props;
		// get feedbacks list from db
		fetchAllFeedback(this);
	}

	template() {
		const { getFeedbackList, getLoadingState } = this.$props;
		const isLoading = getLoadingState();
		const feedbackList = getFeedbackList();
		const avrg = Math.round(
			feedbackList.reduce((acc, { rating }) => acc + rating, 0) /
				feedbackList.length
		);

		if (isLoading)
			return `
				<div id='spinner'></div>
		`;

		if (feedbackList.length === 0) return `<div>No Feedback</div>`;

		return `
		<div id='feedback-stats'></div>
		<ul>
		${feedbackList
			.map(({ rating, text, name }) => {
				return `
				<li class='feedback-item-card'>
					<div class='feedback-rating'>${rating}</div>
					<p class='feedback-text'>${text}</p>
				</li>`;
			})
			.join('')}
		</ul>
		`;
	}

	mounted() {
		const { getLoadingState, getFeedbackList } = this.$props;
		const isLoading = getLoadingState();

		if (isLoading) {
			const $spinner = this.$target.querySelector('#spinner');
			return new Spinner($spinner);
		}

		const $feedbackStats = this.$target.querySelector('#feedback-stats');
		if ($feedbackStats) {
			new FeedbackStats($feedbackStats, { feedbackList: getFeedbackList() });
		}
	}
}
