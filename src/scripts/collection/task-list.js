define([
    'backbone',
    'model/task-list'
], function(
    Backbone,
    TaskListModel
) {
    'use strict';
    
    
    return Backbone.Collection.extend({
        
        url: 'list',
        model: TaskListModel
        
    });
});