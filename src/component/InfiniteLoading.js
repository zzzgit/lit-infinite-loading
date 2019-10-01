import {html, css, LitElement} from 'lit-element'
import throttle from 'lodash.throttle'

const STATES = {
	IDLE: Symbol(), // 闲置状态
	LOADING: Symbol(), // 正在加载
	NOMORE: Symbol(), // 没有更多
	NORESULT: Symbol(), // 无数据
	ERROR: Symbol(), // 加载失败
}

class InfiniteLoading extends LitElement {
	static get properties() {
		return {
			direction: {type: String},
			disabled: {type: Boolean},
			_state: {type: Symbol, reflect: false},
		}
	}
	constructor() {
		super()
		this.direction = this.direction || "todown"
		this.feedback = {}
		this._state = STATES.IDLE
		this._figureoutState = throttle(this.__figureoutState, 50, {"leading": true, 'trailing': true})
		this.i = 0
	}
	render() {
		const renderStatePrompt = (direction)=>{
			if (this.direction == "todown" && direction === 1) {
				return html``
			}
			if (this.direction == "toup" && direction === -1) {
				return html``
			}
			if (this._state === STATES.NOMORE) {
				return html`<slot name="state-nomore">no more</slot>`
			}
			if (this._state === STATES.NORESULT) {
				return html`<slot name="state-noresult">no result</slot>`
			}
			if (this._state === STATES.ERROR) {
				return html`<slot name="state-error">error</slot>`
			}
			if (this._state === STATES.LOADING) {
				return html`<slot name="state-loading">loading</slot>`
			}
			if (this._state === STATES.IDLE) {
				return html`<slot name="state-idle"></slot>`
			}
		}
		return html`
			<div class="infinite-state-prompt">
				${renderStatePrompt(1)}
			</div>
			<slot class="content"></slot>
			<div class="infinite-state-prompt">
				${renderStatePrompt(-1)}
			</div>
		`
	}
	feedback_loaded() {
		if (this.isToup) {
			this.scrollTop = this.scrollHeight - this.oldHeight + this.oldTop
		}
		this._state = STATES.IDLE
	}
	feedback_completed() {
		this._state = STATES.NOMORE
	}
	firstUpdated() {
		this.isToup = this.direction === "toup"
		this.feedback.success = this.feedback_loaded.bind(this)
		this.feedback.complete = this.feedback_completed.bind(this)
		this.feedback.fail = this.feedback_errored.bind(this)
		this.addEventListener("scroll", () => {
			this._figureoutState()
		})
		this._figureoutState()
	}
	_emit(eventName, payload) {
		const event = new CustomEvent(eventName, {
			detail: payload,
		})
		return this.dispatchEvent(event)
	}
	attributeChangedCallback(attr, oldValue, newValue) {
		super.attributeChangedCallback(attr, oldValue, newValue)
		if (!this.watch || !this.watch.apply) {
			return null
		}
		if (!this._watch) {
			this._watch = this.watch()
		}
		if (this._watch.hasOwnProperty(attr)) {
			const watcher = this._watch[attr]
			watcher.bind(this, newValue, oldValue)()
		}
	}
	__figureoutState() {
		if (this.disabled) {
			return null
		}
		if (this._state !== STATES.IDLE) {
			return null
		}
		const distance = this.isToup ? this.scrollTop : this.scrollHeight - this.scrollTop - this.clientHeight
		if (distance > 30) {
			return null
		}
		// 距离偏移，影响计算
		this._state = STATES.LOADING
		if (this.isToup) {
			this.oldHeight = this.scrollHeight
			this.oldTop = this.scrollTop
		}
		this.finite()
	}
	feedback_errored() {
		// need a stratagy
		this._state = STATES.ERROR
	}
	finite() {
		// 需要防止死循環
		this._emit('finite', {
			feedback: this.feedback,
		})
	}
	watch() {
		return {
			disabled(value, old) {
				if (!this.disabled) {
					// to avoid render circle
					return Promise.resolve().then(() => this._figureoutState())
				}
			},
		}
	}
	static get styles() {
		return css`
			:host {
				display: block;
			}
			slot {
			}
			.infinite-state-prompt {
				width: 100%;
				text-align: center;
			}
		`
	}
}

customElements.define('lit-infinite-loading', InfiniteLoading)

