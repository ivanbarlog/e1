define([
    'backbone',
    'moment',
    'collection/task'
], function(
    Backbone,
    moment,
    TaskCollection
) {
    'use strict';
    
    
    function taskListInitialize ()
    {
        this.setCreated(undefined, {silent:true});
        this.getTasks = _.memoize(this.getTasks);
    }
    
    
    function taskListValidate (attrs)
    {
        if (!attrs.name.length) {
            return 'The task list needs a name!';
        }
    }
    
    
    function taskListToJSON ()
    {
        return Backbone.Model.prototype.toJSON.call(this);
    }
    
    
    function taskListToObject ()
    {
        return {
            id: this.id,
            name: this.get('name'),
            status: this.get('status'),
            created: this.getCreated()
        };
    }
    
    
    function taskListGetCreated ()
    {
        var iso = this.get('created');
        
        return moment(iso);
    }
    
    
    function taskListSetCreated (time, options)
    {
        this.set({created:moment(time).toISOString()}, options);
    }
    
    
    function taskListGetTasks (sync)
    {
        var collection = new TaskCollection(this.get('tasks') || [], {list:this});
        
        if (sync) {
            collection.listenTo(this, 'sync', function() { collection.fetch(); });
        }
        
        return collection;
    }
    
    
    return Backbone.Model.extend({
        
        INCOMPLETE: 0,
        COMPLETE: 1,
        
        defaults: {
            name: '',
            created: '',
            user: null,
            tasks: []
        },
        
        initialize: taskListInitialize,
        validate: taskListValidate,
        
        toJSON: taskListToJSON,
        toObject: taskListToObject,
        
        getCreated: taskListGetCreated,
        setCreated: taskListSetCreated,
        
        getTasks: taskListGetTasks
    });
});