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
    
    
    return Marionette.Controller.extend({
        
        showLogin: showLogin
        
    });
});
