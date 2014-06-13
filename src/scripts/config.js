define(function () {
    
    'use strict';
    
    var config = {
            endpoint: '/* @echo ENDPOINT */',
            goog_api_key: '/* @echo GOOG_API_KEY */'
        };
    
    // @ifndef ENDPOINT
    config.endpoint = 'http:\/\/127.0.0.1:8891/';
    // @endif
    // @ifndef GOOG_API_KEY
    config.goog_api_key = 'AIzaSyBV4xY7983bl9gyls22qTOub3LeKjKXva0';
    // @endif
    
    return config;
});