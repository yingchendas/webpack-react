/**
 * Created by Lein on 16/3/30.
 */
"use strict";
var pug = require('pug');
var fs = require('fs');
var chalk = require('chalk');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('./utilities/StringUtils');
    grunt.loadNpmTasks("grunt-webpack");
    grunt.initConfig({
        uglify: {
            options: {
                beautify: true
            }
            
        },
        concurrent: {
            tasks: ['watch', 'nodemon'],
            options: {
                logConcurrentOutput: true,
                reload: true
            }
        },
        webpack: {
            options: {
                // configuration for all builds
            },
            build: {
                // configuration for this build
            }
        },
        watch: {
            scripts: {
                //files: ['src/*.js', 'bin/www', '**/*.jade'],
                files: ['router/**/*.js', 'bin/www'],
                options: {
                    reload: true
                },
                tasks: ['clean','uglify']
            }
        },
        nodemon: {
            server: {
                script: 'bin/www',
                options: {
                    nodeArgs: ['--use_strict'],
                    //nodeArgs: ['--use_strict', '--trace_gc'],
                    env: {
                        PORT: '3000',
                        NODE_ENV: 'dev'
                    },
                    ignore: ['node_modules/**', 'Gruntfle.js', 'views/**']
                }
            }
        },
        clean: {
            clean: ['views', 'dist', 'web.zip']
        },
        copy: {
            src: {
                files: [
                    {
                        expand: true,
                        src: ['bin/**', 'public/**','build/**','routes/**', 'utilities/**', 'views/**', '*.js','*.html','*.babelrc', '*.json', '.bowerrc'],
                        dest: 'dist'
                    }
                ]
            }
        },
        zip: {
            'web.zip': ['./dist/**']
        }
    });

    grunt.option('force', true);
    grunt.registerTask('default', ['concurrent']);
    grunt.registerTask('build', ['clean', 'uglify', 'copy', 'zip']);
    // grunt.registerTask('build', ['clean', 'buildJade', 'uglify']);
    // grunt.registerTask('build', ['buildJade']);
    grunt.registerTask('clear', ['clean']);

};