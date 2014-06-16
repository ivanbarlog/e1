define([
    'marionette',
    'tpl!templates/user/account'
], function(
    Marionette,
    template
) {
    'use strict';
    
    
    function accountFormOnSubmit ()
    {
        
    }
    
    
    return Marionette.ItemView.extend({
        
        tagName: 'form',
        
        attributes: {
            'class': 'form account-form'
        },
        
        template: template,
        
        triggers: {
            'submit': 'submit'
        },
        
        onSubmit: accountFormOnSubmit
        
    });
});