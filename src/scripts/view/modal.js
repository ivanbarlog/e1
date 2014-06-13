define([
    'global',
    'marionette',
    'text!templates/modal.html'
], function(
    global,
    Marionette,
    template
) {
    'use strict';
    
    
    function modalViewInitialize ()
    {
        this.body.on('show', function(view) {
            view.modal = this;
        }, this);
    }
    
    
    function modalViewOnShow ()
    {
        this.$el.modal('show');
    }
    
    
    function modalViewOnClickOk ()
    {
        this.__outcome = true;
        this.hide();
    }
    
    
    function modalViewOnClickCancel ()
    {
        this.__outcome = false;
        this.hide();
    }
    
    
    function modalViewHide ()
    {
        this.$el.modal('hide');
    }
    
    
    function modalViewOnHide ()
    {
        var event = this.__outcome ? 'ok' : 'cancel';
        
        if (this.body.currentView instanceof Marionette.View) {
            this.body.currentView.triggerMethod('modal:' + event);
        }
        
        this.triggerMethod(event);
        
        this.$el.one('hidden.bs.modal', function() {
            global.app.overlay.close();
        });
    }
    
    
    return Marionette.Layout.extend({
        
        __outcome: false,
        
        tagName: 'div',
        
        attributes: {
            'class': 'modal fade',
            id: 'overlayModal',
            tabindex: '-1',
            role: 'dialog'
        },
        
        template: _.template(template),
        
        regions: {
            header: '.modal-header',
            body: '.modal-body',
            footer: '.modal-footer'
        },
        
        
        events: {
            'hide.bs.modal': 'onHide'
        },
        
        triggers: {
            'click .modal-ok': 'click:ok',
            'click .modal-cancel': 'click:cancel'
        },
        
        initialize: modalViewInitialize,
        
        serializeData: function() {
            return {
                title: this.options.title,
                text_ok: this.options.text_ok,
                text_cancel: this.options.text_cancel,
                size: this.options.size
            };
        },
        
        onShow: modalViewOnShow,
        onHide: modalViewOnHide,
        onClickOk: modalViewOnClickOk,
        onClickCancel: modalViewOnClickCancel,
        
        ok: modalViewOnClickOk,
        cancel: modalViewOnClickCancel,
        hide: modalViewHide
        
    });
});