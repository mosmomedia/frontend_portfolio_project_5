import Component from '../core/Component.js';
import FeedbackRating from './FeedbackRating.js';

export default class FeedbackForm extends Component {
	setup() {
		this.$state = {
			rating: 10,
			text: '',
			message: '',
		};
	}

	template() {
		return `
				<h2>How would you rate your service with us?</h2>
				<ul id='feedback-rating'></ul>
				<div>
					<input type="text" id="input-review"required placeholder='리뷰를 남겨주세요.' />
					<button type='submit'>등록하기</button>
				</div>
		`;
	}

	mounted() {
		const $feedbackRating = this.$target.querySelector('#feedback-rating');

		new FeedbackRating($feedbackRating, {
			getRating: this.getRating.bind(this),
			setState: this.setState.bind(this),
		});
	}

	getRating() {
		const { rating } = this.$state;

		return rating;
	}

	setEvent() {
		this.addEvent('keyup', '#input-review', ({ target: { value } }) => {
			this.setState({ text: value });
		});

		this.addEvent('click', 'button', (e) => {
			e.preventDefault();
			console.log(this.$state);
		});
	}
}
