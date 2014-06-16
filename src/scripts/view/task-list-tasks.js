define([
    'global',
    'marionette',
    'model/task',
    'view/add-task',
    'tpl!templates/task-list-tasks',
    'tpl!templates/task-list-tasks-item',
    'i18n!nls/task'
], function(
    global,
    Marionette,
    TaskModel,
    AddTaskView,
    template_list,
    template_item,
    str
) {
    'use strict';
    
    
    var ItemView;
    
    
    function taskSerializeData ()
    {
        return this.model.toObject();
    }
    
    
    function taskOnDomRefresh ()
    {
        this.ui.tooltip.tooltip();
    }
    
    
    function taskOnClickComplete ()
    {
        this.model.setComplete();
        this.model.save();
    }
    
    
    function taskOnClickIncomplete ()
    {
        this.model.setIncomplete();
        this.model.save();
    }
    
    
    function taskOnClickDelete ()
    {
        var task = this.model,
            View = Marionette.ItemView.extend({
                template:_.template(str.delete_task_body)
            });
        
        global.app.request(
            'gui:modal',
            new View({model:task}),
            str.delete_task_title,
            str.delete_task_ok,
            str.delete_task_cancel
        ).then(function() {
            task.destroy();
        }, function() {
            
        });
    }
    
    
    ItemView = Marionette.ItemView.extend({
        
        tagName: 'li',
        
        attributes: {
            'class': 'task-list-tasks-item list-group-item'
        },
        
        template: template_item,
        
        ui: {
            tooltip: '[title]',
            complete: '.set-complete',
            incomplete: '.set-incomplete',
            'delete': '.delete'
        },
        
        triggers: {
            'click @ui.complete': 'click:complete',
            'click @ui.incomplete': 'click:incomplete',
            'click @ui.delete': 'click:delete'
        },
        
        modelEvents: {
            'change sync': 'render'
        },
        
        serializeData: taskSerializeData,
        
        onDomRefresh: taskOnDomRefresh,
        
        onClickComplete: taskOnClickComplete,
        onClickIncomplete: taskOnClickIncomplete,
        onClickDelete: taskOnClickDelete
        
        
    });
    
    
    function taskListSerializeData ()
    {
        return _.extend(this.model.toObject(), {
            total: this.collection.length,
            completed: this.collection.where({state:1}).length
        });
    }
    
    
    function taskListOnClickAddTask ()
    {
        var tasks = this.collection,
            task = new TaskModel(),
            view = new AddTaskView({model:task});
    
        tasks.add(task);
        
        global.app.request(
            'gui:modal',
            view,
            str.add_task_title,
            str.add_task_ok,
            str.add_task_cancel
        ).then(function() {
            task.save();
            tasks.fetch();
        }, function() {
            task.destroy();
        });
    }
    
    
    return Marionette.CompositeView.extend({
        
        tagName: 'div',
        
        attributes: {
            'class': 'task-list-tasks'
        },
        
        template: template_list,
        
        itemView: ItemView,
        itemViewContainer: 'ul',
        
        triggers: {
            'click .add-task': 'click:addTask'
        },
        
        collectionEvents: {
            'sync remove': 'render'
        },
        
        serializeData: taskListSerializeData,
        onClickAddTask: taskListOnClickAddTask
            
        
    });
});