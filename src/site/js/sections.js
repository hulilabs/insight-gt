/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | '_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */

/**
 * @file navigation sections
 * @description provides an Enum for all the available options on the main navigation
 * register here all the necessary paths.
 * @module practice/component/navigation/sections
 */

define({
    ITEMS : [
        {name : 'Components'},
        {path : '/components/app-bar', name : 'App bar' },
        {path : '/components/autocomplete', name : 'Autocomplete'},
        {path : '/components/card', name : 'Card' },
        {path : '/components/chip', name : 'Chip' },
        {path : '/components/deleter', name : 'Deleter' },
        {path : '/components/dialog', name : 'Dialog' },
        {path : '/components/drawer', name : 'Drawer' },
        {path : '/components/dropdown', name : 'Dropdown' },
        {path : '/components/errors', name : 'Errors' },
        {path : '/components/icon', name : 'Icon' },
        {path : '/components/list', name : 'List' },
        {path : '/components/markdown', name : 'Markdown' },
        {path : '/components/menu', name : 'Menu' },
        {path : '/components/onboarding', name : 'Onboarding' },
        {path : '/components/overlay', name : 'Overlay' },
        {path : '/components/pull-up-dialog', name : 'PullUpDialog' },
        {path : '/components/savers', name : 'Saver'},
        {path : '/components/snackbar', name : 'Snackbar' },
        {path : '/components/step-dots', name : 'Step Dots' },
        {path : '/components/stepper', name : 'Stepper' },
        {path : '/components/table', name : 'Table'},
        {path : '/components/tabs', name : 'Tabs' },
        {path : '/components/tooltip', name : 'Tooltip' },

        {name : 'Search'},
        {path : '/components/search-box', name : 'Search box'},
        {path : '/components/search-dropdown', name : 'Search dropdown'},
        {path : '/components/search-selector', name : 'Search selector'},

        {name : 'Buttons'},
        {path : '/components/fab', name : 'Floating Action Button' },
        {path : '/components/flat-button', name : 'Flat Button' },
        {path : '/components/icon-button', name : 'Icon Button' },
        {path : '/components/raised-button', name : 'Raised Button' },

        {name : 'Images'},
        {path : '/components/avatar', name : 'Avatar' },
        {path : '/components/canvas', name : 'Canvas' },
        {path : '/components/thumbnail', name : 'Thumbnail' },

        {name : 'Inputs'},
        {path : '/components/calendar', name : 'Calendar' },
        {path : '/components/char-counter', name : 'Character Counter' },
        {path : '/components/checkbox', name : 'Checkbox/Checklist' },
        {path : '/components/custom-logic', name : 'Custom Logic' },
        {path : '/components/datepicker', name : 'Date Picker' },
        {path : '/components/input-container', name : 'Input Container' },
        {path : '/components/password', name : 'Password' },
        {path : '/components/radio-button', name : 'Radio Button' },
        {path : '/components/textarea', name : 'Text Area' },
        {path : '/components/textfield', name : 'Text Field' },
        {path : '/components/time-picker', name : 'Time Picker' },
        {path : '/components/toggle', name : 'Toggle' },

        {name : 'Loaders'},
        {path : '/components/loaders/linear', name : 'Linear'},
        {path : '/components/loaders/circular', name : 'Circular'},
        {path : '/components/loaders/skeleton', name : 'Skeleton'},

        {name : 'Panels'},
        {path : '/components/expandable-panel', name : 'Expandable panel' },

        {name : 'Uploaders'},
        {path : '/components/add-photo', name : 'Add Photo' },

        {name : 'Behaviors'},
        {url : 'https://github.com/hulilabs/web-components/tree/master/src/web-components/behaviors/a11y/button-focus', name : 'Button focus' },
        {path : '/behaviors/floating-layer#sandbox', name : 'Floating layer Behavior' },
        {url : 'https://github.com/hulilabs/web-components/tree/master/src/web-components/behaviors/a11y/keyboard-focus', name : 'Keyboard focus' },
        {url : 'https://github.com/hulilabs/web-components/tree/master/src/web-components/behaviors/a11y/selection-control-focus', name : 'Selection control focus' },

        {name : 'Directives'},
        {path : '/directives/gestures', name : 'Gestures' },
        {path : '/effects/ripple#directive', name : 'Ripple effect' },
        {path : '/components/tooltip#directive', name : 'Tooltip Directive' },

        {name : 'Mixins'},
        {path : '/behaviors/floating-layer#mixin', name : 'Floating layer Mixin' },
        {url : 'https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#input-behavior-mixin-documentation', name : 'Input Behavior' },
        {url : 'https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#input-container-behavior-mixin-documentation', name : 'Input Container Behavior' },

        {name : 'Typography'},
        {path : '/typography', name : 'Typography guidelines' },
    ]
});
