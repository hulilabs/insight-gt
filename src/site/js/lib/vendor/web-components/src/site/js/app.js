require([
    'vue',
    'vue-router',
    'web-components/directives/gestures/gestures_directive',
    'web-components/directives/ripple-effect/ripple-effect_directive',
    'web-components/directives/tooltip/tooltip_directive',
    'web-components/bars/app-bar/app-bar_component',
    'web-components/buttons/icon/icon-button_component',
    'web-components/drawers/drawer_component',
    'web-components/lists/list-item_component',
    'site/js/sections',
    'text!pages/layout_template.html',
    'text!pages/home-page_template.html'
],function(
    Vue,
    VueRouter,
    // Directives
    GesturesDirective,
    RippleEffectDirective,
    TooltipDirective,
    AppBar,
    IconButton,
    Drawer,
    ListItem,
    SectionsEnum,
    // App template
    LayoutTemplate,
    HomePageTemplate
) {
    'use strict';

    /**
     * Apply directives
     */
    GesturesDirective.bind();
    RippleEffectDirective.bind();
    TooltipDirective.bind();

    Vue.use(VueRouter);

    /**
     * Returns a promise that will be used to lazy load components.
     * @param {string} module path to the component
     * @return {Promise}
     */
    var load = function(module) {
        return function() {
            return new Promise(function(resolve) {
                require([module], function(ComponentDefinition) {
                    resolve(ComponentDefinition);
                });
            });
        };
    };

    var router = new VueRouter({
        mode : 'history',
        routes : [
            {
                path : '/', component : {
                    template : HomePageTemplate
                }
            },
            {
                path : '/components/app-bar', component : load('pages/app-bar/app-bar-page_component')
            },
            {
                path : '/components/autocomplete', component : load('pages/autocomplete/autocomplete-page_component')
            },
            {
                path : '/components/avatar', component : load('pages/images/avatar/avatar-page_component')
            },
            {
                path : '/components/calendar', component : load('pages/inputs/calendar/calendar-page_component')
            },
            {
                path : '/components/card', component : load('pages/card/card-page_component')
            },
            {
                path : '/components/canvas', component : load('pages/canvas/canvas-page_component')
            },
            {
                path : '/components/chip', component : load('pages/chips/chip/chip-page_component')
            },
            {
                path : '/components/checkbox', component : load('pages/selection-controls/checkbox/checkbox-page_component')
            },
            {
                path : '/components/custom-logic', component : load('pages/inputs/custom-logic/custom-logic-page_component')
            },
            {
                path : '/components/errors', component : load('pages/errors/errors-page_component')
            },
            {
                path : '/components/expandable-panel', component : load('pages/panels/expandable-panel/expandable-panel-page_component')
            },
            {
                path : '/components/deleter', component : load('pages/deleter/deleter-page_component')
            },
            {
                path : '/components/dialog', component : load('pages/dialog/dialog-page_component')
            },
            {
                path : '/components/drawer', component : load('pages/drawer/drawer-page_component')
            },
            {
                path : '/components/dropdown', component : load('pages/dropdown/dropdown-page_component')
            },
            {
                path : '/components/fab', component : load('pages/buttons/fab/fab-page_component')
            },
            {
                path : '/components/flat-button', component : load('pages/buttons/flat/flat-button-page_component')
            },
            {
                path : '/components/icon', component : load('pages/icon/icon-page_component')
            },
            {
                path : '/components/char-counter', component : load('pages/inputs/char-counter/char-counter-page_component')
            },
            {
                path : '/components/datepicker', component : load('pages/inputs/datepicker/datepicker-page_component')
            },
            {
                path : '/components/input-container', component : load('pages/inputs/input-container/input-container-page_component')
            },
            {
                path : '/components/icon-button', component : load('pages/buttons/icon/icon-button-page_component')
            },
            {
                path : '/components/image-button', component : load('pages/buttons/image/image-button-page_component')
            },
            {
                path : '/components/loaders/circular', component : load('pages/loader/circular/circular-loader-page_component')
            },
            {
                path : '/components/loaders/linear', component : load('pages/loader/linear/linear-loader-page_component')
            },
            {
                path : '/components/loaders/skeleton', component : load('pages/loader/skeleton/skeleton-loader-page_component')
            },
            {
                path : '/components/list', component : load('pages/list/list-page_component')
            },
            {
                path : '/components/markdown', component : load('pages/markdown/markdown-page_component')
            },
            {
                path : '/components/menu', component : load('pages/menu/menu-page_component')
            },
            {
                path : '/components/onboarding', component : load('pages/onboarding/onboarding-page_component')
            },
            {
                path : '/components/overlay', component : load('pages/overlay/overlay-page_component')
            },
            {
                path : '/components/password', component : load('pages/inputs/password/password-page_component')
            },
            {
                path : '/components/pull-up-dialog', component : load('pages/pull-up-dialog/pull-up-dialog-page_component')
            },
            {
                path : '/components/radio-button', component : load('pages/selection-controls/radio-button/radio-button-page_component')
            },
            {
                path : '/components/switch', component : load('pages/selection-controls/switch/switch-page_component')
            },
            {
                path : '/components/raised-button', component : load('pages/buttons/raised/raised-button-page_component')
            },
            {
                path : '/components/savers', component : load('pages/saver/saver-page_component')
            },
            {
                path : '/components/search-box', component : load('pages/search/search-box/search-box-page_component')
            },
            {
                path : '/components/search-dropdown', component : load('pages/search/search-dropdown/search-dropdown-page_component')
            },
            {
                path : '/components/search-selector', component : load('pages/search/search-selector/search-selector-page_component')
            },
            {
                path : '/components/snackbar', component : load('pages/snackbar/snackbar-page_component')
            },
            {
                path : '/components/step-dots', component : load('pages/step-dots/step-dots-page_component')
            },
            {
                path : '/components/stepper', component : load('pages/stepper/stepper-page_component')
            },
            {
                path : '/components/table', component : load('pages/table/table-page_component')
            },
            {
                path : '/components/tabs', component : load('pages/tabs/tabs-page_component')
            },
            {
                path : '/components/textarea', component : load('pages/inputs/textarea/textarea-page_component')
            },
            {
                path : '/components/textfield', component : load('pages/inputs/textfield/textfield-page_component')
            },
            {
                path : '/components/thumbnail', component : load('pages/images/thumbnail/thumbnail-page_component')
            },
            {
                path : '/components/time-picker', component : load('pages/inputs/time-picker/time-picker-page_component')
            },
            {
                path : '/components/tooltip', component : load('pages/tooltip/tooltip-page_component')
            },
            {
                path : '/components/toggle', component : load('pages/selection-controls/toggle/toggle-page_component')
            },
            {
                path : '/components/add-photo', component : load('pages/uploaders/add-photo/add-photo-page_component')
            },
            {
                path : '/behaviors/floating-layer', component : load('pages/behaviors/floating-layer/floating-layer-page_component')
            },
            {
                path : '/behaviors/pagination', component : load('pages/behaviors/pagination/pagination-page_component')
            },
            {
                path : '/directives/gestures', component : load('pages/gestures/gestures-page_component')
            },
            {
                path : '/effects/ripple', component : load('pages/ripple/ripple-page_component')
            },
            {
                path : '/typography', component : load('pages/typography/typography-page_component')
            }
        ]
    });

    /**
     * Root component or router component
     */
    new Vue({
        router : router,
        template : LayoutTemplate,
        data : function() {
            return {
                state : {
                    showNav : false
                },
                sections : SectionsEnum.ITEMS
            };
        },
        methods : {
            toggleDrawer : function() {
                this.state.showNav = !this.state.showNav;
            },
            drawerChanged : function(newState) {
                this.state.showNav = newState.active;
            }
        },
        components : {
            'wc-icon-button' : IconButton,
            'wc-app-bar' : AppBar,
            'wc-drawer' : Drawer,
            'wc-list-item' : ListItem
        }
    }).$mount('#app');

});
