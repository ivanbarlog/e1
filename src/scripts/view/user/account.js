define([
    'marionette',
    'text!templates/user/account.html'
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
        
        template: _.template(template),
        
        triggers: {
            'submit': 'submit'
        },
        
        onSubmit: accountFormOnSubmit
        
    });
});