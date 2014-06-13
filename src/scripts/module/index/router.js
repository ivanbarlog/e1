define([
    'marionette'
], function(
    Marionette
) {
    'use strict';
    
    
    function routerGenerateUrl ()
    {
        return false;
    }
    
    return Marionette.AppRouter.extend({
        
        generateUrl: routerGenerateUrl
        
    });
});