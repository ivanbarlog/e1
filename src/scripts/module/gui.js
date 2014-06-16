define([
    'module/factory',
    'view/toolbar',
    'view/modal',
    'view/error',
    'alertify',
    'nprogress',
    'fastclick',
    'bootstrap.button',
    'bootstrap.modal',
    'bootstrap.tooltip',
    'bootstrap.transition'
], function(
    moduleFactory,
    ToolbarView,
    ModalView,
    ErrorView,
    Alertify,
    Nprogress,
    FastClick
) {
    'use strict';
    
    
    function onFrameModuleStart ()
    {
        // Make feel native-y.
        FastClick.attach(window.document.body);
        
        // Initialise regions.
        this.app.addRegions({
            toolbar: '#toolbar',
            main: '#main',
            footer: '#footer',
            overlay: '#overlay'
        });
        
        // Prepare frame for user.
        if (this.app.request('session:authenticated')) {
            
            var user = this.app.request('session:user');
            
            this.app.toolbar.show(new ToolbarView({model:user}));
        }
    }
    
    
    function onFrameModuleStop ()
    {
        
    }
    
    
    function onNavigate ()
    {
        doTop();
    }
    
    
    function onAjaxStart ()
    {
        Nprogress.start();
    }
    
    
    function onAjaxStop ()
    {
        Nprogress.done();
    }
    
    
    function doNotify (message, type, display_for_ms)
    {
        display_for_ms = display_for_ms || (4 * 1000);
        
        Alertify.log(message, type, display_for_ms);
    }
    
    
    function doConfirm (message, callback)
    {
        Alertify.confirm(message, callback);
    }
    
    
    function doPrompt (message)
    {
        var dfr = new $.Deferred();
        
        Alertify.prompt(message, function(e, str) {
            if (e) {
                dfr.resolve(str);
            } else {
                dfr.reject(str);
            }
        });
        
        return dfr.promise();
    }
    
    
    function doTop ()
    {
        window.document.body.scrollTop = window.document.documentElement.scrollTop = 0;
    }
    
    
    function doModal (view, title, text_ok, text_cancel, size)
    {
        var dfr = new $.Deferred(),
            modal = new ModalView({
                title: title,
                text_ok: text_ok,
                text_cancel: text_cancel,
                size: size
            });
        
        modal.onOk = function() { dfr.resolve(modal); };
        modal.onCancel = function() { dfr.reject(modal); };
        
        this.app.overlay.show(modal);
        modal.body.show(view);
        
        return dfr;
    }
    
    
    function doError (message)
    {
        var view = new ErrorView({message:message});
        
        this.app.main.show(view);
        
        return view;
    }
    
    
    return moduleFactory(
        'gui',
        onFrameModuleStart,
        onFrameModuleStop,
        // Event listeners.
        {
            navigate: onNavigate,
            ajaxStart: onAjaxStart,
            ajaxStop: onAjaxStop
        },
        // Request handlers.
        {
            notify: doNotify,
            confirm: doConfirm,
            prompt: doPrompt,
            top: doTop,
            modal: doModal,
            error: doError
        }
    );
});
