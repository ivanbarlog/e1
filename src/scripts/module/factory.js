define([
    
], function(
    
) {
    'use strict';
    
    function moduleBuilder(namespace, start, stop, listeners, handlers)
    {
        
        function Module (ModuleInstance, App)
        {
            var event, request;
            
            ModuleInstance.on('start', start);
            ModuleInstance.on('stop', stop);
            
            // Listen to application events.
            for (event in listeners) {
                ModuleInstance.listenTo(App, event, listeners[event]);
            }
            
            // Handle application requests.
            for (request in handlers) {
                App.reqres.setHandler(namespace + ':' + request, handlers[request], ModuleInstance);
            }
        }
        
        return Module;
    }
    
    return moduleBuilder;
});