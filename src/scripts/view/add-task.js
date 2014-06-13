define([
    'backbone',
    'marionette',
    'pikaday',
    'text!templates/add-task.html'
], function(
    Backbone,
    Marionette,
    Pikaday,
    template
) {
    'use strict';
    
    
    function addTaskOnDomRefresh ()
    {
        if (this.options.due instanceof Pikaday) {
            this.options.due.destroy();
        }
        
        this.options.due = new Pikaday({
            field: this.ui.due[0]
        });
    }
    
    
    function addTaskOnChangeInput ()
    {
        var data = Backbone.Syphon.serialize(this);
        
        this.model.set({body:data.body});
        this.model.setDue(data.due);
    }
    
    
    function addTaskOnSubmit ()
    {
        if (this.modal) {
            this.modal.ok();
        }
    }
    
    
    function addTaskOnBeforeClose ()
    {
        if (this.options.due instanceof Pikaday) {
            this.options.due.destroy();
        }
    }
    
    
    return Marionette.ItemView.extend({
        
        tagName: 'form',
        
        attributes: {
            'class': 'form add-task-form'
        },
        
        template: _.template(template),
        
        ui: {
            due: '[name="due"]'
        },
        
        triggers: {
            'submit': 'submit',
            'change input': 'change:input'
        },
        
        onDomRefresh: addTaskOnDomRefresh,
        onBeforeClose: addTaskOnBeforeClose,
        onSubmit: addTaskOnSubmit,
        onChangeInput: addTaskOnChangeInput
        
    });
});