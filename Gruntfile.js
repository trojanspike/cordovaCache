module.exports = function(grunt){
    'use strict';

    grunt.initConfig({

        /* watch config */
        watch: {
            coffee: {
                files: ['dev/*.coffee'],
                tasks: 'coffee:dev',
                options: {
					/* <script src="http://localhost:35729/livereload.js"></script> */
					livereload: true
				},
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
var fs = require('fs');
require('http').createServer(function(req, res){
	if( fs.existsSync(__dirname+req.url) ){
		res.writeHead(200, {"Content-Type":'application/javascript'});
		res.end( fs.readFileSync(__dirname+req.url, {encoding:'utf8'}) );	
	} else {
		res.writeHead(404, {"Content-Type":'text/plain'});
		res.end(req.url + ' :: not found');
	}
	
}).listen(9005);
