require([
    'vue',
    'vue-router',
    'text!pages/layout_template.html',
    'text!pages/home-page_template.html',
], function(
    Vue,
    VueRouter,
    // Directives
    // App template
    LayoutTemplate,
    HomePageTemplate
) {
    'use strict';
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
                sections: null,
            };
        },
    }).$mount('#app');
});
