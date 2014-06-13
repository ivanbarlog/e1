define([
    'marionette',
    'text!templates/overview.html'
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
        
        template: _.template(template),
        
        serializeData: overviewSerializeData,
        
        modelEvents: {
            'sync': 'render'
        }
        
    });
});