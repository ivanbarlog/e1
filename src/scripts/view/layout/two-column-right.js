define([
    'marionette',
    'text!templates/layout/two-column-right.html'
], function(
    Marionette,
    template
){
    'use strict';
    
    return Marionette.Layout.extend({
        
        tagName: 'div',
        
        attributes: {
            'class': 'layout-two-column-right'
        },
        
        template: _.template(template),
        
        regions: {
            main: '.target-area-main',
            side: '.target-area-side'
        }
    });
});
