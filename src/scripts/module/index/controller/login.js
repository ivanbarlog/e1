define([
    'global',
    'marionette',
    'view/user/login-form'
], function(
    global,
    Marionette,
    LoginFormView
) {
    'use strict';
    
    
    function showLogin ()
    {
        var user = global.app.request('session:user');
        
        global.app.main.show(new LoginFormView({model:user}));
    }
    
   
    function showError (route)
    {
        global.app.request('gui:error', "Route not found: '"+ route + "'");
    }
    
    
    return Marionette.Controller.extend({
        
        showLogin: showLogin,
        showError: showError
        
    });
});
