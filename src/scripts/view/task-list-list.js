define([
    'global',
    'marionette',
    'model/task-list',
    'view/add-list',
    'tpl!templates/task-list-list',
    'tpl!templates/task-list-list-item',
    'i18n!nls/task'
], function(
    global,
    Marionette,
    ListModel,
    AddListView,
    template_list,
    template_item,
    str
) {
    'use strict';
    
    
    var TaskListItemView;
    
    
    function taskListAttributes ()
    {
        var classes = ['task-list-list-item'];
        
        if (global.app.request('index:showing', this.model)) {
            classes.push('active');
        }
        
        return {
            'class': classes.join(' ')
        };
    }
    
    
    function taskListItemSerializeData ()
    {
        return _.extend(this.model.toObject(), {
            
        });
    }
    
    
    function taskListItemOnClick ()
    {
        global.app.request('index:show', this.model);
    }
    
    
    function taskListItemOnClickDelete ()
    {
        var list = this.model,
            View = Marionette.ItemView.extend({
                template:_.template(str.delete_list_body)
            });
        
        global.app.request(
            'gui:modal',
            new View({model:list}),
            str.delete_list_title,
            str.delete_list_ok,
            str.delete_list_cancel
        ).then(function() {
            list.destroy();
        }, function() {
            
        });
    }
    
    
    TaskListItemView = Marionette.ItemView.extend({
        
        tagName: 'li',
        
        attributes: taskListAttributes,
        
        template: template_item,
        
        triggers: {
            'click a,span': 'click',
            'click .delete': 'click:delete'
        },
        
        modelEvents: {
            'change': 'render'
        },
        
        serializeData: taskListItemSerializeData,
        onClick: taskListItemOnClick,
        onClickDelete: taskListItemOnClickDelete
        
    });
    
    
    function taskListSerializeData ()
    {
        return {
            count: this.collection.length
        };
    }
    
    
    function taskListTasksViewOnClickAddList ()
    {
        var lists = this.collection,
            list = new ListModel(),
            view = new AddListView({model:list});
    
        lists.add(list);
        
        global.app.request(
            'gui:modal',
            view,
            str.add_list_title,
            str.add_list_ok,
            str.add_list_cancel,
            'sm'
        ).then(function() {
            list.save();
            lists.fetch();
        }, function() {
            list.destroy();
        });
    }
    
    
    return Marionette.CompositeView.extend({
        
        tagName: 'div',
        
        attributes: {
            'class': 'task-list-list'
        },
        
        template: template_list,
        
        itemView: TaskListItemView,
        itemViewContainer: 'ul',
        
        triggers: {
            'click .add-list': 'click:addList'
        },
        
        collectionEvents: {
            'sync remove': 'render'
        },
        
        serializeData: taskListSerializeData,
        onClickAddList: taskListTasksViewOnClickAddList
        
    });
});