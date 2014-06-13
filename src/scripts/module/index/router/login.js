define([
    'module/index/router',
    'module/index/controller/login',
    'model/user'
], function(
    Router,
    Controller,
    UserModel
) {
    'use strict';
    
    var routes = {
        '(/)': 'showLogin',
        '*default': 'showLogin'
    };
    
    
    function loginGenerateUrl (content)
    {
        if (
            (content instanceof UserModel) &&
            content.isAnonymous()
        ) {
            return '/';
        }
        
        return false;
    }
    
    
    return Router.extend({
        controller: new Controller(),
        appRoutes: routes,
        
        generateUrl: loginGenerateUrl
    });
});
