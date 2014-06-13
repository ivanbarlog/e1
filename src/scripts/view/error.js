define([
    'marionette',
    'text!templates/error.html'
], function(
    Marionette,
    template
) {
    'use strict';
    
    
    return Marionette.ItemView.extend({
        
        tagName: 'div',
        
        attributes: {
            'class': 'error'
        },
        
        template: _.template(template)
        
    });
});