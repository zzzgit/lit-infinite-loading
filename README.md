# lit-infinite-loading
Infinite loading component for lit-element.
## installation
via `npm`: 
```shell
npm i lit-infinite-loading
```

## how to load
```html
<!-- From CDN -->
<script async type="module" src="https://unpkg.com/lit-infinite-loading"></script>

<!-- From local installation -->
<script async type="module" src="/node_modules/lit-infinite-loading"></script>

<!-- In a Module -->
<script type="module">
  import '/node_modules/lit-infinite-loading'
  // ...
</script>
```

## usage
### render:
```js
`<lit-infinite-loading class="infinite-loading" ?disabled=${false} direction="toup" @finite=${this.finite_cb}>
	${
		this.list_arr.map((item, index) => {
			return html`<div>${item}</div>`
		})
	}
</lit-infinite-loading>`
```
### callback:
```js
finite_cb(e) {
    const feedback = e.detail.feedback
    this.list_arr.unshift(1, 2, 3)
    return this.requestUpdate().then(() => {
        return feedback.success()
    })
}
```
### css:
```css
.infinite-loading{
	width: 200px;
	height: 200px;
	overflow-y: auto;
}
```
### setting:
`<lit-infinite-loading>` exposes a set of custom properties for your customizing delight:
Property|Purpose|Default
-----|-----|-----
`--disabled`|to disable the functionality|false
`--direction`|trigger the loading behavior from bottom to up or in opposite? 'todown' adn 'toup' are applicable|todown
### event and feedback
There will be only one event `finite` which may be triggered after the scoll bar has been scrolled.
You can acquire the feedback object via `e.detail.feedback` in the event listener. And then there are several methods of the feedback object:
method|description
-----|-----
`success`|notify the loading process has been successful
`complete`|notify the loading process has completely been ended
`fail`|notify the loading process has been failed
### slot
There are several slots you can use. 
slot|description
-----|-----
`default`|content or children of this component
`state-nomore`|indicate no more content can be loaded
`state-noresult`|indicate no content can be loaded at all
`state-error`|failed in loading
`state-loading`|indicate loading state
`state-idle`|indicate idle state
All the named slots will show their fallbacks if not been sloted.
## browser compatibility
IE is not supported, please only use it in modern browsers.
