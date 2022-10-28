import Component from '../../core/Component.js';

export default class NotFound extends Component {
	template() {
		return `<div id='notfound'>
				<div>
				<h1>x 404 x</h1>
				<h2>페이지를 찾을 수가 없습니다.</h2>
				</div>
				<button>홈으로 이동하기</button>
		</div>`;
	}

	setEvent() {
		this.addEvent('click', 'button', (e) => {
			window.location.href = '/';
		});
	}
}
