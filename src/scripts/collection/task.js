define([
    'backbone',
    'model/task'
], function(
    Backbone,
    TaskModel
) {
    'use strict';
    
    
    function taskCollectionUrl ()
    {
        return this.list.id ? 'list/' + this.list.id + '/task' : 'task';
    }
    
    
    function taskCollectionInitialize (items, options)
    {
        this.list = options.list;
    }
    
    
    return Backbone.Collection.extend({
        
        url: taskCollectionUrl,
        model: TaskModel,
        
        initialize: taskCollectionInitialize
        
    });
});