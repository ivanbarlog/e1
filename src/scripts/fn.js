define([
    'backbone',
    'moment'
], function(
    Backbone,
    moment
) {
    'use strict';
    
    
    function normaliseModel (model)
    {
        var obj = model;
        
        if(model instanceof Backbone.Model) {
            obj = 'toObject' in model ? model.toObject() : model.attributes;
        }
        
        if(_.isObject(obj)) {
            return _.clone(obj);
        }
        
        return {id:model};
    }
    
    
    function normaliseDateTime (datetime)
    {
        return moment(datetime);
    }
    
    
    // .toJSON is for persisting to API - use this to extract all models as
    // attributes objects form collections to store in model attributes instead
    // of calling Collection.toJSON.
    function getCollectionObjects (collection)
    {
        return collection.map(function(model) {
            return normaliseModel(model);
        });
    }
    
    
    function modifyCollection (contents, options, getter, setter, action)
    {
        var collection = getter();
        
        if (_.isObject(contents) && _.has(contents, 'models')) {
            contents = contents.models;
        }
        
        contents = _.isArray(contents) ? contents : [contents];
        
        _.each(contents, function (model) {
            collection[action](model instanceof Backbone.Model ? model : {id:model});
        });
        
        return setter(collection, options);
    }
        
        
    function parseQueryString(query)
    {
        var params = {},
            match,
            pl = /\+/g,
            search = /([^&=]+)=?([^&]*)/g;
        
        function decode(s) {
            return decodeURIComponent(s.replace(pl, " "));
        }
        
        while ((match = search.exec(query))) {
            params[decode(match[1])] = decode(match[2]);
        }
        
        return params;
    }
    
    
    return {
        normaliseModel: normaliseModel,
        normaliseDateTime: normaliseDateTime,
        
        getCollectionObjects: getCollectionObjects,
        modifyCollection: modifyCollection,
        parseQueryString: parseQueryString
    };
});