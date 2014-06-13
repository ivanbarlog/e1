define([
    'global',
    'marionette',
    'view/user/account',
    'view/error'
], function(
    global,
    Marionette,
    UserAccountView,
    ErrorView
) {
    'use strict';
    
    
    function showAccount ()
    {
        var user = global.app.request('session:user');
        
        global.app.main.show(new UserAccountView({
            model: user
        }));
    }
    
   
    function showError (route)
    {
        var user = global.app.request('session:user');
        
        global.app.main.show(new ErrorView({
            model: user,
            route: route
        }));
    }
    
    
    return Marionette.Controller.extend({
        
        showAccount: showAccount,
        showError: showError
        
    });
});
