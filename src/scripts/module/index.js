define([
    'fn',
    'backbone',
    'module/factory',
    'module/index/routers'
], function(
    fn,
    Backbone,
    moduleFactory,
    routers
) {
    'use strict';
    
    
    var STATE_TOKEN = '?';


    /**
     * Initialise the application state and bind all relevant routers, based on
     * the type of user loading the application.
     */
    function onIndexModuleStart ()
    {
        var module = this,
            app = this.app,
            user_type = app.request('session:user').getType();

        // Unlike when we do all our routing server side, Backbone apps can have state.
        this.state = new Backbone.Model();
        this.passed = [];
        this.routers = {};

        // Initialise routers for user group.
        _.each(routers[user_type], function(Router, key) {
            module.routers[key] = new Router();
            // Tip: As well as setting the function context, .bind() can also be
            // used to pre-populate function arguments. This allows us to pass in a
            // bound version of App.trigger instead of wrapping a call to App.trigger
            // inside another anonymous callback function - useful in many places.
            // See also _.partial() which allows us to not set context.
            module.routers[key].on('route', app.trigger.bind(app, 'navigate'));
        });
    }

    
    function onIndexModuleStop ()
    {
        delete this.passed;
        delete this.state;
        
        _.each(this.routers, function(router) {
            router.controller.close();
        });
        
        delete this.routers;
    }
    
    
    /**
     * Pass aribitrary items between states (where Aastate transition occurs when a 
     * new route is matched and the associated route logic is incurred). This allows
     * us to pass things such as populated models between different states of the
     * application, allowing us to reduce memory usage and load pages instantly.
     * 
     * Passed items are only available for a single state transition, after which
     * the passed object stack is cleared. The same objects can of course be passed
     * again for the next transition.
     * 
     * @param {mixed} item The item to pass.
     * @returns {integer} The number of items that have been passed.
     */
    function doPass (item)
    {
        this.passed.push(item);
        return this.passed.length;
    }
    
    
    /**
     * Receive an object passed by the previous state. Specifying an optional ID
     * and constructor allows us to ensure that the return value will always be
     * of an object type we were expecting. This is useful if you're expecting a
     * model to be passed from a previous state, but one hasn't (e.g. because the
     * route was invoked in a new window).
     * 
     * @param {integer} id The ID of the object expected.
     * @param {function} Constructor The constructor of the the object expected.
     * @returns {mixed} A passed item, or a newly created one if item passed was not expected.
     */
    function doReceive (id, Constructor)
    {
        var item = this.passed.shift(),
            attrs;
        
        // Return whatever item we have if no pattern to match.
        if (!Constructor) {
            return item;
        }
        
        // Check item matches the id-constructor pattern specified.
        if (item instanceof Constructor && item.id === id) {
            return item;
        }
        
        // Create new content based on id and constructor if not matching.
        if (id) {
            attrs = {};
            attrs.id = parseInt(id, 10);
        }
        
        return new Constructor(attrs);
    }
    
    
    /**
     * Retrieve a specific state value, or the entire state model.
     * 
     * @param {string} key The specific state value to get.
     * @returns {Backbone.Model|string|integer|object} The entire state or specified value.
     */
    function doGetState (key)
    {
        return key?
            this.state.get.apply(this.state, arguments):
            this.state;
    }
    
    
    /**
     * Set a state value, using either a key and value or a key-value hash object.
     * 
     * @returns {Backbone.Model}
     */
    function doSetState ()
    {
        this.state.set.apply(this.state, arguments);
        return this.state;
    }
    
    
    /**
     * Clear the application state.
     * 
     * @returns {Backbone.Model}
     */
    function doClearState ()
    {
        this.state.clear.apply(this.state, arguments);
        return this.state;
    }
    
    
    /**
     * Push the application state to the address bar.
     * 
     * @param {object} options The options passed to Backbone.history.navigate.
     * @returns {string} The fragment we are navigating to.
     */
    function doPushState (options)
    {
        var query = $.param(this.state.toJSON()),
            fragment = Backbone.history.getFragment();
        
        // Strip previous state from fragment if exists.
        if (fragment.indexOf(STATE_TOKEN) >= 0) {
            fragment = fragment.split(STATE_TOKEN)[0];
        }
        
        fragment = query ? fragment : (fragment + STATE_TOKEN + query);
        
        Backbone.history.navigate(fragment, options);
        
        return fragment;
    }
    
    
    /**
     * Pull the application state from the address bar.
     * 
     * @param {object} options The options passed to Backbone.Model.set.
     * @returns {string} The fragment we are navigating to.
     */
    function doPullState (options)
    {
        var fragment = Backbone.history.getFragment(),
            state;
        
        if (fragment.indexOf(STATE_TOKEN) < 0) {
            return this.state;
        }
        
        state = fn.parseQueryString(fragment.split(STATE_TOKEN)[1]);
        
        if (state) {
            this.state.set(state, options);
        }
        
        return this.state;
    }


    /**
     * Get the path fragment for an object. This is done by asking the bound
     * routers to see which want to handle the display of this object. Used to
     * navigate to a view which will display the object.
     * 
     * @param {Backbone.Model|Backbone.Collection|object} content The item to route.
     * @param {string} suffix An arbitrary path to append to the route found from asking the routers.
     * @returns {string} The complete fragment which can be navigated to.
     */
    function doGetFragment (content, suffix)
    {
        var fragment = false;

        _.every(this.routers, function(router) {
            return !(fragment = router.generateUrl(content) || false);
        });
        
        if (fragment === false) { return false; }

        return fragment + (suffix ? '/' + suffix : '');
    }


    /**
     * Display an object, by asking the routers to provide a route for displaying
     * the object, and navigating to that route.
     * 
     * @param {object} content
     * @param {string} suffix
     * @param {boolean} trigger
     * @param {boolean} replace
     * @returns {string} The complete fragment we are navigating to.
     */
    function doShow (content, suffix, trigger, replace)
    {
        var fragment = content;

        trigger = (trigger === undefined) ? true : trigger;
        replace = (replace === undefined) ? true : replace;

        if(!_.isString(fragment)) {
            fragment = doGetFragment.call(this, content, suffix);
            doPass.call(this, content);
        }

        Backbone.history.navigate(fragment, {
            trigger: trigger,
            replace: replace
        });

        return fragment;
    }


    /**
     * Check whether an object is being shown by comparing its URL fragment to the
     * one we are currently at.
     * 
     * @param {object} content
     * @returns {Boolean}
     */
    function doCheckShowing (content)
    {
        var content_fragment = doGetFragment.call(this, content),
            current_fragment = Backbone.history.getFragment();

        if (content_fragment === current_fragment) {
            return true;
        }

        if(current_fragment.indexOf(content_fragment + '/') === 0) {
            return true;
        }
    }
    
    
    /**
     * Clear the stack of passed items once a route has been navigated to.
     */
    function onNavigate ()
    {
        this.passed = [];
    }

    
    /**
     * Reload the page on log in.
     */
    function onLogin ()
    {
        window.location.reload();
    }

    
    /**
     * Reload the page on log out.
     */
    function onLogout ()
    {
        window.location.reload();
    }


    return moduleFactory(
        'index',
        onIndexModuleStart,
        onIndexModuleStop,
        // Event listeners.
        {
            navigate: onNavigate,
            login: onLogin,
            logout: onLogout
        },
        // Request handlers.
        {
            // Transisitional state requests.
            'pass': doPass,
            'receive': doReceive,
            
            // Persistent state requests.
            'set': doSetState,
            'get': doGetState,
            'clear': doClearState,
            'push': doPushState,
            'pull': doPullState,
            
            // Navigation requests.
            'fragment': doGetFragment,
            'show': doShow,
            'showing': doCheckShowing
        }
    );
});
