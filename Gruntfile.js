/*global module,require */

module.exports = function(grunt) {
    
    'use strict';
    
    var jshintStylish = require('jshint-stylish'),
        target = grunt.option('target') || 'production',
        timestamp = Math.round(new Date().getTime() / 1000);
    
    // Load all grunt tasks.
    require('load-grunt-tasks')(grunt);
    
    // Configure grunt tasks.
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            options: {
                
                reporter: jshintStylish,
                
                // If you must define or depend on extra globals, they have to
                // be added here to pass linting. Dependencies should be included
                // as AMD modules where possible instead.
                globals: {
                    // Client side.
                    'window': false,
                    'console': false,
                    'setInterval': false,
                    'clearInterval': false,
                    'setTimeout': false,
                    'clearTimeout': false,
                    'parseInt': false,
                    '$': false,
                    '_': false,
                    'require': false,
                    'define': false,
                    
                    // Server side.
                    'module': false,
                    'process': false,
                    '__dirname': false
                },
                
                // Militant.
                curly: true,
                es3: true,
                freeze: true,
                latedef: true,
                noarg: true,
                strict: true,
                trailing: true,
                undef: true,
                unused: true,
                maxlen: 130,
                indent: 4,
                
                // Casual.
                validthis: true,
                '-W086': true,
                '-W018': true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: 'src/scripts/**/*.js'
            },
            server: {
                src: 'server/**/*.js'
            }
        },
        
        clean: {
            dist: ['dist/'],
            temp: ['tmp/']
        },
        
        modernizr: {
            src: {
                devFile: 'src/vendor/bower/modernizr/modernizr.js',
                outputFile: 'src/vendor/libs/modernizr/modernizr-custom.js',
                
                extra: {
                    load: false
                },
                
                uglify: false,
                
                files: {
                    src: [
                        'src/scripts/**/*.js',
                        'src/less/**/*.less'
                    ]
                }
            }
        },
        
        copy: {
            tmp: { files: [
                { cwd: 'src', expand: true, src: '**/*', dest: 'tmp/' }
            ]},
            dist: { files: [
                { src: 'tmp/favicon.ico', dest: 'dist/favicon.ico' },
                { cwd: 'tmp/fonts/', expand: true, src: '*.{eot,svg,ttf,woff}', dest: 'dist/fonts/' },
                { cwd: 'tmp/images/', expand: true, src: '**/*', dest: 'dist/images/' }
            ]}
        },
        
        preprocess: {
            options: {
                context: {
                    TARGET: target,
                    TIMESTAMP: timestamp,
                    ENDPOINT: '<%= pkg.env.' + target + '.endpoint %>',
                    GOOG_API_KEY: '<%= pkg.env.' + target + '.goog_api_key %>'
                }
            },
            dist: {
                options: {
                    inline: true
                },
                src: [
                    'tmp/scripts/**/*.js',
                    'tmp/templates/**/*.html',
                    'tmp/styles/**/*.less',
                    'tmp/*.html'
                ]
            }
        },
        
        requirejs: {
            dist: {
                options: {
                    name: 'main',
                    mainConfigFile: 'tmp/scripts/main.js',
                    out: 'tmp/scripts/main.full.js',
                    preserveLicenseComments: false,
                    almond: true,
                    optimize: 'none'
                }
            }
        },
        
        closureCompiler: {
            options: {
                compilerFile: 'build/closure/compiler.jar',
                checkModified: true,
                compilerOpts: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    define: ["'goog.DEBUG=false'"],
                    jscomp_off: [
                        'checkTypes',
                        'fileoverviewTags',
                        'nonStandardJsDocs',
                        'internetExplorerChecks',
                        'checkVars',
                        'suspiciousCode'
                    ],
                    summary_detail_level: 3,
                    output_wrapper: '"%output%"'
                }
            },
            dist: {
                src: [
                    'tmp/vendor/bower/requirejs/require.js',
                    'tmp/scripts/main.full.js'
                ],
                dest: 'dist/scripts/main.js'
            }
        },
        
        less: {
            dist: {
                options: {
                    compress: true
                },
                files: {
                    'tmp/styles/main.css': 'tmp/styles/main.less'
                }
            }
        },
        
        cssmin: {
            dist: {
                files: {
                    'dist/styles/main.css': ['tmp/styles/main.css']
                }
            }
        },
        
        nodemon: {
            server: {
                script: 'index.js',
                options: {
                    cwd: 'server',
                    env: {
                        PORT: 8891
                    },
                    nodeArgs: ['--debug'],
                    ext: 'js'
                }
            }
        }
    });
    
    // Define task runners.
    
    // grunt
    // grunt --target=staging
    // 
    // Build the application for distribution. Use the target parameter to choose a dist target.
    grunt.registerTask('default', [
        'jshint',               // Lint all the JS.
        'clean',                // Clear the directories we're building to.
        'modernizr:src',        // Generate a custom modernizr script.
        'copy:tmp',             // Copy all src to tmp directory for building.
        'preprocess:dist',      // Preprocess all JS & HTML for target env.
        'requirejs:dist',       // Inline all JS modules and dependencies.
        'closureCompiler:dist', // Concat any remaining JS and compress.
        'less:dist',            // Compile the less styles.
        'cssmin:dist',          // Inline any remaining CSS imports and compress.
        'copy:dist',            // Import other resources to build directory.
        'clean:tmp'             // Clean up temporary build step files.
    ]);
    
    // grunt verify
    // 
    // Lint and check dependency resolution.
    grunt.registerTask('verify', [
        'jshint',
        'requirejs:dist',
        'clean:temp'
    ]);
    
    // grunt server
    //
    // Run the server side script which provides the API.
    grunt.registerTask('server', [
        'jshint:server',
        'nodemon:server'
    ]);
};