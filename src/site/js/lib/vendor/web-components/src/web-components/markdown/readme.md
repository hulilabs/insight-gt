# `wc-Markdown` documentation

The markdown components, translate markdown syntax to HTML.

Useful to write documentation for the site and github.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `source` | String | No | null | Markdown string to translate to HTML

``` html
<wc-markdown source="#Title \n##Subtitle"></wc-markdown>
```

**Tip:** you can use the text plugin to load markdown files

``` javascript
define([
    'text!path/to/the/file.md',
], function(
    MarkdownSource
) {
    data : {
        markdownSource : MarkdownSource
    }
});
```

```html
<wc-markdown v-bind:source="markdownSource"></wc-markdown>
```

### Slots

Use the default slot to write the markdown

**Important** : notice that the indentation starts at the beginning of the line..

**Example :**

``` html
    <wc-Markdown>
# Title

**Click in the next button to see how it works**
    </wc-Markdown>
```
