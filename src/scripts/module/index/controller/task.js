define([
    'global',
    'marionette',
    'view/layout/two-column-right',
    'view/overview',
    'view/task-list-list',
    'view/task-list-tasks',
    'i18n!nls/task'
], function(
    global,
    Marionette,
    TwoColumnRightLayout,
    OverviewView,
    TaskListListView,
    TaskListTasksView,
    str
) {
    'use strict';
    
    
    function showOverview ()
    {
        var lists = global.app.request('data:get', 'taskLists'),
            overview = global.app.request('data:get', 'overview'),
            layout;
        
        // Construct the interface with nested views.
        layout = new TwoColumnRightLayout();
        
        global.app.main.show(layout);
        
        layout.side.show(new TaskListListView({
            collection: lists
        }));
        
        layout.main.show(new OverviewView({
            model: overview
        }));
        
        overview.fetch();
    }
    
    
    function showTask (list_id, task_id)
    {
        var lists = global.app.request('data:get', 'taskLists'),
            list = list_id ? lists.get(list_id) : lists.at(0),
            task, tasks, layout;
        
        if (!list) {
            return global.app.request('gui:error', str.list_not_found);
        }
        
        tasks = list.getTasks();
        
        if (task_id) {
            task = tasks.get(task_id);
            if (!task) {
                return global.app.request('gui:error', str.task_not_found);
            }
        }
        
        // Construct the interface with nested views.
        layout = new TwoColumnRightLayout();
        
        global.app.main.show(layout);
        
        layout.side.show(new TaskListListView({
            collection: lists
        }));
        
        layout.main.show(new TaskListTasksView({
            collection: tasks,
            model: list
        }));
        
        // We're rendering the interface with the data we have, so the user can
        // already be interacting with it, but make requests to update data. The
        // interface will then redraw on synchronisation if required.
        list.fetch();
        tasks.fetch();
    }
    
    
    return Marionette.Controller.extend({
        showOverview: showOverview,
        showTask: showTask
    });
});
