define([
    'model/user',
    'module/index/router/login',
    'module/index/router/user',
    'module/index/router/task',
    'module/index/router/admin'
], function(
    UserModel,
    LoginRouter,
    UserRouter,
    TaskRouter,
    AdminRouter
) {
    'use strict';
    
    var routers = {};
    
    routers[UserModel.prototype.ANONYMOUS] = {
        login: LoginRouter
    };
    
    routers[UserModel.prototype.CLIENT] = {
        user: UserRouter,
        task: TaskRouter
    };
    
    routers[UserModel.prototype.ADMIN] = _.extend(routers[UserModel.prototype.CLIENT], {
        admin: AdminRouter
    });
    
    return routers;
});