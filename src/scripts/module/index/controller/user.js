define([
    'global',
    'marionette',
    'view/user/account'
], function(
    global,
    Marionette,
    UserAccountView
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
        global.app.request('gui:error', '404 Not Found: ' + route);
    }
    
    
    return Marionette.Controller.extend({
        
        showAccount: showAccount,
        showError: showError
        
    });
});
