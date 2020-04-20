# Helpers

## Vue Helpers

### bypassComputed

Bypass a vue component computed property to another object definition
Commonly used by binders for bypassing reactive properties

| Name | Type | Description
| --- | --- | ---
| component | VueComponent | component instance
| computedKey | String | computed propery name
| storeVar | Object | variable used to bypass computed property
| storeKey | String | destiny property name
