export default class Component {
	$target;
	$state;
	constructor($target) {
		this.$target = $target;
		this.setup();
		this.setEvent();
		this.render();
	}
	setup() {}
	mounted() {}
	template() {
		return '';
	}
	render() {
		this.$target.innerHTML = this.template();
		this.mounted();
	}

	setEvent() {}
	addEvent(eventType, selector, callback) {
		this.$target.addEventListener(eventType, (event) => {
			if (!event.target.closest(selector)) return false;
			callback(event);
		});
	}

	// setState (newState) {
	//   this.$state = { ...this.$state, ...newState };
	//   this.render();
	// }
}
