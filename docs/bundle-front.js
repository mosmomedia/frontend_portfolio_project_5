/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./frontend/src/core/Component.js
class Component {
	$target;
	$state;
	$props;
	constructor($target, $props) {
		this.$target = $target;
		this.$props = $props;
		this.setup();
		this.setEvent();
		this.render();
	}
	setup() {}
	mounted() {}
	template() {
		return '';
	}
	render(type, target) {
		if (type === 'targetRender') {
			target.render();
		} else {
			this.$target.innerHTML = this.template();
			this.mounted();
		}
	}

	setEvent() {}

	addEvent(eventType, selector, callback) {
		this.$target.addEventListener(eventType, (event) => {
			if (!event.target.closest(selector)) return false;
			callback(event);
		});
	}

	setState(newState, type, target) {
		this.$state = { ...this.$state, ...newState };
		if (type !== 'stopRender') {
			this.render(type, target);
		}
	}
}

;// CONCATENATED MODULE: ./frontend/src/components/shared/NotFound.js


class NotFound extends Component {
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

;// CONCATENATED MODULE: ./frontend/src/components/Header.js


class Header extends Component {
	template() {
		const { getState } = this.$props;
		const { user } = getState();
		return `
		<nav>
		<ul id="navigation">
			<li>
				<a href="/about">About</a>
			</li>
			<li><a href="/">Feedback</a></li>
			${
				user
					? '<li><button class="btn-logout">Logout</button></li>'
					: '<li><a href="/sign-in">Login</a></li>'
			}
			
		</ul>
	</nav>`;
	}

	setEvent() {
		this.addEvent('click', '.btn-logout', (e) => {
			const { handleLogout } = this.$props;
			handleLogout();
			this.render();
		});
	}
}

;// CONCATENATED MODULE: ./frontend/src/pages/About.js


class About extends Component {
	template() {
		return `
			<div id='about' class='card-header'>
				<div>
					<h1 >About This Project</h1>
					<p>This is a React app to leave feedback for a product or service</p>
					<p>
						This is the project based from one of bradtraversy's udemy courses,
						"React Front To Back 2022".
					</p>
					<p>Version: 0.1.0</p>
			</div>
		`;
	}
}

;// CONCATENATED MODULE: ./frontend/src/components/FeedbackRating.js


class FeedbackRating extends Component {
	template() {
		const { getRating } = this.$props;
		const rating = getRating();

		return `
		${Array.from({ length: 10 }, (_, idx) => {
			return `<li>
				<input class='feeback-rating-item' type='radio' name='rating'
				id='num${idx + 1}'
				value='${idx + 1}'
				${rating === idx + 1 && 'checked'}
				/>
				<label for='num${idx + 1}'>
					${idx + 1}
				</label>
		</li>`;
		}).join(' ')}
		`;
	}

	setEvent() {
		this.addEvent('change', 'input[type=radio]', ({ target: { value } }) => {
			const { setState } = this.$props;
			setState({ rating: +value }, 'targetRender', this);
		});
	}
}

;// CONCATENATED MODULE: ./frontend/src/components/FeedbackForm.js



class FeedbackForm extends Component {
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

		// input focus
		this.handleInputFocus();
	}

	getRating() {
		const { rating } = this.$state;
		return rating;
	}

	setEvent() {
		// input text
		this.handleInputEvent();

		// submit
		this.handleSubmitEvent();
	}

	handleInputFocus() {
		const $inputFocus = this.$target.querySelector('#input-text');

		$inputFocus.onfocus = (e) => {
			const { getState } = this.$props;
			const { user } = getState();
			if (!user) {
				const $feedbackMsg = this.$target.querySelector('#feedback-message');
				$feedbackMsg.innerText = '로그인이 필요한 서비스 입니다.';
				e.target.blur();
				setTimeout(() => {
					$feedbackMsg.innerText = '';
				}, 1500);
			}
		};
	}

	handleInputEvent() {
		this.addEvent('keyup', '#input-text', ({ target: { value } }) => {
			const $feedbackSubmitBtn = this.$target.querySelector('#feedback-btn');
			const $feedbackMsg = this.$target.querySelector('#feedback-message');
			if (value === '') {
				this.setState({ isDisabled: true }, 'stopRender');
				$feedbackSubmitBtn.setAttribute('class', 'diabledBtn');
				$feedbackSubmitBtn.setAttribute('disabled', 'true');
				$feedbackMsg.innerText = '';
			} else if (value.length < 10) {
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
	}

	handleSubmitEvent() {
		this.addEvent('click', 'button', async (e) => {
			e.preventDefault();
			const { rating, text, isDisabled } = this.$state;
			if (rating && text && !isDisabled) {
				const { createFeedback, getState } = this.$props;
				const {
					user: { _id },
				} = getState();
				const formData = { rating, text, _id };
				await createFeedback(formData);
			}
		});
	}
}

;// CONCATENATED MODULE: ./frontend/src/components/FeedbackStats.js


class FeedbackStats extends Component {
	template() {
		const { feedbackList } = this.$props;

		const avrg = Math.round(
			feedbackList.reduce((acc, { rating }) => acc + rating, 0) /
				feedbackList.length
		);

		return `
		<div>
		${feedbackList.length}
		${feedbackList.length === 1 ? 'Review' : 'Reviews'}
		</div>
		<div>Average Rating:
		${!isNaN(avrg) && feedbackList.length > 0 && avrg}
		</div>
		`;
	}
}

;// CONCATENATED MODULE: ./frontend/src/components/FeedbackItem.js


class FeedbackItem extends Component {
	template() {
		const currentUser = JSON.parse(localStorage.getItem('user'));

		const { rating, text, user } = this.$props;

		return `
		<div class='feedback-rating'>${rating}</div>
		${
			currentUser && user && currentUser._id === user._id
				? `
				<button class="feedback-btn-edit" type="submit">
					<i class="fa-regular fa-pen-to-square"></i>
				</button> 
				<button class="feedback-btn-delete">
					<i class="fa-solid fa-xmark"></i>
				</button>`
				: ''
		}
		<p class='feedback-text'>${text}</p>
		`;
	}

	setEvent() {
		this.addEvent('click', '.feedback-btn-edit', (e) => {
			const { rating, text, _id, switchEditMode, setCurrentFeedback } =
				this.$props;

			const currentFeedback = { rating, text, _id };

			setCurrentFeedback(currentFeedback);

			switchEditMode();
		});

		this.addEvent('click', '.feedback-btn-delete', async (e) => {
			const { _id, removeFeedback } = this.$props;
			await removeFeedback(_id);
		});
	}
}

;// CONCATENATED MODULE: ./frontend/src/components/shared/Spinner.js


class Spinner extends Component {
	template() {
		return `
			<div id='loadingSpinnerContainer'>
				<div id='loadingSpinner'></div>
			</div>
			`;
	}
}

;// CONCATENATED MODULE: ./frontend/src/components/FeedbackList.js







class FeedbackList extends Component {
	setup() {
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

		if (feedbackList.length === 0)
			return `<div id='feedback-empty'>No Feedbacks Yet</div>`;

		return `
		<div id='feedback-stats'></div>
		<ul>
		${feedbackList
			.map((_, idx) => {
				return `
				<li class='feedback-item-card' data-id=${idx}></li>`;
			})
			.join('')}
		</ul>
		`;
	}

	mounted() {
		const {
			setCurrentFeedback,
			switchEditMode,
			getLoadingState,
			getFeedbackList,
			removeFeedback,
		} = this.$props;
		const isLoading = getLoadingState();

		if (isLoading) {
			const $spinner = this.$target.querySelector('#spinner');
			return new Spinner($spinner);
		}

		const $feedbackStats = this.$target.querySelector('#feedback-stats');
		if ($feedbackStats) {
			new FeedbackStats($feedbackStats, { feedbackList: getFeedbackList() });
		}

		const $feedbackItems = this.$target.querySelectorAll('.feedback-item-card');
		if ($feedbackItems.length > 0) {
			const feedbackList = getFeedbackList();
			$feedbackItems.forEach((e) => {
				new FeedbackItem(e, {
					...feedbackList[e.dataset.id],
					setCurrentFeedback,
					switchEditMode,
					removeFeedback,
				});
			});
		}
	}
}

;// CONCATENATED MODULE: ./frontend/src/components/FeedbackEditForm.js


class FeedbackEditForm extends FeedbackForm {
	setup() {
		const { getCurrentFeedback } = this.$props;
		const { rating, text, _id } = getCurrentFeedback();

		this.$state = {
			rating,
			text,
			_id,
			isDisabled: false,
		};
	}

	template() {
		const { text } = this.$state;
		return `
		<form id='feedback-form' class='card-header'>
		<h2>남기신 리뷰를 수정 하시겠습니까?</h2>
		<ul id='feedback-rating'></ul>
		<div id='feedback-submit'>
			<input type="text" id="input-text"required placeholder='리뷰를 남겨주세요.' value='${text}' />
			<button id='feedback-btn' type='submit'>수정하기</button>
		</div>
		<div id='feedback-message'></div>
		</form>
		`;
	}

	getRating() {
		const { rating } = this.$state;
		return rating;
	}

	handleSubmitEvent() {
		this.addEvent('click', 'button', async (e) => {
			e.preventDefault();
			const { rating, text, isDisabled, _id } = this.$state;
			if (rating && text && !isDisabled) {
				const { editFeedback } = this.$props;
				const formData = { rating, text };
				await editFeedback(formData, _id);
			}
		});
	}
}

;// CONCATENATED MODULE: ./frontend/src/contexts/feedback/FeedbackAction.js
const API_URL = 'api/feedback/';

//  get all feedback
const getAllFeedbacks = async () => {
	try {
		const res = await fetch(API_URL, {
			headers: {
				Accept: 'application/json',
			},
		});
		const feedbackList = await res.json();
		return feedbackList;
	} catch (error) {
		console.log('Failure : fetching feedback list', error);
		return error;
	}
};

// create a feedback
const postFeedback = async (formData) => {
	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		const newFeedback = await res.json();
		return newFeedback;
	} catch (error) {
		console.log('Failure : create a new feedback ', error);
		return error;
	}
};

//  update a feedback
const updateFeedback = async (formData, id) => {
	try {
		// const res = await axios.put(API_URL + id, formData);

		const res = await fetch(API_URL + id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		const updatedFeedback = await res.json();
		return updatedFeedback;
	} catch (error) {
		console.log('Failure : update a feedback ', error);
		return error;
	}
};

//  delete a feedback
const deleteFeedback = async (id) => {
	try {
		const res = await fetch(API_URL + id, { method: 'DELETE' });
		const deletedState = await res.json();
		return deletedState;
	} catch (error) {
		console.log('Failure : delete a feedback ', error);
		return error;
	}
};

;// CONCATENATED MODULE: ./frontend/src/pages/Feedback.js










class Feedback extends Component {
	setup() {
		this.$state = {
			isLoading: false,
			feedbackList: [],
			currentFeedback: null,
			editMode: false,
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
		const { isLoading, editMode } = this.$state;
		const { getState } = this.$props;
		const {
			getCurrentFeedback,
			setCurrentFeedback,
			switchEditMode,
			getLoadingState,
			getFeedbackList,
			fetchAllFeedback,
			createFeedback,
			editFeedback,
			removeFeedback,
		} = this;

		if (isLoading) {
			const $spinner = this.$target.querySelector('#spinner');
			new Spinner($spinner);
		} else if (editMode) {
			const $feedback = this.$target.querySelector('#feedback');
			new FeedbackEditForm($feedback, {
				getCurrentFeedback: getCurrentFeedback.bind(this),
				editFeedback: editFeedback.bind(this),
			});
		} else {
			const $feedbackForm = this.$target.querySelector('#feedback-form');
			const $feedbackList = this.$target.querySelector('#feedback-list');

			new FeedbackForm($feedbackForm, {
				createFeedback: createFeedback.bind(this),
				getState: getState,
			});

			new FeedbackList($feedbackList, {
				setCurrentFeedback: setCurrentFeedback.bind(this),
				getFeedbackList: getFeedbackList.bind(this),
				getLoadingState: getLoadingState.bind(this),
				switchEditMode: switchEditMode.bind(this),
				fetchAllFeedback: fetchAllFeedback.bind(this),
				removeFeedback: removeFeedback.bind(this),
				getState: getState,
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

	getCurrentFeedback() {
		return this.$state.currentFeedback;
	}

	setCurrentFeedback(currentFeedback) {
		this.setState({ currentFeedback }, 'stopRender');
	}

	switchEditMode() {
		const { editMode } = this.$state;
		this.setState({ editMode: !editMode });
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

		setTimeout(() => {
			this.setState({
				feedbackList: payload,
				isLoading: false,
			});
		}, 200);
	}

	async editFeedback(formData, id) {
		this.handleLoadingState(true);
		const updatedFeedback = await updateFeedback(formData, id);
		const { feedbackList } = this.$state;
		const payload = feedbackList.map((feedback) => {
			if (feedback._id === id) {
				return updatedFeedback;
			} else {
				return feedback;
			}
		});
		setTimeout(() => {
			this.setState({
				feedbackList: payload,
				isLoading: false,
				editMode: false,
			});
		}, 200);
	}

	async removeFeedback(id) {
		if (window.confirm('Are you sure?')) {
			this.handleLoadingState(true);
			const { success } = await deleteFeedback(id);
			if (success) {
				const { feedbackList } = this.$state;
				const payload = feedbackList.filter((item) => item._id !== id);

				setTimeout(() => {
					this.setState({
						feedbackList: payload,
						isLoading: false,
					});
				}, 200);
			}
		}
	}
}

;// CONCATENATED MODULE: ./frontend/src/pages/SignIn.js


class SignIn extends Component {
	setup() {
		this.$state = {
			email: '',
			password: '',
		};
	}

	template() {
		return `
		<div id='feedback-auth'>
				<h2>환영합니다!</h2>
				<form>
					<input 
						id='email'
						type="email"
						name="email"
						placeholder="Email"
					/>
					<input 
					id='password'
					type="password"
					name="password"
					autocomplete=''
					placeholder="Password"
				/>
				<button id='auth-button' type='submit' disabled class='disabledBtn'>
					로그인
				</button>
				</form>
				<div id='link-signup'>
					<a href="/sign-up">회원가입</a>
				</div>
		</div>
		`;
	}

	setEvent() {
		this.addEvent('keyup', 'input', ({ target: { id, value } }) => {
			const $authSubmitBtn = this.$target.querySelector('#auth-button');

			this.setState({ [id]: value }, 'stopRender');

			const { email, password } = this.$state;

			if (email && password) {
				$authSubmitBtn.removeAttribute('disabled');
				$authSubmitBtn.removeAttribute('class');
			} else {
				$authSubmitBtn.setAttribute('disabled', 'true');
				$authSubmitBtn.setAttribute('class', 'disabledBtn');
			}
		});

		this.addEvent('click', 'button', async (e) => {
			e.preventDefault();
			const { email, password } = this.$state;
			if (email && password) {
				const { handleLogin } = this.$props;
				await handleLogin({ email, password });
				this.setState({ email: '', password: '' });
			}
		});
	}
}

;// CONCATENATED MODULE: ./frontend/src/pages/SignUp.js


class Signup extends Component {
	setup() {
		this.$state = {
			email: '',
			password: '',
			password2: '',
			name: '',
		};
	}

	template() {
		return `
		<div id='feedback-auth'>
			<h2>회원 가입</h2>
			<form>
				<label for='email'>
					이메일
				</label>
				<input 
					id='email'
					type="email"
					name="email"
					placeholder="Email"
				/>
				
				<label for='name'>
					이름
				</label>
				<input 
					id='name'
					type="name"
					name="name"
					placeholder="Name"
				/>

				<label for='password'>
					비밀번호
				</label>
				<input 
				id='password'
				type="password"
				name="password"
				autocomplete=''
				placeholder="Password"
				/>

				<label for='password2'>
					비밀번호 확인
				</label>
				<input 
				id='password2'
				type="password"
				name="password2"
				autocomplete=''
				placeholder="Confirm Password"
				/>

				
			<button id='auth-button' type='submit' disabled class='disabledBtn'>
				가입하기
			</button>
			</form>
			<div id='link-signup'>
				<a href="/sign-in">로그인</a>
			</div>
		</div>
		`;
	}

	setEvent() {
		this.addEvent('keyup', 'input', ({ target: { id, value } }) => {
			const $authSubmitBtn = this.$target.querySelector('#auth-button');

			this.setState({ [id]: value }, 'stopRender');

			const { email, name, password, password2 } = this.$state;

			if ((email, name, password, password2)) {
				$authSubmitBtn.removeAttribute('disabled');
				$authSubmitBtn.removeAttribute('class');
			} else {
				$authSubmitBtn.setAttribute('disabled', 'true');
				$authSubmitBtn.setAttribute('class', 'disabledBtn');
			}
		});

		this.addEvent('click', 'button', async (e) => {
			e.preventDefault();
			const { email, name, password, password2 } = this.$state;
			if (password !== password2) {
				alert('비밀번호를 확인해주세요.');
			} else {
				if (email && name && password) {
					const { handleRegister } = this.$props;
					await handleRegister({ email, password, name });
					this.setState({ email: '', password: '', name: '' });
				}
			}
		});
	}
}

;// CONCATENATED MODULE: ./frontend/src/contexts/auth/AuthAction.js
const AuthAction_API_URL = 'api/auth/';

// Login user
const loginUser = async (userData) => {
	try {
		const res = await fetch(AuthAction_API_URL + 'login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		});

		if (res.ok) {
			const user = await res.json();
			localStorage.setItem('user', JSON.stringify(user));
			return { success: true, data: user };
		} else {
			const err = await res.json();
			return { success: false, data: err };
		}
	} catch (error) {
		return { success: false, data: error };
	}
};

// Sigin up user

const registerUser = async (userData) => {
	try {
		const res = await fetch(AuthAction_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		});

		if (res.ok) {
			const newUser = await res.json();
			localStorage.setItem('user', JSON.stringify(newUser));
			return { success: true, data: newUser };
		} else {
			const err = await res.json();
			return { success: false, data: err };
		}
	} catch (error) {
		return { success: false, data: error.response.data };
	}
};

;// CONCATENATED MODULE: ./frontend/src/App.js











const routes = [
	{ path: '/', component: Feedback },
	{ path: '/about', component: About },
	{ path: '/sign-in', component: SignIn },
	{ path: '/sign-up', component: Signup },
];

class App extends Component {
	setup() {
		const user = JSON.parse(localStorage.getItem('user'));
		this.$state = {
			user: user ? user : null,
			isError: false,
			isSuccess: false,
			isLoading: false,
			message: '',
		};
	}

	template() {
		return `
			<header></header>
	    <main></main>
    `;
	}

	mounted() {
		const $header = this.$target.querySelector('header');
		const { getState, handleLogout } = this;
		new Header($header, {
			getState: getState.bind(this),
			handleLogout: handleLogout.bind(this),
		});

		window.addEventListener('DOMContentLoaded', () => {
			this.render();
		});

		window.addEventListener('popstate', () => {
			this.render();
		});
	}

	render = (path) => {
		const _path = path ?? window.location.pathname;
		try {
			const component =
				routes.find((route) => route.path === _path)?.component || null;

			const $main = this.$target.querySelector('main');

			// wrong routes
			if (component === null) {
				return new NotFound($main);
			}

			const $navItem = this.$target.querySelectorAll('a');

			$navItem.forEach((element) => {
				const path = element.getAttribute('href');
				if (path === _path) {
					element.setAttribute('class', 'selectedNavItem');
				} else {
					if (element.className === 'selectedNavItem') {
						element.removeAttribute('class');
					}
				}
			});

			const { user, isSuccess } = this.$state;
			if (
				(_path === '/sign-in' || _path === '/sign-up') &&
				(user || isSuccess)
			) {
				window.location.href = '/';
			} else {
				const { handleLogin, handleRegister, getState } = this;

				new component($main, {
					handleLogin: handleLogin.bind(this),
					handleRegister: handleRegister.bind(this),
					getState: getState.bind(this),
				});
			}
		} catch (err) {
			console.error(err);
		}
	};

	setEvent() {
		this.addEvent('click', '#navigation', (e) => {
			if (!e.target.matches('#navigation > li > a')) return;
			e.preventDefault();

			const path = e.target.getAttribute('href');

			window.history.pushState(null, null, path);
			this.render(path);
		});
	}

	getState() {
		return this.$state;
	}

	async handleLogin(formData) {
		const payload = await loginUser(formData);
		const { success, data } = payload;
		if (success) {
			this.setState({ user: data, isSuccess: true });
		} else {
			alert(data);
		}
	}

	async handleRegister(formData) {
		const payload = await registerUser(formData);
		const { success, data } = payload;

		if (success) {
			this.setState({ user: data, isSuccess: true });
		} else {
			alert(data);
		}
	}

	async handleLogout() {
		localStorage.removeItem('user');
		this.setState({ user: null }, 'stopRender');
		window.location.href = '/';
	}
}

;// CONCATENATED MODULE: ./frontend/src/index.js



new App(document.querySelector('#app'));

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUosV0FBVyxrQkFBa0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxZQUFZLHdDQUF3Qzs7QUFFcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCLFNBQVM7QUFDakMsVUFBVSxnQkFBZ0I7QUFDMUI7QUFDQSxtQkFBbUIsNkJBQTZCO0FBQ2hELElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsWUFBWTtBQUNwQyxVQUFVLGdCQUFnQjs7QUFFMUI7QUFDQSxtQkFBbUIsNkJBQTZCO0FBQ2hELElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTs7O0FDOUkyQjtBQUNFOztBQUU3QixJQUFJLEdBQUciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9jb3JlL0NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9jb21wb25lbnRzL3NoYXJlZC9Ob3RGb3VuZC5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9jb21wb25lbnRzL0hlYWRlci5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9wYWdlcy9BYm91dC5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9jb21wb25lbnRzL0ZlZWRiYWNrUmF0aW5nLmpzIiwid2VicGFjazovLzdfcG9ydGZvbGlvX3YyLy4vZnJvbnRlbmQvc3JjL2NvbXBvbmVudHMvRmVlZGJhY2tGb3JtLmpzIiwid2VicGFjazovLzdfcG9ydGZvbGlvX3YyLy4vZnJvbnRlbmQvc3JjL2NvbXBvbmVudHMvRmVlZGJhY2tTdGF0cy5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9jb21wb25lbnRzL0ZlZWRiYWNrSXRlbS5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9jb21wb25lbnRzL3NoYXJlZC9TcGlubmVyLmpzIiwid2VicGFjazovLzdfcG9ydGZvbGlvX3YyLy4vZnJvbnRlbmQvc3JjL2NvbXBvbmVudHMvRmVlZGJhY2tMaXN0LmpzIiwid2VicGFjazovLzdfcG9ydGZvbGlvX3YyLy4vZnJvbnRlbmQvc3JjL2NvbXBvbmVudHMvRmVlZGJhY2tFZGl0Rm9ybS5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9jb250ZXh0cy9mZWVkYmFjay9GZWVkYmFja0FjdGlvbi5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9wYWdlcy9GZWVkYmFjay5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9wYWdlcy9TaWduSW4uanMiLCJ3ZWJwYWNrOi8vN19wb3J0Zm9saW9fdjIvLi9mcm9udGVuZC9zcmMvcGFnZXMvU2lnblVwLmpzIiwid2VicGFjazovLzdfcG9ydGZvbGlvX3YyLy4vZnJvbnRlbmQvc3JjL2NvbnRleHRzL2F1dGgvQXV0aEFjdGlvbi5qcyIsIndlYnBhY2s6Ly83X3BvcnRmb2xpb192Mi8uL2Zyb250ZW5kL3NyYy9BcHAuanMiLCJ3ZWJwYWNrOi8vN19wb3J0Zm9saW9fdjIvLi9mcm9udGVuZC9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblx0JHRhcmdldDtcblx0JHN0YXRlO1xuXHQkcHJvcHM7XG5cdGNvbnN0cnVjdG9yKCR0YXJnZXQsICRwcm9wcykge1xuXHRcdHRoaXMuJHRhcmdldCA9ICR0YXJnZXQ7XG5cdFx0dGhpcy4kcHJvcHMgPSAkcHJvcHM7XG5cdFx0dGhpcy5zZXR1cCgpO1xuXHRcdHRoaXMuc2V0RXZlbnQoKTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9XG5cdHNldHVwKCkge31cblx0bW91bnRlZCgpIHt9XG5cdHRlbXBsYXRlKCkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXHRyZW5kZXIodHlwZSwgdGFyZ2V0KSB7XG5cdFx0aWYgKHR5cGUgPT09ICd0YXJnZXRSZW5kZXInKSB7XG5cdFx0XHR0YXJnZXQucmVuZGVyKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuJHRhcmdldC5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKCk7XG5cdFx0XHR0aGlzLm1vdW50ZWQoKTtcblx0XHR9XG5cdH1cblxuXHRzZXRFdmVudCgpIHt9XG5cblx0YWRkRXZlbnQoZXZlbnRUeXBlLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcblx0XHR0aGlzLiR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIChldmVudCkgPT4ge1xuXHRcdFx0aWYgKCFldmVudC50YXJnZXQuY2xvc2VzdChzZWxlY3RvcikpIHJldHVybiBmYWxzZTtcblx0XHRcdGNhbGxiYWNrKGV2ZW50KTtcblx0XHR9KTtcblx0fVxuXG5cdHNldFN0YXRlKG5ld1N0YXRlLCB0eXBlLCB0YXJnZXQpIHtcblx0XHR0aGlzLiRzdGF0ZSA9IHsgLi4udGhpcy4kc3RhdGUsIC4uLm5ld1N0YXRlIH07XG5cdFx0aWYgKHR5cGUgIT09ICdzdG9wUmVuZGVyJykge1xuXHRcdFx0dGhpcy5yZW5kZXIodHlwZSwgdGFyZ2V0KTtcblx0XHR9XG5cdH1cbn1cbiIsImltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vLi4vY29yZS9Db21wb25lbnQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RGb3VuZCBleHRlbmRzIENvbXBvbmVudCB7XG5cdHRlbXBsYXRlKCkge1xuXHRcdHJldHVybiBgPGRpdiBpZD0nbm90Zm91bmQnPlxuXHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8aDE+eCA0MDQgeDwvaDE+XG5cdFx0XHRcdDxoMj7tjpjsnbTsp4Drpbwg7LC+7J2EIOyImOqwgCDsl4bsirXri4jri6QuPC9oMj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxidXR0b24+7ZmI7Jy866GcIOydtOuPme2VmOq4sDwvYnV0dG9uPlxuXHRcdDwvZGl2PmA7XG5cdH1cblxuXHRzZXRFdmVudCgpIHtcblx0XHR0aGlzLmFkZEV2ZW50KCdjbGljaycsICdidXR0b24nLCAoZSkgPT4ge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG5cdFx0fSk7XG5cdH1cbn1cbiIsImltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29yZS9Db21wb25lbnQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXHR0ZW1wbGF0ZSgpIHtcblx0XHRjb25zdCB7IGdldFN0YXRlIH0gPSB0aGlzLiRwcm9wcztcblx0XHRjb25zdCB7IHVzZXIgfSA9IGdldFN0YXRlKCk7XG5cdFx0cmV0dXJuIGBcblx0XHQ8bmF2PlxuXHRcdDx1bCBpZD1cIm5hdmlnYXRpb25cIj5cblx0XHRcdDxsaT5cblx0XHRcdFx0PGEgaHJlZj1cIi9hYm91dFwiPkFib3V0PC9hPlxuXHRcdFx0PC9saT5cblx0XHRcdDxsaT48YSBocmVmPVwiL1wiPkZlZWRiYWNrPC9hPjwvbGk+XG5cdFx0XHQke1xuXHRcdFx0XHR1c2VyXG5cdFx0XHRcdFx0PyAnPGxpPjxidXR0b24gY2xhc3M9XCJidG4tbG9nb3V0XCI+TG9nb3V0PC9idXR0b24+PC9saT4nXG5cdFx0XHRcdFx0OiAnPGxpPjxhIGhyZWY9XCIvc2lnbi1pblwiPkxvZ2luPC9hPjwvbGk+J1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0PC91bD5cblx0PC9uYXY+YDtcblx0fVxuXG5cdHNldEV2ZW50KCkge1xuXHRcdHRoaXMuYWRkRXZlbnQoJ2NsaWNrJywgJy5idG4tbG9nb3V0JywgKGUpID0+IHtcblx0XHRcdGNvbnN0IHsgaGFuZGxlTG9nb3V0IH0gPSB0aGlzLiRwcm9wcztcblx0XHRcdGhhbmRsZUxvZ291dCgpO1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9KTtcblx0fVxufVxuIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb3JlL0NvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFib3V0IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0dGVtcGxhdGUoKSB7XG5cdFx0cmV0dXJuIGBcblx0XHRcdDxkaXYgaWQ9J2Fib3V0JyBjbGFzcz0nY2FyZC1oZWFkZXInPlxuXHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdDxoMSA+QWJvdXQgVGhpcyBQcm9qZWN0PC9oMT5cblx0XHRcdFx0XHQ8cD5UaGlzIGlzIGEgUmVhY3QgYXBwIHRvIGxlYXZlIGZlZWRiYWNrIGZvciBhIHByb2R1Y3Qgb3Igc2VydmljZTwvcD5cblx0XHRcdFx0XHQ8cD5cblx0XHRcdFx0XHRcdFRoaXMgaXMgdGhlIHByb2plY3QgYmFzZWQgZnJvbSBvbmUgb2YgYnJhZHRyYXZlcnN5J3MgdWRlbXkgY291cnNlcyxcblx0XHRcdFx0XHRcdFwiUmVhY3QgRnJvbnQgVG8gQmFjayAyMDIyXCIuXG5cdFx0XHRcdFx0PC9wPlxuXHRcdFx0XHRcdDxwPlZlcnNpb246IDAuMS4wPC9wPlxuXHRcdFx0PC9kaXY+XG5cdFx0YDtcblx0fVxufVxuIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb3JlL0NvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlZWRiYWNrUmF0aW5nIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0dGVtcGxhdGUoKSB7XG5cdFx0Y29uc3QgeyBnZXRSYXRpbmcgfSA9IHRoaXMuJHByb3BzO1xuXHRcdGNvbnN0IHJhdGluZyA9IGdldFJhdGluZygpO1xuXG5cdFx0cmV0dXJuIGBcblx0XHQke0FycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpZHgpID0+IHtcblx0XHRcdHJldHVybiBgPGxpPlxuXHRcdFx0XHQ8aW5wdXQgY2xhc3M9J2ZlZWJhY2stcmF0aW5nLWl0ZW0nIHR5cGU9J3JhZGlvJyBuYW1lPSdyYXRpbmcnXG5cdFx0XHRcdGlkPSdudW0ke2lkeCArIDF9J1xuXHRcdFx0XHR2YWx1ZT0nJHtpZHggKyAxfSdcblx0XHRcdFx0JHtyYXRpbmcgPT09IGlkeCArIDEgJiYgJ2NoZWNrZWQnfVxuXHRcdFx0XHQvPlxuXHRcdFx0XHQ8bGFiZWwgZm9yPSdudW0ke2lkeCArIDF9Jz5cblx0XHRcdFx0XHQke2lkeCArIDF9XG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0PC9saT5gO1xuXHRcdH0pLmpvaW4oJyAnKX1cblx0XHRgO1xuXHR9XG5cblx0c2V0RXZlbnQoKSB7XG5cdFx0dGhpcy5hZGRFdmVudCgnY2hhbmdlJywgJ2lucHV0W3R5cGU9cmFkaW9dJywgKHsgdGFyZ2V0OiB7IHZhbHVlIH0gfSkgPT4ge1xuXHRcdFx0Y29uc3QgeyBzZXRTdGF0ZSB9ID0gdGhpcy4kcHJvcHM7XG5cdFx0XHRzZXRTdGF0ZSh7IHJhdGluZzogK3ZhbHVlIH0sICd0YXJnZXRSZW5kZXInLCB0aGlzKTtcblx0XHR9KTtcblx0fVxufVxuIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb3JlL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQgRmVlZGJhY2tSYXRpbmcgZnJvbSAnLi9GZWVkYmFja1JhdGluZy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlZWRiYWNrRm9ybSBleHRlbmRzIENvbXBvbmVudCB7XG5cdHNldHVwKCkge1xuXHRcdHRoaXMuJHN0YXRlID0ge1xuXHRcdFx0cmF0aW5nOiAxMCxcblx0XHRcdHRleHQ6ICcnLFxuXHRcdFx0aXNEaXNhYmxlZDogdHJ1ZSxcblx0XHR9O1xuXHR9XG5cblx0dGVtcGxhdGUoKSB7XG5cdFx0cmV0dXJuIGBcblx0XHRcdFx0PGgyPkhvdyB3b3VsZCB5b3UgcmF0ZSB5b3VyIHNlcnZpY2Ugd2l0aCB1cz88L2gyPlxuXHRcdFx0XHQ8dWwgaWQ9J2ZlZWRiYWNrLXJhdGluZyc+PC91bD5cblx0XHRcdFx0PGRpdiBpZD0nZmVlZGJhY2stc3VibWl0Jz5cblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlucHV0LXRleHRcIlx1MDAxZHJlcXVpcmVkIHBsYWNlaG9sZGVyPSfrpqzrt7Drpbwg64Ko6rKo7KO87IS47JqULicgLz5cblx0XHRcdFx0XHQ8YnV0dG9uIGlkPSdmZWVkYmFjay1idG4nIGNsYXNzPSdkaWFibGVkQnRuJyB0eXBlPSdzdWJtaXQnIGRpc2FibGVkPuuTseuhne2VmOq4sDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBpZD0nZmVlZGJhY2stbWVzc2FnZSc+PC9kaXY+XG5cdFx0YDtcblx0fVxuXG5cdG1vdW50ZWQoKSB7XG5cdFx0Y29uc3QgJGZlZWRiYWNrUmF0aW5nID0gdGhpcy4kdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJyNmZWVkYmFjay1yYXRpbmcnKTtcblxuXHRcdG5ldyBGZWVkYmFja1JhdGluZygkZmVlZGJhY2tSYXRpbmcsIHtcblx0XHRcdGdldFJhdGluZzogdGhpcy5nZXRSYXRpbmcuYmluZCh0aGlzKSxcblx0XHRcdHNldFN0YXRlOiB0aGlzLnNldFN0YXRlLmJpbmQodGhpcyksXG5cdFx0fSk7XG5cblx0XHQvLyBpbnB1dCBmb2N1c1xuXHRcdHRoaXMuaGFuZGxlSW5wdXRGb2N1cygpO1xuXHR9XG5cblx0Z2V0UmF0aW5nKCkge1xuXHRcdGNvbnN0IHsgcmF0aW5nIH0gPSB0aGlzLiRzdGF0ZTtcblx0XHRyZXR1cm4gcmF0aW5nO1xuXHR9XG5cblx0c2V0RXZlbnQoKSB7XG5cdFx0Ly8gaW5wdXQgdGV4dFxuXHRcdHRoaXMuaGFuZGxlSW5wdXRFdmVudCgpO1xuXG5cdFx0Ly8gc3VibWl0XG5cdFx0dGhpcy5oYW5kbGVTdWJtaXRFdmVudCgpO1xuXHR9XG5cblx0aGFuZGxlSW5wdXRGb2N1cygpIHtcblx0XHRjb25zdCAkaW5wdXRGb2N1cyA9IHRoaXMuJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcjaW5wdXQtdGV4dCcpO1xuXG5cdFx0JGlucHV0Rm9jdXMub25mb2N1cyA9IChlKSA9PiB7XG5cdFx0XHRjb25zdCB7IGdldFN0YXRlIH0gPSB0aGlzLiRwcm9wcztcblx0XHRcdGNvbnN0IHsgdXNlciB9ID0gZ2V0U3RhdGUoKTtcblx0XHRcdGlmICghdXNlcikge1xuXHRcdFx0XHRjb25zdCAkZmVlZGJhY2tNc2cgPSB0aGlzLiR0YXJnZXQucXVlcnlTZWxlY3RvcignI2ZlZWRiYWNrLW1lc3NhZ2UnKTtcblx0XHRcdFx0JGZlZWRiYWNrTXNnLmlubmVyVGV4dCA9ICfroZzqt7jsnbjsnbQg7ZWE7JqU7ZWcIOyEnOu5hOyKpCDsnoXri4jri6QuJztcblx0XHRcdFx0ZS50YXJnZXQuYmx1cigpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHQkZmVlZGJhY2tNc2cuaW5uZXJUZXh0ID0gJyc7XG5cdFx0XHRcdH0sIDE1MDApO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRoYW5kbGVJbnB1dEV2ZW50KCkge1xuXHRcdHRoaXMuYWRkRXZlbnQoJ2tleXVwJywgJyNpbnB1dC10ZXh0JywgKHsgdGFyZ2V0OiB7IHZhbHVlIH0gfSkgPT4ge1xuXHRcdFx0Y29uc3QgJGZlZWRiYWNrU3VibWl0QnRuID0gdGhpcy4kdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJyNmZWVkYmFjay1idG4nKTtcblx0XHRcdGNvbnN0ICRmZWVkYmFja01zZyA9IHRoaXMuJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcjZmVlZGJhY2stbWVzc2FnZScpO1xuXHRcdFx0aWYgKHZhbHVlID09PSAnJykge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgaXNEaXNhYmxlZDogdHJ1ZSB9LCAnc3RvcFJlbmRlcicpO1xuXHRcdFx0XHQkZmVlZGJhY2tTdWJtaXRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsICdkaWFibGVkQnRuJyk7XG5cdFx0XHRcdCRmZWVkYmFja1N1Ym1pdEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKTtcblx0XHRcdFx0JGZlZWRiYWNrTXNnLmlubmVyVGV4dCA9ICcnO1xuXHRcdFx0fSBlbHNlIGlmICh2YWx1ZS5sZW5ndGggPCAxMCkge1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgaXNEaXNhYmxlZDogdHJ1ZSB9LCAnc3RvcFJlbmRlcicpO1xuXHRcdFx0XHQkZmVlZGJhY2tTdWJtaXRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsICdkaWFibGVkQnRuJyk7XG5cdFx0XHRcdCRmZWVkYmFja1N1Ym1pdEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKTtcblx0XHRcdFx0JGZlZWRiYWNrTXNnLmlubmVyVGV4dCA9ICfstZzshowgMTDsnpAg7J207IOB7J2EIOyeheugpe2VmOyEuOyalC4nO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGlzRGlzYWJsZWQ6IGZhbHNlIH0sICdzdG9wUmVuZGVyJyk7XG5cdFx0XHRcdCRmZWVkYmFja1N1Ym1pdEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG5cdFx0XHRcdCRmZWVkYmFja1N1Ym1pdEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG5cdFx0XHRcdCRmZWVkYmFja01zZy5pbm5lclRleHQgPSAnJztcblx0XHRcdH1cblx0XHRcdHRoaXMuc2V0U3RhdGUoeyB0ZXh0OiB2YWx1ZSB9LCAnc3RvcFJlbmRlcicpO1xuXHRcdH0pO1xuXHR9XG5cblx0aGFuZGxlU3VibWl0RXZlbnQoKSB7XG5cdFx0dGhpcy5hZGRFdmVudCgnY2xpY2snLCAnYnV0dG9uJywgYXN5bmMgKGUpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGNvbnN0IHsgcmF0aW5nLCB0ZXh0LCBpc0Rpc2FibGVkIH0gPSB0aGlzLiRzdGF0ZTtcblx0XHRcdGlmIChyYXRpbmcgJiYgdGV4dCAmJiAhaXNEaXNhYmxlZCkge1xuXHRcdFx0XHRjb25zdCB7IGNyZWF0ZUZlZWRiYWNrLCBnZXRTdGF0ZSB9ID0gdGhpcy4kcHJvcHM7XG5cdFx0XHRcdGNvbnN0IHtcblx0XHRcdFx0XHR1c2VyOiB7IF9pZCB9LFxuXHRcdFx0XHR9ID0gZ2V0U3RhdGUoKTtcblx0XHRcdFx0Y29uc3QgZm9ybURhdGEgPSB7IHJhdGluZywgdGV4dCwgX2lkIH07XG5cdFx0XHRcdGF3YWl0IGNyZWF0ZUZlZWRiYWNrKGZvcm1EYXRhKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb3JlL0NvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlZWRiYWNrU3RhdHMgZXh0ZW5kcyBDb21wb25lbnQge1xuXHR0ZW1wbGF0ZSgpIHtcblx0XHRjb25zdCB7IGZlZWRiYWNrTGlzdCB9ID0gdGhpcy4kcHJvcHM7XG5cblx0XHRjb25zdCBhdnJnID0gTWF0aC5yb3VuZChcblx0XHRcdGZlZWRiYWNrTGlzdC5yZWR1Y2UoKGFjYywgeyByYXRpbmcgfSkgPT4gYWNjICsgcmF0aW5nLCAwKSAvXG5cdFx0XHRcdGZlZWRiYWNrTGlzdC5sZW5ndGhcblx0XHQpO1xuXG5cdFx0cmV0dXJuIGBcblx0XHQ8ZGl2PlxuXHRcdCR7ZmVlZGJhY2tMaXN0Lmxlbmd0aH1cblx0XHQke2ZlZWRiYWNrTGlzdC5sZW5ndGggPT09IDEgPyAnUmV2aWV3JyA6ICdSZXZpZXdzJ31cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2PkF2ZXJhZ2UgUmF0aW5nOlxuXHRcdCR7IWlzTmFOKGF2cmcpICYmIGZlZWRiYWNrTGlzdC5sZW5ndGggPiAwICYmIGF2cmd9XG5cdFx0PC9kaXY+XG5cdFx0YDtcblx0fVxufVxuIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb3JlL0NvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlZWRiYWNrSXRlbSBleHRlbmRzIENvbXBvbmVudCB7XG5cdHRlbXBsYXRlKCkge1xuXHRcdGNvbnN0IGN1cnJlbnRVc2VyID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpKTtcblxuXHRcdGNvbnN0IHsgcmF0aW5nLCB0ZXh0LCB1c2VyIH0gPSB0aGlzLiRwcm9wcztcblxuXHRcdHJldHVybiBgXG5cdFx0PGRpdiBjbGFzcz0nZmVlZGJhY2stcmF0aW5nJz4ke3JhdGluZ308L2Rpdj5cblx0XHQke1xuXHRcdFx0Y3VycmVudFVzZXIgJiYgdXNlciAmJiBjdXJyZW50VXNlci5faWQgPT09IHVzZXIuX2lkXG5cdFx0XHRcdD8gYFxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiZmVlZGJhY2stYnRuLWVkaXRcIiB0eXBlPVwic3VibWl0XCI+XG5cdFx0XHRcdFx0PGkgY2xhc3M9XCJmYS1yZWd1bGFyIGZhLXBlbi10by1zcXVhcmVcIj48L2k+XG5cdFx0XHRcdDwvYnV0dG9uPiBcblx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImZlZWRiYWNrLWJ0bi1kZWxldGVcIj5cblx0XHRcdFx0XHQ8aSBjbGFzcz1cImZhLXNvbGlkIGZhLXhtYXJrXCI+PC9pPlxuXHRcdFx0XHQ8L2J1dHRvbj5gXG5cdFx0XHRcdDogJydcblx0XHR9XG5cdFx0PHAgY2xhc3M9J2ZlZWRiYWNrLXRleHQnPiR7dGV4dH08L3A+XG5cdFx0YDtcblx0fVxuXG5cdHNldEV2ZW50KCkge1xuXHRcdHRoaXMuYWRkRXZlbnQoJ2NsaWNrJywgJy5mZWVkYmFjay1idG4tZWRpdCcsIChlKSA9PiB7XG5cdFx0XHRjb25zdCB7IHJhdGluZywgdGV4dCwgX2lkLCBzd2l0Y2hFZGl0TW9kZSwgc2V0Q3VycmVudEZlZWRiYWNrIH0gPVxuXHRcdFx0XHR0aGlzLiRwcm9wcztcblxuXHRcdFx0Y29uc3QgY3VycmVudEZlZWRiYWNrID0geyByYXRpbmcsIHRleHQsIF9pZCB9O1xuXG5cdFx0XHRzZXRDdXJyZW50RmVlZGJhY2soY3VycmVudEZlZWRiYWNrKTtcblxuXHRcdFx0c3dpdGNoRWRpdE1vZGUoKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuYWRkRXZlbnQoJ2NsaWNrJywgJy5mZWVkYmFjay1idG4tZGVsZXRlJywgYXN5bmMgKGUpID0+IHtcblx0XHRcdGNvbnN0IHsgX2lkLCByZW1vdmVGZWVkYmFjayB9ID0gdGhpcy4kcHJvcHM7XG5cdFx0XHRhd2FpdCByZW1vdmVGZWVkYmFjayhfaWQpO1xuXHRcdH0pO1xuXHR9XG59XG4iLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uLy4uL2NvcmUvQ29tcG9uZW50LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3Bpbm5lciBleHRlbmRzIENvbXBvbmVudCB7XG5cdHRlbXBsYXRlKCkge1xuXHRcdHJldHVybiBgXG5cdFx0XHQ8ZGl2IGlkPSdsb2FkaW5nU3Bpbm5lckNvbnRhaW5lcic+XG5cdFx0XHRcdDxkaXYgaWQ9J2xvYWRpbmdTcGlubmVyJz48L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0YDtcblx0fVxufVxuIiwiaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb3JlL0NvbXBvbmVudC5qcyc7XG5cbmltcG9ydCBGZWVkYmFja1N0YXRzIGZyb20gJy4uL2NvbXBvbmVudHMvRmVlZGJhY2tTdGF0cy5qcyc7XG5pbXBvcnQgRmVlZGJhY2tJdGVtIGZyb20gJy4uL2NvbXBvbmVudHMvRmVlZGJhY2tJdGVtLmpzJztcblxuaW1wb3J0IFNwaW5uZXIgZnJvbSAnLi9zaGFyZWQvU3Bpbm5lci5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlZWRiYWNrTGlzdCBleHRlbmRzIENvbXBvbmVudCB7XG5cdHNldHVwKCkge1xuXHRcdGNvbnN0IHsgZmV0Y2hBbGxGZWVkYmFjayB9ID0gdGhpcy4kcHJvcHM7XG5cdFx0Ly8gZ2V0IGZlZWRiYWNrcyBsaXN0IGZyb20gZGJcblx0XHRmZXRjaEFsbEZlZWRiYWNrKHRoaXMpO1xuXHR9XG5cblx0dGVtcGxhdGUoKSB7XG5cdFx0Y29uc3QgeyBnZXRGZWVkYmFja0xpc3QsIGdldExvYWRpbmdTdGF0ZSB9ID0gdGhpcy4kcHJvcHM7XG5cdFx0Y29uc3QgaXNMb2FkaW5nID0gZ2V0TG9hZGluZ1N0YXRlKCk7XG5cdFx0Y29uc3QgZmVlZGJhY2tMaXN0ID0gZ2V0RmVlZGJhY2tMaXN0KCk7XG5cblx0XHRpZiAoaXNMb2FkaW5nKVxuXHRcdFx0cmV0dXJuIGBcblx0XHRcdFx0PGRpdiBpZD0nc3Bpbm5lcic+PC9kaXY+XG5cdFx0YDtcblxuXHRcdGlmIChmZWVkYmFja0xpc3QubGVuZ3RoID09PSAwKVxuXHRcdFx0cmV0dXJuIGA8ZGl2IGlkPSdmZWVkYmFjay1lbXB0eSc+Tm8gRmVlZGJhY2tzIFlldDwvZGl2PmA7XG5cblx0XHRyZXR1cm4gYFxuXHRcdDxkaXYgaWQ9J2ZlZWRiYWNrLXN0YXRzJz48L2Rpdj5cblx0XHQ8dWw+XG5cdFx0JHtmZWVkYmFja0xpc3Rcblx0XHRcdC5tYXAoKF8sIGlkeCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYFxuXHRcdFx0XHQ8bGkgY2xhc3M9J2ZlZWRiYWNrLWl0ZW0tY2FyZCcgZGF0YS1pZD0ke2lkeH0+PC9saT5gO1xuXHRcdFx0fSlcblx0XHRcdC5qb2luKCcnKX1cblx0XHQ8L3VsPlxuXHRcdGA7XG5cdH1cblxuXHRtb3VudGVkKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdHNldEN1cnJlbnRGZWVkYmFjayxcblx0XHRcdHN3aXRjaEVkaXRNb2RlLFxuXHRcdFx0Z2V0TG9hZGluZ1N0YXRlLFxuXHRcdFx0Z2V0RmVlZGJhY2tMaXN0LFxuXHRcdFx0cmVtb3ZlRmVlZGJhY2ssXG5cdFx0fSA9IHRoaXMuJHByb3BzO1xuXHRcdGNvbnN0IGlzTG9hZGluZyA9IGdldExvYWRpbmdTdGF0ZSgpO1xuXG5cdFx0aWYgKGlzTG9hZGluZykge1xuXHRcdFx0Y29uc3QgJHNwaW5uZXIgPSB0aGlzLiR0YXJnZXQucXVlcnlTZWxlY3RvcignI3NwaW5uZXInKTtcblx0XHRcdHJldHVybiBuZXcgU3Bpbm5lcigkc3Bpbm5lcik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZlZWRiYWNrU3RhdHMgPSB0aGlzLiR0YXJnZXQucXVlcnlTZWxlY3RvcignI2ZlZWRiYWNrLXN0YXRzJyk7XG5cdFx0aWYgKCRmZWVkYmFja1N0YXRzKSB7XG5cdFx0XHRuZXcgRmVlZGJhY2tTdGF0cygkZmVlZGJhY2tTdGF0cywgeyBmZWVkYmFja0xpc3Q6IGdldEZlZWRiYWNrTGlzdCgpIH0pO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmZWVkYmFja0l0ZW1zID0gdGhpcy4kdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZWVkYmFjay1pdGVtLWNhcmQnKTtcblx0XHRpZiAoJGZlZWRiYWNrSXRlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3QgZmVlZGJhY2tMaXN0ID0gZ2V0RmVlZGJhY2tMaXN0KCk7XG5cdFx0XHQkZmVlZGJhY2tJdGVtcy5mb3JFYWNoKChlKSA9PiB7XG5cdFx0XHRcdG5ldyBGZWVkYmFja0l0ZW0oZSwge1xuXHRcdFx0XHRcdC4uLmZlZWRiYWNrTGlzdFtlLmRhdGFzZXQuaWRdLFxuXHRcdFx0XHRcdHNldEN1cnJlbnRGZWVkYmFjayxcblx0XHRcdFx0XHRzd2l0Y2hFZGl0TW9kZSxcblx0XHRcdFx0XHRyZW1vdmVGZWVkYmFjayxcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cbiIsImltcG9ydCBGZWVkYmFja0Zvcm0gZnJvbSAnLi9GZWVkYmFja0Zvcm0uanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGZWVkYmFja0VkaXRGb3JtIGV4dGVuZHMgRmVlZGJhY2tGb3JtIHtcblx0c2V0dXAoKSB7XG5cdFx0Y29uc3QgeyBnZXRDdXJyZW50RmVlZGJhY2sgfSA9IHRoaXMuJHByb3BzO1xuXHRcdGNvbnN0IHsgcmF0aW5nLCB0ZXh0LCBfaWQgfSA9IGdldEN1cnJlbnRGZWVkYmFjaygpO1xuXG5cdFx0dGhpcy4kc3RhdGUgPSB7XG5cdFx0XHRyYXRpbmcsXG5cdFx0XHR0ZXh0LFxuXHRcdFx0X2lkLFxuXHRcdFx0aXNEaXNhYmxlZDogZmFsc2UsXG5cdFx0fTtcblx0fVxuXG5cdHRlbXBsYXRlKCkge1xuXHRcdGNvbnN0IHsgdGV4dCB9ID0gdGhpcy4kc3RhdGU7XG5cdFx0cmV0dXJuIGBcblx0XHQ8Zm9ybSBpZD0nZmVlZGJhY2stZm9ybScgY2xhc3M9J2NhcmQtaGVhZGVyJz5cblx0XHQ8aDI+64Ko6riw7IugIOumrOu3sOulvCDsiJjsoJUg7ZWY7Iuc6rKg7Iq164uI6rmMPzwvaDI+XG5cdFx0PHVsIGlkPSdmZWVkYmFjay1yYXRpbmcnPjwvdWw+XG5cdFx0PGRpdiBpZD0nZmVlZGJhY2stc3VibWl0Jz5cblx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiaW5wdXQtdGV4dFwiXHUwMDFkcmVxdWlyZWQgcGxhY2Vob2xkZXI9J+umrOu3sOulvCDrgqjqsqjso7zshLjsmpQuJyB2YWx1ZT0nJHt0ZXh0fScgLz5cblx0XHRcdDxidXR0b24gaWQ9J2ZlZWRiYWNrLWJ0bicgdHlwZT0nc3VibWl0Jz7siJjsoJXtlZjquLA8L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IGlkPSdmZWVkYmFjay1tZXNzYWdlJz48L2Rpdj5cblx0XHQ8L2Zvcm0+XG5cdFx0YDtcblx0fVxuXG5cdGdldFJhdGluZygpIHtcblx0XHRjb25zdCB7IHJhdGluZyB9ID0gdGhpcy4kc3RhdGU7XG5cdFx0cmV0dXJuIHJhdGluZztcblx0fVxuXG5cdGhhbmRsZVN1Ym1pdEV2ZW50KCkge1xuXHRcdHRoaXMuYWRkRXZlbnQoJ2NsaWNrJywgJ2J1dHRvbicsIGFzeW5jIChlKSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRjb25zdCB7IHJhdGluZywgdGV4dCwgaXNEaXNhYmxlZCwgX2lkIH0gPSB0aGlzLiRzdGF0ZTtcblx0XHRcdGlmIChyYXRpbmcgJiYgdGV4dCAmJiAhaXNEaXNhYmxlZCkge1xuXHRcdFx0XHRjb25zdCB7IGVkaXRGZWVkYmFjayB9ID0gdGhpcy4kcHJvcHM7XG5cdFx0XHRcdGNvbnN0IGZvcm1EYXRhID0geyByYXRpbmcsIHRleHQgfTtcblx0XHRcdFx0YXdhaXQgZWRpdEZlZWRiYWNrKGZvcm1EYXRhLCBfaWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG4iLCJjb25zdCBBUElfVVJMID0gJ2FwaS9mZWVkYmFjay8nO1xuXG4vLyAgZ2V0IGFsbCBmZWVkYmFja1xuZXhwb3J0IGNvbnN0IGdldEFsbEZlZWRiYWNrcyA9IGFzeW5jICgpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXMgPSBhd2FpdCBmZXRjaChBUElfVVJMLCB7XG5cdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0fSxcblx0XHR9KTtcblx0XHRjb25zdCBmZWVkYmFja0xpc3QgPSBhd2FpdCByZXMuanNvbigpO1xuXHRcdHJldHVybiBmZWVkYmFja0xpc3Q7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5sb2coJ0ZhaWx1cmUgOiBmZXRjaGluZyBmZWVkYmFjayBsaXN0JywgZXJyb3IpO1xuXHRcdHJldHVybiBlcnJvcjtcblx0fVxufTtcblxuLy8gY3JlYXRlIGEgZmVlZGJhY2tcbmV4cG9ydCBjb25zdCBwb3N0RmVlZGJhY2sgPSBhc3luYyAoZm9ybURhdGEpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXMgPSBhd2FpdCBmZXRjaChBUElfVVJMLCB7XG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdH0sXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSksXG5cdFx0fSk7XG5cblx0XHRjb25zdCBuZXdGZWVkYmFjayA9IGF3YWl0IHJlcy5qc29uKCk7XG5cdFx0cmV0dXJuIG5ld0ZlZWRiYWNrO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUubG9nKCdGYWlsdXJlIDogY3JlYXRlIGEgbmV3IGZlZWRiYWNrICcsIGVycm9yKTtcblx0XHRyZXR1cm4gZXJyb3I7XG5cdH1cbn07XG5cbi8vICB1cGRhdGUgYSBmZWVkYmFja1xuZXhwb3J0IGNvbnN0IHVwZGF0ZUZlZWRiYWNrID0gYXN5bmMgKGZvcm1EYXRhLCBpZCkgPT4ge1xuXHR0cnkge1xuXHRcdC8vIGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLnB1dChBUElfVVJMICsgaWQsIGZvcm1EYXRhKTtcblxuXHRcdGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKEFQSV9VUkwgKyBpZCwge1xuXHRcdFx0bWV0aG9kOiAnUFVUJyxcblx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdH0sXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSksXG5cdFx0fSk7XG5cblx0XHRjb25zdCB1cGRhdGVkRmVlZGJhY2sgPSBhd2FpdCByZXMuanNvbigpO1xuXHRcdHJldHVybiB1cGRhdGVkRmVlZGJhY2s7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5sb2coJ0ZhaWx1cmUgOiB1cGRhdGUgYSBmZWVkYmFjayAnLCBlcnJvcik7XG5cdFx0cmV0dXJuIGVycm9yO1xuXHR9XG59O1xuXG4vLyAgZGVsZXRlIGEgZmVlZGJhY2tcbmV4cG9ydCBjb25zdCBkZWxldGVGZWVkYmFjayA9IGFzeW5jIChpZCkgPT4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKEFQSV9VUkwgKyBpZCwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xuXHRcdGNvbnN0IGRlbGV0ZWRTdGF0ZSA9IGF3YWl0IHJlcy5qc29uKCk7XG5cdFx0cmV0dXJuIGRlbGV0ZWRTdGF0ZTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmxvZygnRmFpbHVyZSA6IGRlbGV0ZSBhIGZlZWRiYWNrICcsIGVycm9yKTtcblx0XHRyZXR1cm4gZXJyb3I7XG5cdH1cbn07XG4iLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvcmUvQ29tcG9uZW50LmpzJztcblxuaW1wb3J0IEZlZWRiYWNrRm9ybSBmcm9tICcuLi9jb21wb25lbnRzL0ZlZWRiYWNrRm9ybS5qcyc7XG5pbXBvcnQgRmVlZGJhY2tMaXN0IGZyb20gJy4uL2NvbXBvbmVudHMvRmVlZGJhY2tMaXN0LmpzJztcbmltcG9ydCBGZWVkYmFja0VkaXRGb3JtIGZyb20gJy4uL2NvbXBvbmVudHMvRmVlZGJhY2tFZGl0Rm9ybS5qcyc7XG5cbmltcG9ydCBTcGlubmVyIGZyb20gJy4uL2NvbXBvbmVudHMvc2hhcmVkL1NwaW5uZXIuanMnO1xuXG5pbXBvcnQge1xuXHRnZXRBbGxGZWVkYmFja3MsXG5cdHBvc3RGZWVkYmFjayxcblx0dXBkYXRlRmVlZGJhY2ssXG5cdGRlbGV0ZUZlZWRiYWNrLFxufSBmcm9tICcuLi9jb250ZXh0cy9mZWVkYmFjay9GZWVkYmFja0FjdGlvbi5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlZWRiYWNrIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0c2V0dXAoKSB7XG5cdFx0dGhpcy4kc3RhdGUgPSB7XG5cdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxuXHRcdFx0ZmVlZGJhY2tMaXN0OiBbXSxcblx0XHRcdGN1cnJlbnRGZWVkYmFjazogbnVsbCxcblx0XHRcdGVkaXRNb2RlOiBmYWxzZSxcblx0XHR9O1xuXHR9XG5cblx0dGVtcGxhdGUoKSB7XG5cdFx0Y29uc3QgeyBpc0xvYWRpbmcgfSA9IHRoaXMuJHN0YXRlO1xuXG5cdFx0aWYgKGlzTG9hZGluZylcblx0XHRcdHJldHVybiBgXG5cdFx0XHQ8ZGl2IGlkPSdzcGlubmVyJz48L2Rpdj5cblx0XHRcdGA7XG5cblx0XHRyZXR1cm4gYFxuXHRcdDxkaXYgaWQ9J2ZlZWRiYWNrJz5cblx0XHRcdDxmb3JtIGlkPSdmZWVkYmFjay1mb3JtJyBjbGFzcz0nY2FyZC1oZWFkZXInPjwvZm9ybT5cblx0XHRcdDxkaXYgaWQ9J2ZlZWRiYWNrLWxpc3QnPjwvZGl2PlxuXHRcdDwvZGl2PmA7XG5cdH1cblxuXHRtb3VudGVkKCkge1xuXHRcdGNvbnN0IHsgaXNMb2FkaW5nLCBlZGl0TW9kZSB9ID0gdGhpcy4kc3RhdGU7XG5cdFx0Y29uc3QgeyBnZXRTdGF0ZSB9ID0gdGhpcy4kcHJvcHM7XG5cdFx0Y29uc3Qge1xuXHRcdFx0Z2V0Q3VycmVudEZlZWRiYWNrLFxuXHRcdFx0c2V0Q3VycmVudEZlZWRiYWNrLFxuXHRcdFx0c3dpdGNoRWRpdE1vZGUsXG5cdFx0XHRnZXRMb2FkaW5nU3RhdGUsXG5cdFx0XHRnZXRGZWVkYmFja0xpc3QsXG5cdFx0XHRmZXRjaEFsbEZlZWRiYWNrLFxuXHRcdFx0Y3JlYXRlRmVlZGJhY2ssXG5cdFx0XHRlZGl0RmVlZGJhY2ssXG5cdFx0XHRyZW1vdmVGZWVkYmFjayxcblx0XHR9ID0gdGhpcztcblxuXHRcdGlmIChpc0xvYWRpbmcpIHtcblx0XHRcdGNvbnN0ICRzcGlubmVyID0gdGhpcy4kdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJyNzcGlubmVyJyk7XG5cdFx0XHRuZXcgU3Bpbm5lcigkc3Bpbm5lcik7XG5cdFx0fSBlbHNlIGlmIChlZGl0TW9kZSkge1xuXHRcdFx0Y29uc3QgJGZlZWRiYWNrID0gdGhpcy4kdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJyNmZWVkYmFjaycpO1xuXHRcdFx0bmV3IEZlZWRiYWNrRWRpdEZvcm0oJGZlZWRiYWNrLCB7XG5cdFx0XHRcdGdldEN1cnJlbnRGZWVkYmFjazogZ2V0Q3VycmVudEZlZWRiYWNrLmJpbmQodGhpcyksXG5cdFx0XHRcdGVkaXRGZWVkYmFjazogZWRpdEZlZWRiYWNrLmJpbmQodGhpcyksXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgJGZlZWRiYWNrRm9ybSA9IHRoaXMuJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcjZmVlZGJhY2stZm9ybScpO1xuXHRcdFx0Y29uc3QgJGZlZWRiYWNrTGlzdCA9IHRoaXMuJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcjZmVlZGJhY2stbGlzdCcpO1xuXG5cdFx0XHRuZXcgRmVlZGJhY2tGb3JtKCRmZWVkYmFja0Zvcm0sIHtcblx0XHRcdFx0Y3JlYXRlRmVlZGJhY2s6IGNyZWF0ZUZlZWRiYWNrLmJpbmQodGhpcyksXG5cdFx0XHRcdGdldFN0YXRlOiBnZXRTdGF0ZSxcblx0XHRcdH0pO1xuXG5cdFx0XHRuZXcgRmVlZGJhY2tMaXN0KCRmZWVkYmFja0xpc3QsIHtcblx0XHRcdFx0c2V0Q3VycmVudEZlZWRiYWNrOiBzZXRDdXJyZW50RmVlZGJhY2suYmluZCh0aGlzKSxcblx0XHRcdFx0Z2V0RmVlZGJhY2tMaXN0OiBnZXRGZWVkYmFja0xpc3QuYmluZCh0aGlzKSxcblx0XHRcdFx0Z2V0TG9hZGluZ1N0YXRlOiBnZXRMb2FkaW5nU3RhdGUuYmluZCh0aGlzKSxcblx0XHRcdFx0c3dpdGNoRWRpdE1vZGU6IHN3aXRjaEVkaXRNb2RlLmJpbmQodGhpcyksXG5cdFx0XHRcdGZldGNoQWxsRmVlZGJhY2s6IGZldGNoQWxsRmVlZGJhY2suYmluZCh0aGlzKSxcblx0XHRcdFx0cmVtb3ZlRmVlZGJhY2s6IHJlbW92ZUZlZWRiYWNrLmJpbmQodGhpcyksXG5cdFx0XHRcdGdldFN0YXRlOiBnZXRTdGF0ZSxcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZUxvYWRpbmdTdGF0ZShib29sZWFuKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGlzTG9hZGluZzogYm9vbGVhbiB9KTtcblx0fVxuXG5cdGdldExvYWRpbmdTdGF0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy4kc3RhdGUuaXNMb2FkaW5nO1xuXHR9XG5cblx0Z2V0RmVlZGJhY2tMaXN0KCkge1xuXHRcdHJldHVybiB0aGlzLiRzdGF0ZS5mZWVkYmFja0xpc3Q7XG5cdH1cblxuXHRnZXRDdXJyZW50RmVlZGJhY2soKSB7XG5cdFx0cmV0dXJuIHRoaXMuJHN0YXRlLmN1cnJlbnRGZWVkYmFjaztcblx0fVxuXG5cdHNldEN1cnJlbnRGZWVkYmFjayhjdXJyZW50RmVlZGJhY2spIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgY3VycmVudEZlZWRiYWNrIH0sICdzdG9wUmVuZGVyJyk7XG5cdH1cblxuXHRzd2l0Y2hFZGl0TW9kZSgpIHtcblx0XHRjb25zdCB7IGVkaXRNb2RlIH0gPSB0aGlzLiRzdGF0ZTtcblx0XHR0aGlzLnNldFN0YXRlKHsgZWRpdE1vZGU6ICFlZGl0TW9kZSB9KTtcblx0fVxuXG5cdGFzeW5jIGZldGNoQWxsRmVlZGJhY2sodGFyZ2V0KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGlzTG9hZGluZzogdHJ1ZSB9LCAnc3RvcFJlbmRlcicpO1xuXHRcdGNvbnN0IHBheWxvYWQgPSBhd2FpdCBnZXRBbGxGZWVkYmFja3MoKTtcblxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShcblx0XHRcdFx0eyBmZWVkYmFja0xpc3Q6IHBheWxvYWQucmV2ZXJzZSgpLCBpc0xvYWRpbmc6IGZhbHNlIH0sXG5cdFx0XHRcdCd0YXJnZXRSZW5kZXInLFxuXHRcdFx0XHR0YXJnZXRcblx0XHRcdCk7XG5cdFx0fSwgMTAwKTtcblx0fVxuXG5cdGFzeW5jIGNyZWF0ZUZlZWRiYWNrKGZvcm1EYXRhKSB7XG5cdFx0dGhpcy5oYW5kbGVMb2FkaW5nU3RhdGUodHJ1ZSk7XG5cblx0XHRjb25zdCB7IGZlZWRiYWNrTGlzdCB9ID0gdGhpcy4kc3RhdGU7XG5cdFx0Y29uc3QgbmV3RmVlZGJhY2sgPSBhd2FpdCBwb3N0RmVlZGJhY2soZm9ybURhdGEpO1xuXG5cdFx0Y29uc3QgcGF5bG9hZCA9IFtuZXdGZWVkYmFjaywgLi4uZmVlZGJhY2tMaXN0XTtcblxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGZlZWRiYWNrTGlzdDogcGF5bG9hZCxcblx0XHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdH0pO1xuXHRcdH0sIDIwMCk7XG5cdH1cblxuXHRhc3luYyBlZGl0RmVlZGJhY2soZm9ybURhdGEsIGlkKSB7XG5cdFx0dGhpcy5oYW5kbGVMb2FkaW5nU3RhdGUodHJ1ZSk7XG5cdFx0Y29uc3QgdXBkYXRlZEZlZWRiYWNrID0gYXdhaXQgdXBkYXRlRmVlZGJhY2soZm9ybURhdGEsIGlkKTtcblx0XHRjb25zdCB7IGZlZWRiYWNrTGlzdCB9ID0gdGhpcy4kc3RhdGU7XG5cdFx0Y29uc3QgcGF5bG9hZCA9IGZlZWRiYWNrTGlzdC5tYXAoKGZlZWRiYWNrKSA9PiB7XG5cdFx0XHRpZiAoZmVlZGJhY2suX2lkID09PSBpZCkge1xuXHRcdFx0XHRyZXR1cm4gdXBkYXRlZEZlZWRiYWNrO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZlZWRiYWNrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGZlZWRiYWNrTGlzdDogcGF5bG9hZCxcblx0XHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdFx0ZWRpdE1vZGU6IGZhbHNlLFxuXHRcdFx0fSk7XG5cdFx0fSwgMjAwKTtcblx0fVxuXG5cdGFzeW5jIHJlbW92ZUZlZWRiYWNrKGlkKSB7XG5cdFx0aWYgKHdpbmRvdy5jb25maXJtKCdBcmUgeW91IHN1cmU/JykpIHtcblx0XHRcdHRoaXMuaGFuZGxlTG9hZGluZ1N0YXRlKHRydWUpO1xuXHRcdFx0Y29uc3QgeyBzdWNjZXNzIH0gPSBhd2FpdCBkZWxldGVGZWVkYmFjayhpZCk7XG5cdFx0XHRpZiAoc3VjY2Vzcykge1xuXHRcdFx0XHRjb25zdCB7IGZlZWRiYWNrTGlzdCB9ID0gdGhpcy4kc3RhdGU7XG5cdFx0XHRcdGNvbnN0IHBheWxvYWQgPSBmZWVkYmFja0xpc3QuZmlsdGVyKChpdGVtKSA9PiBpdGVtLl9pZCAhPT0gaWQpO1xuXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0ZmVlZGJhY2tMaXN0OiBwYXlsb2FkLFxuXHRcdFx0XHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSwgMjAwKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsImltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29yZS9Db21wb25lbnQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduSW4gZXh0ZW5kcyBDb21wb25lbnQge1xuXHRzZXR1cCgpIHtcblx0XHR0aGlzLiRzdGF0ZSA9IHtcblx0XHRcdGVtYWlsOiAnJyxcblx0XHRcdHBhc3N3b3JkOiAnJyxcblx0XHR9O1xuXHR9XG5cblx0dGVtcGxhdGUoKSB7XG5cdFx0cmV0dXJuIGBcblx0XHQ8ZGl2IGlkPSdmZWVkYmFjay1hdXRoJz5cblx0XHRcdFx0PGgyPu2ZmOyYge2VqeuLiOuLpCE8L2gyPlxuXHRcdFx0XHQ8Zm9ybT5cblx0XHRcdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdFx0XHRpZD0nZW1haWwnXG5cdFx0XHRcdFx0XHR0eXBlPVwiZW1haWxcIlxuXHRcdFx0XHRcdFx0bmFtZT1cImVtYWlsXCJcblx0XHRcdFx0XHRcdHBsYWNlaG9sZGVyPVwiRW1haWxcIlxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PGlucHV0IFxuXHRcdFx0XHRcdGlkPSdwYXNzd29yZCdcblx0XHRcdFx0XHR0eXBlPVwicGFzc3dvcmRcIlxuXHRcdFx0XHRcdG5hbWU9XCJwYXNzd29yZFwiXG5cdFx0XHRcdFx0YXV0b2NvbXBsZXRlPScnXG5cdFx0XHRcdFx0cGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiXG5cdFx0XHRcdC8+XG5cdFx0XHRcdDxidXR0b24gaWQ9J2F1dGgtYnV0dG9uJyB0eXBlPSdzdWJtaXQnIGRpc2FibGVkIGNsYXNzPSdkaXNhYmxlZEJ0bic+XG5cdFx0XHRcdFx066Gc6re47J24XG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHRcdDxkaXYgaWQ9J2xpbmstc2lnbnVwJz5cblx0XHRcdFx0XHQ8YSBocmVmPVwiL3NpZ24tdXBcIj7tmozsm5DqsIDsnoU8L2E+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRcdGA7XG5cdH1cblxuXHRzZXRFdmVudCgpIHtcblx0XHR0aGlzLmFkZEV2ZW50KCdrZXl1cCcsICdpbnB1dCcsICh7IHRhcmdldDogeyBpZCwgdmFsdWUgfSB9KSA9PiB7XG5cdFx0XHRjb25zdCAkYXV0aFN1Ym1pdEJ0biA9IHRoaXMuJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcjYXV0aC1idXR0b24nKTtcblxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IFtpZF06IHZhbHVlIH0sICdzdG9wUmVuZGVyJyk7XG5cblx0XHRcdGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkIH0gPSB0aGlzLiRzdGF0ZTtcblxuXHRcdFx0aWYgKGVtYWlsICYmIHBhc3N3b3JkKSB7XG5cdFx0XHRcdCRhdXRoU3VibWl0QnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcblx0XHRcdFx0JGF1dGhTdWJtaXRCdG4ucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGF1dGhTdWJtaXRCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJyk7XG5cdFx0XHRcdCRhdXRoU3VibWl0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZGlzYWJsZWRCdG4nKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuYWRkRXZlbnQoJ2NsaWNrJywgJ2J1dHRvbicsIGFzeW5jIChlKSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gdGhpcy4kc3RhdGU7XG5cdFx0XHRpZiAoZW1haWwgJiYgcGFzc3dvcmQpIHtcblx0XHRcdFx0Y29uc3QgeyBoYW5kbGVMb2dpbiB9ID0gdGhpcy4kcHJvcHM7XG5cdFx0XHRcdGF3YWl0IGhhbmRsZUxvZ2luKHsgZW1haWwsIHBhc3N3b3JkIH0pO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgZW1haWw6ICcnLCBwYXNzd29yZDogJycgfSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cbiIsImltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29yZS9Db21wb25lbnQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWdudXAgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRzZXR1cCgpIHtcblx0XHR0aGlzLiRzdGF0ZSA9IHtcblx0XHRcdGVtYWlsOiAnJyxcblx0XHRcdHBhc3N3b3JkOiAnJyxcblx0XHRcdHBhc3N3b3JkMjogJycsXG5cdFx0XHRuYW1lOiAnJyxcblx0XHR9O1xuXHR9XG5cblx0dGVtcGxhdGUoKSB7XG5cdFx0cmV0dXJuIGBcblx0XHQ8ZGl2IGlkPSdmZWVkYmFjay1hdXRoJz5cblx0XHRcdDxoMj7tmozsm5Ag6rCA7J6FPC9oMj5cblx0XHRcdDxmb3JtPlxuXHRcdFx0XHQ8bGFiZWwgZm9yPSdlbWFpbCc+XG5cdFx0XHRcdFx07J2066mU7J28XG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdDxpbnB1dCBcblx0XHRcdFx0XHRpZD0nZW1haWwnXG5cdFx0XHRcdFx0dHlwZT1cImVtYWlsXCJcblx0XHRcdFx0XHRuYW1lPVwiZW1haWxcIlxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyPVwiRW1haWxcIlxuXHRcdFx0XHQvPlxuXHRcdFx0XHRcblx0XHRcdFx0PGxhYmVsIGZvcj0nbmFtZSc+XG5cdFx0XHRcdFx07J2066aEXG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdDxpbnB1dCBcblx0XHRcdFx0XHRpZD0nbmFtZSdcblx0XHRcdFx0XHR0eXBlPVwibmFtZVwiXG5cdFx0XHRcdFx0bmFtZT1cIm5hbWVcIlxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyPVwiTmFtZVwiXG5cdFx0XHRcdC8+XG5cblx0XHRcdFx0PGxhYmVsIGZvcj0ncGFzc3dvcmQnPlxuXHRcdFx0XHRcdOu5hOuwgOuyiO2YuFxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdGlkPSdwYXNzd29yZCdcblx0XHRcdFx0dHlwZT1cInBhc3N3b3JkXCJcblx0XHRcdFx0bmFtZT1cInBhc3N3b3JkXCJcblx0XHRcdFx0YXV0b2NvbXBsZXRlPScnXG5cdFx0XHRcdHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIlxuXHRcdFx0XHQvPlxuXG5cdFx0XHRcdDxsYWJlbCBmb3I9J3Bhc3N3b3JkMic+XG5cdFx0XHRcdFx067mE67CA67KI7Zi4IO2ZleyduFxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHQ8aW5wdXQgXG5cdFx0XHRcdGlkPSdwYXNzd29yZDInXG5cdFx0XHRcdHR5cGU9XCJwYXNzd29yZFwiXG5cdFx0XHRcdG5hbWU9XCJwYXNzd29yZDJcIlxuXHRcdFx0XHRhdXRvY29tcGxldGU9Jydcblx0XHRcdFx0cGxhY2Vob2xkZXI9XCJDb25maXJtIFBhc3N3b3JkXCJcblx0XHRcdFx0Lz5cblxuXHRcdFx0XHRcblx0XHRcdDxidXR0b24gaWQ9J2F1dGgtYnV0dG9uJyB0eXBlPSdzdWJtaXQnIGRpc2FibGVkIGNsYXNzPSdkaXNhYmxlZEJ0bic+XG5cdFx0XHRcdOqwgOyehe2VmOq4sFxuXHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8L2Zvcm0+XG5cdFx0XHQ8ZGl2IGlkPSdsaW5rLXNpZ251cCc+XG5cdFx0XHRcdDxhIGhyZWY9XCIvc2lnbi1pblwiPuuhnOq3uOyduDwvYT5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRcdGA7XG5cdH1cblxuXHRzZXRFdmVudCgpIHtcblx0XHR0aGlzLmFkZEV2ZW50KCdrZXl1cCcsICdpbnB1dCcsICh7IHRhcmdldDogeyBpZCwgdmFsdWUgfSB9KSA9PiB7XG5cdFx0XHRjb25zdCAkYXV0aFN1Ym1pdEJ0biA9IHRoaXMuJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcjYXV0aC1idXR0b24nKTtcblxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IFtpZF06IHZhbHVlIH0sICdzdG9wUmVuZGVyJyk7XG5cblx0XHRcdGNvbnN0IHsgZW1haWwsIG5hbWUsIHBhc3N3b3JkLCBwYXNzd29yZDIgfSA9IHRoaXMuJHN0YXRlO1xuXG5cdFx0XHRpZiAoKGVtYWlsLCBuYW1lLCBwYXNzd29yZCwgcGFzc3dvcmQyKSkge1xuXHRcdFx0XHQkYXV0aFN1Ym1pdEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG5cdFx0XHRcdCRhdXRoU3VibWl0QnRuLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhdXRoU3VibWl0QnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAndHJ1ZScpO1xuXHRcdFx0XHQkYXV0aFN1Ym1pdEJ0bi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2Rpc2FibGVkQnRuJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLmFkZEV2ZW50KCdjbGljaycsICdidXR0b24nLCBhc3luYyAoZSkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Y29uc3QgeyBlbWFpbCwgbmFtZSwgcGFzc3dvcmQsIHBhc3N3b3JkMiB9ID0gdGhpcy4kc3RhdGU7XG5cdFx0XHRpZiAocGFzc3dvcmQgIT09IHBhc3N3b3JkMikge1xuXHRcdFx0XHRhbGVydCgn67mE67CA67KI7Zi466W8IO2ZleyduO2VtOyjvOyEuOyalC4nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChlbWFpbCAmJiBuYW1lICYmIHBhc3N3b3JkKSB7XG5cdFx0XHRcdFx0Y29uc3QgeyBoYW5kbGVSZWdpc3RlciB9ID0gdGhpcy4kcHJvcHM7XG5cdFx0XHRcdFx0YXdhaXQgaGFuZGxlUmVnaXN0ZXIoeyBlbWFpbCwgcGFzc3dvcmQsIG5hbWUgfSk7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGVtYWlsOiAnJywgcGFzc3dvcmQ6ICcnLCBuYW1lOiAnJyB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG4iLCJjb25zdCBBUElfVVJMID0gJ2FwaS9hdXRoLyc7XG5cbi8vIExvZ2luIHVzZXJcbmV4cG9ydCBjb25zdCBsb2dpblVzZXIgPSBhc3luYyAodXNlckRhdGEpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXMgPSBhd2FpdCBmZXRjaChBUElfVVJMICsgJ2xvZ2luJywge1xuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHR9LFxuXHRcdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkodXNlckRhdGEpLFxuXHRcdH0pO1xuXG5cdFx0aWYgKHJlcy5vaykge1xuXHRcdFx0Y29uc3QgdXNlciA9IGF3YWl0IHJlcy5qc29uKCk7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKTtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHVzZXIgfTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZXJyID0gYXdhaXQgcmVzLmpzb24oKTtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBkYXRhOiBlcnIgfTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGRhdGE6IGVycm9yIH07XG5cdH1cbn07XG5cbi8vIFNpZ2luIHVwIHVzZXJcblxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyVXNlciA9IGFzeW5jICh1c2VyRGF0YSkgPT4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKEFQSV9VUkwsIHtcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0fSxcblx0XHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHVzZXJEYXRhKSxcblx0XHR9KTtcblxuXHRcdGlmIChyZXMub2spIHtcblx0XHRcdGNvbnN0IG5ld1VzZXIgPSBhd2FpdCByZXMuanNvbigpO1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCBKU09OLnN0cmluZ2lmeShuZXdVc2VyKSk7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBuZXdVc2VyIH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGVyciA9IGF3YWl0IHJlcy5qc29uKCk7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZGF0YTogZXJyIH07XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBkYXRhOiBlcnJvci5yZXNwb25zZS5kYXRhIH07XG5cdH1cbn07XG4iLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vY29yZS9Db21wb25lbnQuanMnO1xuXG5pbXBvcnQgTm90Rm91bmQgZnJvbSAnLi9jb21wb25lbnRzL3NoYXJlZC9Ob3RGb3VuZC5qcyc7XG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vY29tcG9uZW50cy9IZWFkZXIuanMnO1xuaW1wb3J0IEFib3V0IGZyb20gJy4vcGFnZXMvQWJvdXQuanMnO1xuaW1wb3J0IEZlZWRiYWNrIGZyb20gJy4vcGFnZXMvRmVlZGJhY2suanMnO1xuaW1wb3J0IFNpZ25JbiBmcm9tICcuL3BhZ2VzL1NpZ25Jbi5qcyc7XG5pbXBvcnQgU2lnblVwIGZyb20gJy4vcGFnZXMvU2lnblVwLmpzJztcblxuaW1wb3J0IHsgbG9naW5Vc2VyLCByZWdpc3RlclVzZXIgfSBmcm9tICcuL2NvbnRleHRzL2F1dGgvQXV0aEFjdGlvbi5qcyc7XG5cbmNvbnN0IHJvdXRlcyA9IFtcblx0eyBwYXRoOiAnLycsIGNvbXBvbmVudDogRmVlZGJhY2sgfSxcblx0eyBwYXRoOiAnL2Fib3V0JywgY29tcG9uZW50OiBBYm91dCB9LFxuXHR7IHBhdGg6ICcvc2lnbi1pbicsIGNvbXBvbmVudDogU2lnbkluIH0sXG5cdHsgcGF0aDogJy9zaWduLXVwJywgY29tcG9uZW50OiBTaWduVXAgfSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcCBleHRlbmRzIENvbXBvbmVudCB7XG5cdHNldHVwKCkge1xuXHRcdGNvbnN0IHVzZXIgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJykpO1xuXHRcdHRoaXMuJHN0YXRlID0ge1xuXHRcdFx0dXNlcjogdXNlciA/IHVzZXIgOiBudWxsLFxuXHRcdFx0aXNFcnJvcjogZmFsc2UsXG5cdFx0XHRpc1N1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdG1lc3NhZ2U6ICcnLFxuXHRcdH07XG5cdH1cblxuXHR0ZW1wbGF0ZSgpIHtcblx0XHRyZXR1cm4gYFxuXHRcdFx0PGhlYWRlcj48L2hlYWRlcj5cblx0ICAgIDxtYWluPjwvbWFpbj5cbiAgICBgO1xuXHR9XG5cblx0bW91bnRlZCgpIHtcblx0XHRjb25zdCAkaGVhZGVyID0gdGhpcy4kdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2hlYWRlcicpO1xuXHRcdGNvbnN0IHsgZ2V0U3RhdGUsIGhhbmRsZUxvZ291dCB9ID0gdGhpcztcblx0XHRuZXcgSGVhZGVyKCRoZWFkZXIsIHtcblx0XHRcdGdldFN0YXRlOiBnZXRTdGF0ZS5iaW5kKHRoaXMpLFxuXHRcdFx0aGFuZGxlTG9nb3V0OiBoYW5kbGVMb2dvdXQuYmluZCh0aGlzKSxcblx0XHR9KTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9KTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsICgpID0+IHtcblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRyZW5kZXIgPSAocGF0aCkgPT4ge1xuXHRcdGNvbnN0IF9wYXRoID0gcGF0aCA/PyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNvbXBvbmVudCA9XG5cdFx0XHRcdHJvdXRlcy5maW5kKChyb3V0ZSkgPT4gcm91dGUucGF0aCA9PT0gX3BhdGgpPy5jb21wb25lbnQgfHwgbnVsbDtcblxuXHRcdFx0Y29uc3QgJG1haW4gPSB0aGlzLiR0YXJnZXQucXVlcnlTZWxlY3RvcignbWFpbicpO1xuXG5cdFx0XHQvLyB3cm9uZyByb3V0ZXNcblx0XHRcdGlmIChjb21wb25lbnQgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBOb3RGb3VuZCgkbWFpbik7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICRuYXZJdGVtID0gdGhpcy4kdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTtcblxuXHRcdFx0JG5hdkl0ZW0uZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXHRcdFx0XHRjb25zdCBwYXRoID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XHRcdFx0aWYgKHBhdGggPT09IF9wYXRoKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdGVkTmF2SXRlbScpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChlbGVtZW50LmNsYXNzTmFtZSA9PT0gJ3NlbGVjdGVkTmF2SXRlbScpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGNvbnN0IHsgdXNlciwgaXNTdWNjZXNzIH0gPSB0aGlzLiRzdGF0ZTtcblx0XHRcdGlmIChcblx0XHRcdFx0KF9wYXRoID09PSAnL3NpZ24taW4nIHx8IF9wYXRoID09PSAnL3NpZ24tdXAnKSAmJlxuXHRcdFx0XHQodXNlciB8fCBpc1N1Y2Nlc3MpXG5cdFx0XHQpIHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCB7IGhhbmRsZUxvZ2luLCBoYW5kbGVSZWdpc3RlciwgZ2V0U3RhdGUgfSA9IHRoaXM7XG5cblx0XHRcdFx0bmV3IGNvbXBvbmVudCgkbWFpbiwge1xuXHRcdFx0XHRcdGhhbmRsZUxvZ2luOiBoYW5kbGVMb2dpbi5iaW5kKHRoaXMpLFxuXHRcdFx0XHRcdGhhbmRsZVJlZ2lzdGVyOiBoYW5kbGVSZWdpc3Rlci5iaW5kKHRoaXMpLFxuXHRcdFx0XHRcdGdldFN0YXRlOiBnZXRTdGF0ZS5iaW5kKHRoaXMpLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHR9XG5cdH07XG5cblx0c2V0RXZlbnQoKSB7XG5cdFx0dGhpcy5hZGRFdmVudCgnY2xpY2snLCAnI25hdmlnYXRpb24nLCAoZSkgPT4ge1xuXHRcdFx0aWYgKCFlLnRhcmdldC5tYXRjaGVzKCcjbmF2aWdhdGlvbiA+IGxpID4gYScpKSByZXR1cm47XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNvbnN0IHBhdGggPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuXHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIHBhdGgpO1xuXHRcdFx0dGhpcy5yZW5kZXIocGF0aCk7XG5cdFx0fSk7XG5cdH1cblxuXHRnZXRTdGF0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy4kc3RhdGU7XG5cdH1cblxuXHRhc3luYyBoYW5kbGVMb2dpbihmb3JtRGF0YSkge1xuXHRcdGNvbnN0IHBheWxvYWQgPSBhd2FpdCBsb2dpblVzZXIoZm9ybURhdGEpO1xuXHRcdGNvbnN0IHsgc3VjY2VzcywgZGF0YSB9ID0gcGF5bG9hZDtcblx0XHRpZiAoc3VjY2Vzcykge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHVzZXI6IGRhdGEsIGlzU3VjY2VzczogdHJ1ZSB9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YWxlcnQoZGF0YSk7XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgaGFuZGxlUmVnaXN0ZXIoZm9ybURhdGEpIHtcblx0XHRjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVnaXN0ZXJVc2VyKGZvcm1EYXRhKTtcblx0XHRjb25zdCB7IHN1Y2Nlc3MsIGRhdGEgfSA9IHBheWxvYWQ7XG5cblx0XHRpZiAoc3VjY2Vzcykge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHVzZXI6IGRhdGEsIGlzU3VjY2VzczogdHJ1ZSB9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YWxlcnQoZGF0YSk7XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgaGFuZGxlTG9nb3V0KCkge1xuXHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyJyk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHVzZXI6IG51bGwgfSwgJ3N0b3BSZW5kZXInKTtcblx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcblx0fVxufVxuIiwiaW1wb3J0IEFwcCBmcm9tICcuL0FwcC5qcyc7XG5pbXBvcnQgJy4vc3R5bGVzL3N0eWxlcy5jc3MnO1xuXG5uZXcgQXBwKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=