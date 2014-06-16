define([
    'marionette',
    'tpl!templates/layout/two-column-right'
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
        
        template: template,
        
        regions: {
            main: '.target-area-main',
            side: '.target-area-side'
        }
    });
});
