# `<wc-password>` documentation

A simple password input that allows to reveal or hide the password content by clicking in the input's action

## API

### Props

@see [InputBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props)

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `revealed` | Boolean | No | false | Determines whether or not the password is revealed

### Methods

#### `setValue(string value, boolean shouldTriggerState)`

Sets the components's value and if the option is given, triggers an `input` event which allows to update the value of the variable used with `v-model`

#### `focus()`

Sets the focus state of the input and the input container components.

| Param | Type | Required | Note
| ---- | --- | --- | ---
| `shouldTriggerState` | Boolean | false | If the child textfield component should trigger the ON_INPUT event for notifying its state changes

### Events

#### `blur`

Fired when the password component loses focus. Provides the current value as payload.

#### `focus`

Fired when the password component gains focus. Provides the current value as payload.

#### `input`

Fired when the password component input's value is changed. **This event is required by `v-model` for handling the parent-child interaction**

## Examples

``` html
<!-- Password component with floating label and v-model -->
<wc-password v-model="parentVariable" label="Password" floating-label></wc-password>
```

## References

### Design references

* Material guidelines : https://material.google.com/components/text-fields.html
* Guidelines : https://zpl.io/Z2absbx

### Issues history

* Created on [HULI-3010](https://hulihealth.atlassian.net/browse/HULI-3010)


# `<wc-password-strength>` documentation

A decorator of the `wc-password-strength` component that adds a password strength
meter, this meter can be used in any place where the user has to enter a
new password in order to provide feedback on the quality of the password.

The component generates a score for the inputted password according to this description (taken from https://github.com/dropbox/zxcvbn#usage):

|score|strength|description|
| --- | --- | ---
|`0` | too guessable | risky password. (guesses < 10^3)|
|`1` | very guessable | protection from throttled online attacks. (guesses < 10^6) |
|`2` | somewhat guessable | protection from unthrottled online attacks. (guesses < 10^8)
|`3` | safely unguessable | moderate protection from offline slow-hash scenario. (guesses < 10^10)
|`4` | very unguessable | strong protection from offline slow-hash scenario. (guesses >= 10^10)


## Implementation Notes
This component uses https://github.com/dropbox/zxcvbn
to provide the strength evaluation, this library is a bit heavy (~400Kb) due to the
dictionary that it contains, therefore, make sure to lazy load this component
wherever it's needed.

## API

### Props

@see [InputBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props)

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)

@see [Password](#props)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `dictionary` | Array | No | `['Huli']` | use this prop to provided additional words that will lower the overall score of the password, for example provide the user name or the email.
| `score-medium` | String | Yes |  | the label displayed when the score is `2`,
| `score-strong` | String | Yes |  | the label displayed when the score is `3`,
| `score-strongest` | String | No | null | the label displayed when the score is `4`, when it is not provided, it will use `score-strong`.
| `score-weak` | String | Yes | | the label displayed when the score is `1`,
| `score-weakest` | String | No | null | the label displayed when the score is `0`, when it is not provided, it will use `score-weak`.
| `strength-hint-text` | String | Yes | | the label for the meter e.g. _The password strength is_

### Slots

@see [InputContainer](https://github.com/hulilabs/web-components/tree/master/src/web-components/inputs/input-container#slots)

### Methods

@see [Password](#methods)

### Events

@see [Password](#events)

#### `password-strength-score`

Fired when the score of the password input changes to a new value (0-4).

## Examples

``` html
<!-- Password strength component with label and v-model -->
<wc-password-strength
    v-model="model"
    label="Password"
    strength-hint-text="Password strength"
    score-weakest="Unsafe"
    score-weak="Weak"
    score-medium="Medium"
    score-strong="Strong"
    score-strongest="Very strong"
    v-bind:dictionary="blacklist"
></wc-password-strength>
```