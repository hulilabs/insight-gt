# `<wc-expandable-panel>` documentation

A panel that display content and is collapsible

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `title` | String | false | - | Define panel title shown at header

### Slots

| Name | Description |
| --- | --- |
| `action` | secondary action placed inside header |
| `beforeContent` | include html content before the scrollable area |
| `content` | scrollable area wrapper of main content |

### Events

#### `ON_TOGGLE` : `expandable-panel-toggle` : { Boolean wasOpened, Boolean isOpened }

Fired on primary toggle action click. Payload represents the transition states

## Examples

``` html
<wc-expandable-panel title="testing title">
    <div slot="content">
        <p>Put any content inside this panel</p>
    </div>
</wc-expandable-panel>
```
``` html
<wc-expandable-panel title="testing title">
    <wc-icon-button slot="action" icon-class="icon-close" light></wc-icon-button>
    <div slot="beforeContent">
        <wc-flat-button>terciary action</wc-flat-button>
    </div>
    <div slot="content">
        <p>Panel with secondary and terciary action, plus scrollable content</p>
    </div>
</wc-expandable-panel>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-expandable-panel-border-radius` | border radius | 4px
| `$wc-expandable-panel-header-background` | header background color | #37474f
| `$wc-expandable-panel-header-color` | header text color | white
| `$wc-expandable-panel-header-height` | header fixed height | 56px
| `$wc-expandable-panel-header-padding` | header padding spaces | 8px 8px 8px 24px
| `$wc-expandable-panel-max-height` | 5 items each of 48px height plus 4 dividers of 1px | 244px
| `$wc-expandable-panel-title-padding` | title padding space | 10px 8px 10px 0
| `$wc-expandable-panel-title-width` | title fixed width | 244px
| `$wc-expandable-panel-width` | panel width | 360px

## References

### Design references

* Guidelines : https://zpl.io/Z1D3sON

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1922
