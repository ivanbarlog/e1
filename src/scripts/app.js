define([
    'backbone',
    'marionette'
], function(
    Backbone,
    Marionette
) {
    'use strict';
    
    var window_events = ['touchstart', 'touchmove', 'touchend', 'resize'],
        document_events = [],
        document_handlers = ['ajaxStart', 'ajaxStop', 'ajaxSend', 'ajaxComplete', 'ajaxError', 'scroll'];
    
    
    function appOnInitializeBefore(options)
    {
        var self = this,
            $window = $(window),
            $document = $(window.document);
        
        this.options = options ? options : this.options;
        
        
        // Pass through window events. 
        _.each(window_events, function(event) {
            $window.on(event, function(e) { self.trigger(event, e); });
        });
        
        
        // Pass through document events.
        _.each(document_events, function(event) {
            window.document.addEventListener(event, function(e) { self.trigger(event, e); }, false);
        });
        
        
        // Bind document handlers.
        _.each(document_handlers, function(name) {
            
            $document[name](function(e, jqXHR, settings) {
                
                var response = jqXHR ? {
                    event:e,
                    jqXHR:jqXHR,
                    settings:settings
                } : undefined;
                
                self.trigger(name, response);
            });
        });
    }
    
    
    function appOnStart()
    {
        return (Backbone.History.started || Backbone.history.start());
    }
    
    
    return Marionette.Application.extend({
        
        options: null,
        
        onInitializeBefore: appOnInitializeBefore,
        onStart: appOnStart
        
    });
});
