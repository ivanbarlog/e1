define([
    'global',
    'marionette'
], function(
    global,
    Marionette
) {
    'use strict';
    
    
    function passOnClick ()
    {
        if (this.model) {
            global.App.request('index:pass', this.model);
        }
        
        if (this.collection) {
            global.App.request('index:pass', this.collection);
        }
    }
    
    
    return Marionette.Behaviour.extend({
        
        
        events: {
            'click': 'passOnClick'
        },
        
        passOnClick: passOnClick
        
    });
});