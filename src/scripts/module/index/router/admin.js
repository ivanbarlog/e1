define([
    'module/index/router',
    'module/index/controller/admin',
    'model/user'
], function(
    Router,
    Controller,
    UserModel
) {
    'use strict';
    
    var routes = {
        'admin(/)': 'showAdmin'
    };
    
    
    function adminGenerateUrl (content)
    {
        if (
            (content instanceof UserModel) &&
            content.isAdmin()
        ) {
            return '/admin';
        }
        
        return false;
    }
    
    
    return Router.extend({
        controller: new Controller(),
        appRoutes: routes,
        
        generateUrl: adminGenerateUrl
    });
});
