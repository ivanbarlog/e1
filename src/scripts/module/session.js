define([
    'store',
    'module/factory',
    'i18n!nls/user'
], function(
    store,
    moduleFactory,
    str
) {
    'use strict';


    function onSessionModuleStart ()
    {
        this.user = this.app.request('data:get', 'user');
    }


    function onSessionModuleStop ()
    {
        delete this.user;
    }


    function doSessionGetUser ()
    {
        return this.user;
    }


    function doSessionCheckAuthenticated ()
    {
        return !this.user.isAnonymous();
    }


    function doSessionLogin (data)
    {
        var app = this.app,
            dfr = new $.Deferred();

        $.post(app.options.endpoint + 'login', data).then(function () {
            app.trigger('login');
            dfr.resolve();
        }, function() {
            dfr.reject(str.login_error);
        });

        return dfr.promise();
    }


    function doSessionLogout ()
    {
        var app = this.app,
            dfr = new $.Deferred();

        $.post(app.options.endpoint + 'logout').then(function() {
            app.trigger('logout');
            dfr.resolve();
        }, function() {
            dfr.reject();
        });

        return dfr.promise();
    }


    function doSessionSet (key, value)
    {
        return store.set(key, value);
    }


    function doSessionGet (key)
    {
        return store.get(key);
    }


    function doSessionClear ()
    {
        return store.clear();
    }


    return moduleFactory(
        'session',
        onSessionModuleStart,
        onSessionModuleStop,
        // Event listeners.
        {},
        // Request handlers.
        {
            user: doSessionGetUser,
            authenticated: doSessionCheckAuthenticated,
            login: doSessionLogin,
            logout: doSessionLogout,
            set: doSessionSet,
            get: doSessionGet,
            clear: doSessionClear
        }
    );
});
