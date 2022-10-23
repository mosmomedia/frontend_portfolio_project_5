import Component from '../core/Component.js';

export default class FeedbackItem extends Component {
	template() {
		const { rating, text } = this.$props;

		return `
		<div class='feedback-rating'>${rating}</div>
		<button class='feedback-btn-edit' type='submit'>
			<i class="fa-regular fa-pen-to-square"></i>
		</button> 
		<button class='feedback-btn-delete'>
			<i class="fa-solid fa-xmark"></i>
		</button> 
		<p class='feedback-text'>${text}</p>
		`;
	}

	setEvent() {
		this.addEvent('click', '.feedback-btn-edit', (e) => {
			const { rating, text } = this.$props;
			console.log(rating, text);
		});

		this.addEvent('click', '.feedback-btn-delete', async (e) => {
			const { _id, removeFeedback } = this.$props;
			await removeFeedback(_id);
		});
	}
}
