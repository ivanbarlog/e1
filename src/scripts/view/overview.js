define([
    'marionette',
    'tpl!templates/overview'
], function(
    Marionette,
    template
) {
    'use strict';
    
    
    function overviewSerializeData ()
    {
        return this.model.toObject();
    }
    
    
    return Marionette.ItemView.extend({
        
        tagName: 'div',
        
        attributes: {
            'class': 'error'
        },
        
        template: template,
        
        serializeData: overviewSerializeData,
        
        modelEvents: {
            'sync': 'render'
        }
        
    });
});