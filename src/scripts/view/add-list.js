define([
    'backbone',
    'marionette',
    'text!templates/add-list.html'
], function(
    Backbone,
    Marionette,
    template
) {
    'use strict';
    
    
    function addListOnChangeInput ()
    {
        var data = Backbone.Syphon.serialize(this);
        
        this.model.set({name:data.name});
    }
    
    
    function addListOnSubmit ()
    {
        if (this.modal) {
            this.modal.ok();
        }
    }
    
    
    return Marionette.ItemView.extend({
        
        tagName: 'form',
        
        attributes: {
            'class': 'form add-list-form'
        },
        
        template: _.template(template),
        
        triggers: {
            'submit': 'submit',
            'change input': 'change:input'
        },
        
        onChangeInput: addListOnChangeInput,
        onSubmit: addListOnSubmit
        
    });
});