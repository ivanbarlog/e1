define([
    'module/index/router',
    'module/index/controller/task',
    'model/overview',
    'model/task-list',
    'model/task'
], function(
    Router,
    Controller,
    OverviewModel,
    TaskListModel,
    TaskModel
) {
    'use strict';
    
    var routes = {
        '(/)': 'showOverview',
        'list/:id': 'showTask',
        'list/:id/task/:id': 'showTask'
    };
    
    
    function taskGenerateUrl (content)
    {
        if (content instanceof OverviewModel) {
            return '/';
        }
        
        if (content instanceof TaskListModel) {
            return 'list/' + content.get('id');
        }
        
        if (content instanceof TaskModel) {
            return 'list/' + content.getList().id + '/task/' + content.get('id');
        }
        
        return false;
    }
    
    
    return Router.extend({
        controller: new Controller(),
        appRoutes: routes,
        
        generateUrl: taskGenerateUrl
    });
});
