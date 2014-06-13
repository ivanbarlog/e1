define([
    'global',
    'backbone',
    'moment'
], function(
    global,
    Backbone,
    moment
) {
    'use strict';
    
    
    function taskInitialize ()
    {
        this.setCreated(undefined, {silent:true});
        
        if(this.collection && this.collection.model) {
            this.setList(this.collection.model, {silent:true});
        }
    }
    
    
    function taskValidate (attrs)
    {
        if (!attrs.body.length) {
            return 'The task cannot be empty!';
        }
    }
    
    
    function taskToJSON ()
    {
        return Backbone.Model.prototype.toJSON.call(this);
    }
    
    
    function taskToObject ()
    {
        return _.extend(Backbone.Model.prototype.toJSON.call(this), {
            created: this.getCreated(),
            due: this.getDue()
        });
    }
    
    
    function taskSetComplete (options)
    {
        this.set({state:this.COMPLETE}, options);
    }
    
    
    function taskSetIncomplete (options)
    {
        this.set({state:this.INCOMPLETE}, options);
    }
    
    
    function taskSetCreated (time, options)
    {
        this.set({created:moment(time).toISOString()}, options);
    }
    
    
    function taskGetCreated ()
    {
        var iso = this.get('created');
        
        return moment(iso);
    }
    
    
    function taskSetDue (time, options)
    {
        this.set({due:moment(time).toISOString()}, options);
    }
    
    
    function taskGetDue ()
    {
        var iso = this.get('due');
        
        return moment(iso);
    }
    
    
    function taskSetList (list, options)
    {
        var id = parseInt(list instanceof Backbone.Model ? list.id : list, 10);
        
        if (!_.isNaN(id)) {
            this.set({list:id}, options);
        }
    }
    
    
    function taskGetList ()
    {
        return global.app.request('data:get', 'taskLists', this.get('list'));
    }
    
    
    return Backbone.Model.extend({
        
        INCOMPLETE: 0,
        COMPLETE: 1,
        
        defaults: {
            body: '',
            state: 0,
            created: '',
            due: '',
            list: null,
            user: null
        },
        
        initialize: taskInitialize,
        validate: taskValidate,
        
        toJSON: taskToJSON,
        toObject: taskToObject,
        
        setComplete: taskSetComplete,
        setIncomplete: taskSetIncomplete,
        
        setCreated: taskSetCreated,
        getCreated: taskGetCreated,
        
        setDue: taskSetDue,
        getDue: taskGetDue,
        
        setList: taskSetList,
        getList: taskGetList
    });
});