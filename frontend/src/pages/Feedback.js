import Component from '../core/Component.js';

import FeedbackForm from '../components/FeedbackForm.js';
import FeedbackList from '../components/FeedbackList.js';
import Spinner from '../components/shared/Spinner.js';

import {
	getAllFeedbacks,
	postFeedback,
} from '../contexts/feedback/FeedbackAction.js';

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
			<div id='feedback-list'></div>
		</div>`;
	}

	mounted() {
		const { isLoading } = this.$state;
		const {
			handleLoadingState,
			getLoadingState,
			getFeedbackList,
			fetchAllFeedback,
			createFeedback,
		} = this;

		if (isLoading) {
			const $spinner = this.$target.querySelector('#spinner');
			new Spinner($spinner);
		} else {
			const $feedbackForm = this.$target.querySelector('#feedback-form');
			const $feedbackList = this.$target.querySelector('#feedback-list');

			new FeedbackForm($feedbackForm, {
				handleLoadingState: handleLoadingState.bind(this),
				createFeedback: createFeedback.bind(this),
			});

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

		setTimeout(() => {
			this.setState(
				{ feedbackList: payload.reverse(), isLoading: false },
				'targetRender',
				target
			);
		}, 100);
	}

	async createFeedback(formData) {
		this.handleLoadingState(true);

		const { feedbackList } = this.$state;
		const newFeedback = await postFeedback(formData);

		const payload = [newFeedback, ...feedbackList];
		this.setState({
			feedbackList: payload,
			isLoading: false,
		});
	}
}
