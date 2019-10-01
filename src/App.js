import {html, css, LitElement} from 'lit-element'
// eslint-disable-next-line no-unused-vars
import wc from "./component/InfiniteLoading"

class App extends LitElement {
	static get properties() {
		return {
			isEnabled: {type: Boolean},
		}
	}
	constructor() {
		super()
		this.isEnabled = true
		this.i = 0
		this.list_arr = [
			1, 2, 3,
			// 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9,
		]
	}
	render() {
		const list = this.list_arr.map((item, index)=>{
			return html`<div>${item}</div>`
		})
		return html`
			<div class="app">
				<lit-infinite-loading class="infinite-loading" ?disabled=${!this.isEnabled} direction="toup" @finite=${this.finite_cb}>
					${list}
				</lit-infinite-loading>
			</div>
			<div class="control">
				<button @click=${this.enable}>enable</button>
				<button @click=${this.disable}>disable</button>
			</div>
		`
	}
	enable() {
		this.isEnabled = true
	}
	disable() {
		this.isEnabled = false
	}
	finite_cb(e) {
		const feedback = e.detail.feedback
		this.i++
		if (this.i > 10) {
			return feedback.complete()
		}
		this.list_arr.unshift(1 + this.i * 10, 2 + this.i * 10, 3 + this.i * 10, 4 + this.i * 10, 5 + this.i * 10, 6 + this.i * 10, 7 + this.i * 10, 8 + this.i * 10, 9 + this.i * 10)
		// eslint-disable-next-line promise/no-nesting
		return this.requestUpdate().then(() => {
			return feedback.success()
		})
	}
	static get styles() {
		return css`
			.app{
				width: 60%;
				height: 200px;
				border: 1px solid purple;
			}
			.infinite-loading{
				width: 100%;
				height: 100%;
				overflow-y: auto;
			}
		`
	}
}

customElements.define('lit-app', App)
