define([
    'marionette',
    'tpl!templates/error'
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
        
        template: template,
        
        serializeData: function() {
            return {message: this.options.message || ''};
        }
        
    });
});