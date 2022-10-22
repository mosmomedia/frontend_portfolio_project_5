import Component from '../core/Component.js';
import FeedbackForm from '../components/FeedbackForm.js';
import FeedbackStats from '../components/FeedbackStats.js';
import FeedbackList from '../components/FeedbackList.js';

import Spinner from '../components/shared/Spinner.js';

import { getAllFeedbacks } from '../contexts/feedback/FeedbackAction.js';

export default class Feedback extends Component {
	setup() {
		this.$state = {
			isLoading: false,
			feedbackList: [],
		};
	}

	template() {
		const { isLoading } = this.$state;

		if (isLoading)
			return `
			<div id='spinner'></div>
			`;

		return `
		<div id='feedback'>
			<form id='feedback-form' class='card-header'></form>
			<div id='feedback-stats'></div>
			<ul id='feedback-list'></ul>
		</div>`;
	}

	mounted() {
		const { isLoading } = this.$state;
		const {
			handleLoadingState,
			getLoadingState,
			getFeedbackList,
			fetchAllFeedback,
		} = this;

		if (isLoading) {
			const $spinner = this.$target.querySelector('#spinner');
			new Spinner($spinner);
		} else {
			const $feedbackForm = this.$target.querySelector('#feedback-form');
			const $feedbackStats = this.$target.querySelector('#feedback-stats');
			const $feedbackList = this.$target.querySelector('#feedback-list');

			new FeedbackForm($feedbackForm, {
				handleLoadingState: handleLoadingState.bind(this),
			});
			new FeedbackStats($feedbackStats);
			new FeedbackList($feedbackList, {
				getFeedbackList: getFeedbackList.bind(this),
				getLoadingState: getLoadingState.bind(this),
				fetchAllFeedback: fetchAllFeedback.bind(this),
			});
		}
	}

	handleLoadingState(boolean) {
		this.setState({ isLoading: boolean });
	}

	getLoadingState() {
		return this.$state.isLoading;
	}

	getFeedbackList() {
		return this.$state.feedbackList;
	}

	async fetchAllFeedback(target) {
		this.setState({ isLoading: true }, 'stopRender');
		const payload = await getAllFeedbacks();
		this.setState(
			{ feedbackList: payload, isLoading: false },
			'targetRender',
			target
		);
	}
}
