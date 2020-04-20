# `<wc-pull-up-dialog>` documentation

Dialog with app bar for touch small devices.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `title` | String | false | '' | App bar title

### Slots

| Name | Description |
| --- | --- |
| `cover` | Space for an image cover, if it's not present, the component shows an overlay |
| `avatar` | Avatar component for the header |
| `actions` | Wrapper for the actions |
| `header` | Header content, this is shown when the dialog is expanded |
| `body` | Main content, this is shown when the dialog is collapsed |

### Events

You can access them PullUpDialog.EVENTS

#### `pull-up-closed`

Fired when a close action is executed.

#### `pull-up-hit-bottom`

Fired when the user has scrolled down to the bottom, for lazy loading.

## Examples

``` html
<wc-pull-up-dialog
        ref="pullUpDialog"
        title="Pull Up dialog title"
        v-on:pull-up-close="onPullUpClosed">
    <div slot="cover"
        style="background : url(http://app-layout-assets.appspot.com/assets/test-drive.jpg) no-repeat;width: 100%;height: 200px;background-size : cover;background-clip : border-box;">
    </div>
    <wc-avatar slot="avatar"
               style="flex-shrink: 0;flex-grow: 0;border:4px solid white;background-color: white"
               class="wc-Avatar--size-12x"
               image-path="/site/img/doctor-male.svg">
    </wc-avatar>
    <wc-icon-button slot="actions"
                    icon-class="icon-close"
                    v-wc-gesture:tap="closePullUp"
                    smart-focus>
    </wc-icon-button>
    <div slot="header"
         style="display : flex;align-items : center;flex-flow : column nowrap;justify-content : initial;height: 152px;">
        <span>Pull Up dialog title</span>
        <p>23 años, 15 meses, 456 dias</p>
    </div>
    <div slot="body"
         style="background : white;height : 1800px;">
        <span tyle="position: absolute;top:0">TOP</span>
        <span style="position: absolute;bottom:0">Bottom</span>
    </div>
</wc-pull-up-dialog>
```

## Styles

Is really important to know that when this component is active, the body should have overflow:hidden

### Issues history

* Created on [HULI-2174](https://hulihealth.atlassian.net/browse/HULI-2174)
