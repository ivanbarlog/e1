define([
    'backbone'
], function(
    Backbone
) {
    'use strict';
    
    
    function userGetType ()
    {
        return this.get('type');
    }
    
    
    function userIs (type)
    {
        return (this.getType() === type);
    }
    
    
    return Backbone.Model.extend({
        
        urlRoot: 'user',
        
        ANONYMOUS: 0,
        CLIENT: 1,
        ADMIN: 2,
        
        defaults: {
            name: '',
            email: '',
            type: 0
        },
        
        getType: userGetType,
        isType: userIs,
        isAnonymous: _.partial(userIs, 0),
        isClient: _.partial(userIs, 1),
        isAdmin: _.partial(userIs, 2)
        
    });
});