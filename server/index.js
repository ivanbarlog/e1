module.exports = (function (
    _,
    http,
    express,
    expressCompression,
    expressCookieParser,
    expressBodyParser,
    expressSession,
    passport,
    PassportLocalStrategy,
    moment,
    fixtures
) {
    'use strict';

    var store, handlers;
    

    // Because who needs a database when we have the heap.
    store = fixtures;
    
    
    // Advanced query functions.
    function getListById (id)
    {
        return store.list[id] || false;
    }
    
    
    function getTaskById (id)
    {
        return store.task[id] || false;
    }
    
    
    function getUserById (id)
    {
        return store.user[id] || false;
    }
    
    
    function getOverview (user)
    {
        if (!user) {
            return {};
        }
        
        var tasks = _.where(store.task, {user:user.id}),
            overview = {
                tasks_total: tasks.length,
                tasks_complete: _.where(tasks, {state:1}).length,
                tasks_incomplete: _.where(tasks, {state:0}).length
            };
    
        overview.tasks_complete_percent = Math.round((overview.tasks_complete / overview.tasks_total) * 100);
        
        overview.next_task = _.last(_.sortBy(tasks, function(task) { return moment(task.created).unix(); }));
        
        overview.incomplete_list = store.list[_.max(
            _.map(
                _.countBy(
                    _.where(
                        tasks,
                        {state:0}
                    ),
                    function (task) { return task.list; }
                ),
                function(n, id) { return {id:id, n:n}; }
            ),
            function(x) { return x.n; }
        ).id];
        
        return overview;
    }
    

    // All our request handlers do all the things.
    handlers = {
        '/primer': {
            'get': function (req, res)
            {
                var user_id = req.user ? req.user.id : 0;
                
                res.json(200, {
                    user: req.user || {},
                    overview: getOverview(req.user),
                    options: {pi:(22/7)},
                    taskLists: _.map(_.where(store.list, {user:user_id}), function(list) {
                        return _.extend({}, list, {tasks: _.where(store.task, {list:list.id})});
                    })
                });
            }
        },
        '/overview': {
            get: function (req, res)
            {
                res.json(200, getOverview(req.user));
            }
        },
        '/login': {
            post: function (req, res, next)
            {
                passport.authenticate('local', function(err, user, info) {
                    if (err) { return next(err); }
                    if (!user) { return res.json(401, info); }
                    req.login(user, function(err) {
                        return err ? next(err) : res.json(200, user);
                    });
                })(req, res, next);
            }
        },
        '/logout': {
            post: function (req, res)
            {
                req.logout();
                res.send(200);
            }
        },
        '/list': {
            get: function (req, res)
            {
                var user_id = req.user ? req.user.id : 0;
                
                res.json(200, _.where(store.list, {user:user_id}));
            },
            'post': function (req, res)
            {
                var id =  parseInt(_.max(_.keys(store.list)), 10) + 1,
                    list = _.extend({
                        name: ''
                    }, req.body, {
                        id: id,
                        created: moment().toISOString(),
                        user: req.user.id
                    });
                
                store.list[id] = list;
                
                console.log('Added the list \'' + list.name + '\'.');
                
                res.json(200, list);
            }
        },
        '/list/:id': {
            'get': function (req, res)
            {
                var list = getListById(req.params.id);
                
                return list ?
                    res.json(200, list):
                    res.send(404, 'List not found.');
            },
            'put': function (req, res)
            {
                var list = getListById(req.params.id);
                
                if (!list) {
                    return res.send(404, 'List not found.');
                }
                
                _(['name']).each(function(key) {
                    if (_.has(req.body, key)) {
                        list[key] = req.body[key];
                    }
                });
                
                res.json(200, list);
            },
            'delete': function (req, res)
            {
                var list = getListById(req.params.id);
                
                if (!list) {
                    return res.send(404, 'List not found.');
                }
            
                delete store.list[req.params.id];
                res.json(200, list);
            }
        },
        '/task': {
            get: function (req, res)
            {
                var list_id = _.has(req.params, 'list_id') ? parseInt(req.params.list_id, 10) : false;
                
                res.json(200, list_id ? _.where(store.task, {list:list_id}) : store.task);
            },
            'post': function (req, res)
            {
                var id = parseInt(_.max(_.keys(store.task)), 10) + 1,
                    task = _.extend({
                        body: '',
                        due: '',
                        list: null
                    }, req.body, {
                        id: id,
                        state: 0,
                        created: moment().toISOString()
                    });
                
                store.task[id] = task;
                
                console.log('Added the task \'' + task.body + '\'.');
                
                res.json(200, task);
            }
        },
        '/task/:id': {
            'get': function (req, res)
            {
                var task = getTaskById(req.params.id);
                
                return task ?
                    res.json(200, task):
                    res.send(404, 'Task not found.');
            },
            'put': function (req, res)
            {
                var task = getTaskById(req.params.id);
                
                if (!task) {
                    return res.send(404, 'Task not found.');
                }
                
                _(['body', 'state', 'due', 'list']).each(function(key) {
                    if (_.has(req.body, key)) {
                        task[key] = req.body[key];
                    }
                });
                
                res.json(200, task);
            },
            'delete': function (req, res)
            {
                var task = getTaskById(req.params.id);
                
                if (!task) {
                    return res.send(404, 'Task not found.');
                }
            
                delete store.task[req.params.id];
                res.json(200, task);
            }
        }
    };
    
    
    // Alias task handler functions under lists.
    handlers['/list/:list_id/task'] = _.reduce(handlers['/task'], function(aliases, handler, method) {
        aliases[method] = function(req) {
            req.body.list = parseInt(req.params.list_id, 10);
            return handler.apply(this, arguments);
        };
        
        return aliases;
    }, {});
    
    handlers['/list/:list_id/task/:id'] = _.reduce(handlers['/task/:id'], function(aliases, handler, method) {
        aliases[method] = function(req) {
            req.body.list = parseInt(req.params.list_id, 10);
            return handler.apply(this, arguments);
        };
        
        return aliases;
    }, {});


    // Where the magic happens.
    function main (src, port)
    {
        // Initialise server.
        var app, server;

        app = express();
        server = http.createServer(app);


        // Bind express middleware.
        app.use(expressCompression());
        app.use(expressCookieParser());
        app.use(expressBodyParser());
        app.use(expressSession({secret:'8891'}));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(express['static'](src));
        
        
        // Configure authentication.
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        
        passport.deserializeUser(function(id, done) {
            done(null, getUserById(id));
        });
        
        passport.use(new PassportLocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, function(email, password, done) {
            var users = _.where(store.user, {email:email, password:password});
            return users.length ?
                done(null, users[0]):
                done(null, false, {message:'Invalid credentials'});
        }));
        
        
        // Bind handlers.
        _.each(handlers, function (methods, path) {
            
            var route = app.route(path);
            
            _.each(methods, function(handler, verb) {
                route[verb](handler);
            });
        });
        

        // Start server.
        server.listen(port);
        console.log('Listening on port ' + port + ', serving ' + src);

        return {app:app, server:server};
    }


    // Let's go.
    var port = parseInt(process.env.PORT, 10);
    
    return [
        main(__dirname + '/../src', port),
        main(__dirname + '/../dist', port + 1)
    ];
    
})(
    require('underscore'),
    require('http'),
    require('express'),
    require('compression'),
    require('cookie-parser'),
    require('body-parser'),
    require('express-session'),
    require('passport'),
    require('passport-local').Strategy,
    require('moment'),
    require('./fixtures')
);