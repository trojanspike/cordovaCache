module.exports = function(grunt){
    'use strict';

    grunt.initConfig({

        /* watch config */
        watch: {
            coffee: {
                files: ['dev/*.coffee'],
                tasks: 'coffee:dev'
            }
        }
        /* coffee config */
        , coffee: {
            dev: {
                options: {
                    bare: true,
                    flatten: true
                },
                files: {'dev/cordovaCache.js':['dev/*.coffee']}
            }
            ,dist : {
                options: {
                    bare: true,
                    flatten: true
                },
                files: {'dist/cordovaCache.js':['dev/*.coffee']}
            }
        }

        , uglify : {
            dist : {
                options:{
                    sourceMap: true,
                }
                ,files : {
                    'dist/cordovaCache.min.js' : 'dist/cordovaCache.js'
                }
            }
        }
    });


    /*
     */

    // load dependancies
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-coffee");


    // setup hooks
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('dist', ['coffee:dist', 'uglify']);
};
