# Divider

It is a line used to divide or set the limits in content.

This is not a VUE component, it is just a BEM block (CSS).

**Example:**

``` html
<div class="wc-Divider">
```

## Modifiers

| Modifier| Description |
| --- | --- |
| --light | set the divider line with the light theme color | 
| --verticalSpace | set margin top and bottom of 8px | 


## Mixin

There is also a mixin to set the divider as a part of another component.

``` css
wc-component {
    @include generate-divider($wc-dividers-dark);
}
```
