define([
    'global',
    'marionette',
    'tpl!templates/toolbar'
], function(
    global,
    Marionette,
    template
) {
    'use strict';
    
    
    function toolbarOnClickLogout ()
    {
        global.app.request('session:logout');
    }
    
    
    return Marionette.ItemView.extend({
        
        tagName: 'nav',
        
        attributes: {
            'class': 'navbar navbar-default',
            'role': 'navigation'
        },
        
        template: template,
        
        ui: {
            logout: '[href="#logout"]'
        },
        
        triggers: {
            'click @ui.logout': 'click:logout'
        },
        
        onClickLogout: toolbarOnClickLogout
        
    });
});