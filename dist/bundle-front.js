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