define([
    'module/index/router',
    'module/index/controller/user',
    'model/user'
], function(
    Router,
    Controller,
    UserModel
) {
    'use strict';
    
    var routes = {
        'account(/)': 'showAccount',
        '*default': 'showError'
    };
    
    
    function userGenerateURL (content)
    {
        if (
            (content instanceof UserModel) &&
            content.isClient()
        ) {
            return '/account';
        }
        
        return false;
    }
    
    
    return Router.extend({
        controller: new Controller(),
        appRoutes: routes,
        
        generateURL: userGenerateURL
    });
});
