define([
    'global',
    'backbone',
    'marionette',
    'tpl!templates/user/login-form',
    'backbone.syphon'
], function(
    global,
    Backbone,
    Marionette,
    template
) {
    'use strict';
    
    
    function loginFormOnSubmit ()
    {
        var data = Backbone.Syphon.serialize(this),
            btn = this.ui.submit;
        
        btn.button('loading');
        
        global.app.request('session:login', data).then(function() {
            
        }, function(message) {
            global.app.request('gui:notify', message, 'error');
            btn.button('reset');
        });
    }
    
    
    return Marionette.ItemView.extend({
        
        tagName: 'form',
        
        attributes: {
            'class': 'form login-form',
            'role': 'form'
        },
        
        template: template,
        
        ui: {
            submit: '[type="submit"]'
        },
        
        triggers: {
            'submit': 'submit'
        },
        
        onSubmit: loginFormOnSubmit
        
    });
});