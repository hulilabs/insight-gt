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
    'text!pages/home-page_template.html',
], function(
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
     * @return {function(): Promise<any>}
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
        mode: 'history',
        routes: [
            {
                path: '/',
                component: {
                    template: HomePageTemplate,
                },
            },
            {
                path: '/canvas',
                component: load('pages/canvas/canvas-page_component'),
            },
        ],
    });

    /**
     * Root component or router component
     */
    new Vue({
        router: router,
        template: LayoutTemplate,
        data: function() {
            return {
                state: {
                    showNav: false,
                },
                sections: SectionsEnum.ITEMS,
            };
        },
        methods: {
            toggleDrawer: function() {
                this.state.showNav = !this.state.showNav;
            },
            drawerChanged: function(newState) {
                this.state.showNav = newState.active;
            },
        },
        components: {
            'wc-icon-button': IconButton,
            'wc-app-bar': AppBar,
            'wc-drawer': Drawer,
            'wc-list-item': ListItem,
        },
    }).$mount('#app');
});
