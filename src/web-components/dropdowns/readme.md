# `<wc-dropdown>` documentation

Dropdown component, it must be used as an input with a set of options, and select one of them. It can be used with icons, search by the initial of the options and has interaction with the keyboard (space, enter, up, down).

## API

### Props

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `altPlaceholder` | String | false | `null` | Used only for native dropdown component. It is used as the first option in the dropdown menu and when it's set, it change its color as a placeholder
| `disabled` | Boolean | false | false | Defines if the dropdown will be disabled or not
| `ellipsis` | Boolean | false | false | Use ellipsis when input content overflows
| `native` | Boolean | false | false | Flag to set the dropdown as a native component (used for mobile devices)
| `options` | Array | true | - | Options of the dropdown
| `setIconOnly` | Boolean | false | false | Flag used for dropdowns that contains icons in their options, if it's true, the selected option will set the icon on the dropdown input
| `required` | Boolean | false | false | Sets dropdown as required and add styles
| `value` | String, Number | false | `null` | Value used for cases when the dropdown has a selected value when it's created

### Methods

#### `getValue()`

Gets the current value of the dropdown.

#### `getInputText()`

Gets the current text set in the dropdown input.

### Events

#### ON_INPUT : { String value }

Fired when the user selects an option. Provides the current value

## Notes

* Use `v-model` in the parent component to use two-way data binding and sync a variable of the parent with the dropdown value.

## Examples

``` html
<wc-dropdown
    v-bind:alt-placeholder="Seleccione una provincia"
    v-bind:floatingLabel="hasFloatingLabel"
    v-bind:label="Provincia"
    v-bind:options="provinceOptions"
    v-bind:placeholder="Provincia"
    v-bind:value="selectedProvinceValue">
</wc-dropdown>

<wc-dropdown
    v-bind:alt-placeholder="Seleccione una provincia"
    v-bind:floatingLabel="hasFloatingLabel"
    v-bind:label="Provincia"
    v-bind:native="isNative"
    v-bind:options="provinceOptions"
    v-bind:placeholder="Provincia"
    v-bind:value="selectedProvinceValue">
</wc-dropdown>

<wc-dropdown
    v-bind:alt-placeholder="Seleccione una provincia"
    v-bind:has-error="hasError"
    v-bind:errorMessage="Elija una provincia"
    v-bind:options="provinceOptions"
    v-bind:placeholder="Provincia">
</wc-dropdown>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-dropdown-menu-max-height` | Max height for the desktop dropdown menu | 464px
| `$wc-dropdown-menu-min-heigh`t | Min height for the desktop dropdown menu | 80px
| `$wc-dropdown-placeholder-option-color` | Used only for the desktop dropdown | rgba(0,0,0,0.54)
| `$wc-dropdown-mobile-placeholder-color` | Used only for the mobile dropdown, used for the placeholder color | rgba(0,0,0,0.54)
| `$wc-dropdown-mobile-option-color` | Used only for the mobile dropdown, used for the color of all of the options of the dropdown menu | rgba(0,0,0,0.87)


## References

### Design references

* Material guidelines : https://material.io/guidelines/components/menus.html#menus-usage
* Guidelines : https://zpl.io/Z28Spbo

### Examples in other libraries

* https://elements.polymer-project.org/elements/paper-dropdown-menu?view=demo:demo/index.html&active=paper-dropdown-menu
* http://react-toolbox.com/#/components/dropdown

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1507
