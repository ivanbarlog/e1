(function(window) {

    'use strict';
    
    require.config({
        paths: {
            // Prefixes.
            'templates': '../templates',
            'nls': '../lang',

            // Plugins.
            'text': '../vendor/bower/requirejs-text/text',
            'i18n': '../vendor/bower/requirejs-i18n/i18n',
            'async': '../vendor/bower/requirejs-plugins/src/async',
            'json': '../vendor/bower/requirejs-plugins/src/json',

            // Data.
            'primer': '/primer',

            // Vendor.
            'jquery': '../vendor/bower/jquery/dist/jquery',

            // Backbone.
            'underscore': '../vendor/bower/underscore/underscore',
            'backbone': '../vendor/bower/backbone/backbone',
            'backbone.babysitter': '../vendor/bower/backbone.babysitter/lib/backbone.babysitter',
            'backbone.wreqr': '../vendor/bower/backbone.wreqr/lib/amd/backbone.wreqr',
            'backbone.syphon': '../vendor/bower/backbone.syphon/lib/amd/backbone.syphon',
            'marionette': '../vendor/bower/backbone.marionette/lib/core/amd/backbone.marionette',

            // Utility.
            'moment': '../vendor/bower/moment/moment',
            'modernizr': '../vendor/libs/modernizr/modernizr-custom',
            'fastclick': '../vendor/bower/fastclick/lib/fastclick',
            'store': '../vendor/bower/store-js/store',

            // UI.
            'bootstrap': '../vendor/bower/bootstrap/dist/js/bootstrap',
            'alertify': '../vendor/bower/alertify.js/lib/alertify',
            'selectize': '../vendor/bower/selectize/dist/js/standalone/selectize',
            'pikaday': '../vendor/bower/pikaday/pikaday',
            'nprogress': '../vendor/libs/nprogress-master/nprogress'
        },
        shim: {
            jquery: {exports: ['jQuery', '$']},
            underscore: {exports: '_'},
            backbone: {deps:['jquery', 'underscore'], exports:'Backbone'},
            marionette: {deps:['jquery', 'underscore', 'backbone'], exports:'Marionette'},
            syphon: {deps: ['backbone']},
            bootstrap: {deps: ['jquery']},
            alertify: {deps: ['jquery']},
            selectize: {deps: ['jquery']},
            pikaday: {deps: ['jquery']}
        }
    });


    // Provide global reference, ensure config is loaded first.
    define('global', ['config'], function(config) {
        
        // Load async & config-dependent modules.
        define('google.maps', [
            'async!http://maps.google.com/maps/api/js?libraries=places&key=' + config.goog_api_key + '&sensor=false'
        ], function() {
            return window.google.maps;
        });
        
        return window;
    });
    
    
    // Load everything.
    require([
        'global',
        'config',
        'backbone',
        'app',
        'modules',
        'modernizr'
    ], function(
        global,
        config,
        Backbone,
        App,
        modules
    ) {
    
        /**
         * Apply patches to library mechanisms.
         * 
         * @returns {undefined}
         */
        function initPatches()
        {
            // Prepend API endpoint to URLs.
            Backbone.ajax = function(request) {

                if (request.url.indexOf(config.endpoint) !== 0 && request.url[0] !== '/') {
                    request.url = config.endpoint + request.url;
                }

                return Backbone.$.ajax.apply(Backbone.$, [request]);
            };
        }


        /**
         * Initialise application modules.
         * 
         * @returns {undefined}
         */
        function initModules()
        {
            _.each(modules.init, function(definition, name) {
                this.module(name, definition);
            }, this);
        }

        global.app = new App();

        global.app.addInitializer(initPatches);
        global.app.addInitializer(initModules);

        if (global.navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
            global.document.addEventListener('deviceready', function(){
                global.app.start(config);
            }, false);
        } else {
            global.app.start(config);
        }
    });

})(window);