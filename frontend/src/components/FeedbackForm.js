import Component from '../core/Component.js';
import FeedbackRating from './FeedbackRating.js';

export default class FeedbackForm extends Component {
	setup() {
		this.$state = {
			rating: 10,
			text: '',
			isDisabled: true,
		};
	}

	template() {
		return `
				<h2>How would you rate your service with us?</h2>
				<ul id='feedback-rating'></ul>
				<div id='feedback-submit'>
					<input type="text" id="input-text"required placeholder='리뷰를 남겨주세요.' />
					<button id='feedback-btn' class='diabledBtn' type='submit' disabled>등록하기</button>
				</div>
				<div id='feedback-message'></div>
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
		this.addEvent('keyup', '#input-text', ({ target: { value } }) => {
			const $feedbackSubmitBtn = this.$target.querySelector('#feedback-btn');
			const $feedbackMsg = this.$target.querySelector('#feedback-message');
			if (value === '') {
				this.setState({ isDisabled: true }, 'stopRender');
				$feedbackSubmitBtn.setAttribute('class', 'diabledBtn');
				$feedbackSubmitBtn.setAttribute('disabled', 'true');
				$feedbackMsg.innerText = '';
			} else if (value.length < 2) {
				this.setState({ isDisabled: true }, 'stopRender');
				$feedbackSubmitBtn.setAttribute('class', 'diabledBtn');
				$feedbackSubmitBtn.setAttribute('disabled', 'true');
				$feedbackMsg.innerText = '최소 10자 이상을 입력하세요.';
			} else {
				this.setState({ isDisabled: false }, 'stopRender');
				$feedbackSubmitBtn.removeAttribute('class');
				$feedbackSubmitBtn.removeAttribute('disabled');
				$feedbackMsg.innerText = '';
			}
			this.setState({ text: value }, 'stopRender');
		});

		this.addEvent('click', 'button', (e) => {
			e.preventDefault();
			const { rating, text, isDisabled } = this.$state;
			if (rating && text && !isDisabled) {
				console.log(rating, text, isDisabled);
			}
		});
	}
}
