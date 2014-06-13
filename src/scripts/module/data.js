define([
    'module/factory',
    'json!primer',
    'model/user',
    'model/overview',
    'collection/task-list'
], function(
    moduleFactory,
    primer,
    UserModel,
    OverviewModel,
    TaskListCollection
) {
    'use strict';
    
    var primer_map = {
            taskLists: TaskListCollection,
            user: UserModel,
            overview: OverviewModel
        };
    
    
    function onDataModuleStart ()
    {
        // Load application options.
        if (_.has(primer, 'options')) {
            this.app.options = _.extend(this.app.options, primer.options);
        }
        
        // Define common model store.
        this.common = {};
        
        // Load data into common store.
        _.each(primer, function(models, key) {
            var Structure = primer_map[key];
            
            this.common[key] = Structure ? new Structure(models) : undefined;
        }, this);
    }
    
    
    function onDataModuleStop ()
    {
        delete this.common;
    }
    
    
    function doDataGet (key, sub_key)
    {
        var set = this.common[key];
        
        if (sub_key !== undefined) {
            if ('get' in set) {
                return set.get(sub_key);
            }
            
            if (sub_key in set) {
                return _.result(set, sub_key);
            }
        }
        
        return this.common[key];
    }
    
    
    return moduleFactory(
        'data',
        onDataModuleStart,
        onDataModuleStop,
        // Event listeners.
        {},
        // Request handlers.
        {
            get: doDataGet
        }
    );
});
