module.exports = (function(
    moment
) {
    'use strict';
    
    return {
        list: {
            1: {
                id: 1,
                name: 'Urgent',
                created: moment().subtract('days', 1).toISOString(),
                user: 1
            },
            2: {
                id: 2,
                name: 'Irrelevant',
                created: moment().subtract('days', 10).toISOString(),
                user: 1
            }
        },
        task: {
            1: {
                id: 1,
                body: 'This can probably wait till later...',
                state: 0,
                created: moment().toISOString(),
                due: moment().add('days', 7).toISOString(),
                list: 1,
                user: 1
            },
            2: {
                id: 2,
                body: 'Have a shower',
                state: 0,
                created: moment().subtract('days', 3).toISOString(),
                due: moment().add('days', 30).toISOString(),
                list: 2,
                user: 1
            },
            3: {
                id: 3,
                body: 'Buy toilet paper',
                state: 0,
                created: moment().subtract('days', 7).toISOString(),
                due: moment().add('days', 5).toISOString(),
                list: 2,
                user: 1
            },
            4: {
                id: 4,
                body: 'Eat lunch',
                state: 1,
                created: moment().subtract('days', 9).toISOString(),
                due: moment().add('days', 5).toISOString(),
                list: 2,
                user: 1
            }
        },
        user: {
            1: {
                id: 1,
                name: 'Alex',
                email: 'admin@example.com',
                password: 'house123',
                type: 2
            },
            2: {
                id: 2,
                name: 'Client',
                email: 'client@example.com',
                password: 'house123',
                type: 1
            }
        }
    };
    
})(
    require('moment')
);