define([
    'backbone',
    'model/task',
    'model/task-list'
], function(
    Backbone,
    TaskModel,
    TaskListModel
) {
    'use strict';
    
    
    function overviewToJSON ()
    {
        return Backbone.Model.prototype.toJSON.call(this);
    }
    
    
    function overviewToObject ()
    {
        return _.extend(Backbone.Model.prototype.toJSON.call(this), {
            next_task: this.getNextTask().toObject(),
            incomplete_list: this.getIncompleteList().toObject()
        });
    }
    
    
    function overviewGetNextTask ()
    {
        return new TaskModel(this.get('next_task'));
    }
    
    
    function overviewGetIncompleteList ()
    {
        return new TaskListModel(this.get('incomplete_list'));
    }
    
    
    return Backbone.Model.extend({
        
        urlRoot: 'overview',
        
        defaults: {
            tasks_total: 0,
            tasks_complete: 0,
            tasks_incomplete: 0,
            tasks_complete_percent: 0,
            next_task: null,
            incomplete_list: null
        },
        
        toJSON: overviewToJSON,
        toObject: overviewToObject,
        getNextTask: overviewGetNextTask,
        getIncompleteList: overviewGetIncompleteList
    });
});