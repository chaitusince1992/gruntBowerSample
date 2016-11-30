module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: '\n\n//-----------------------------------------------\n',
                banner: '\n\n//-----------------------------------------------\n'
            },
            dist: {
                src: ['components/js/*/*.js'],
                dest: 'builds/development/js/script.js'
            },
            prod: {
                src: ['components/js/*/*.js'],
                dest: 'builds/production/js/script.js'
            }
        }, //js concat
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    src: 'components/css/style.sass',
                    dest: 'builds/development/css/style.css'
                }]
            },
            prod: {
                options: {
                    style: 'compressed'
                },
                files: [{
                    src: 'components/css/style.scss',
                    dest: 'builds/production/css/style.css'
                }]
            }
        }, //sass
        wiredep: {
            task: {
                src: 'builds/development/**/*.html'
            }
        },
        bower_concat: {
            all: {
                dest: "builds/development/js/lib/_bower.js",
                cssDest: "builds/development/css/_bower.css"
            }
        },
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 3000,
                    base: 'builds/development/',
                    livereload: true
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['builds/development/view/*.html', 'components/js/**/*.js', 'components/**/*.sass'],
                tasks: ['concat', 'sass']
            }
        }
    }); //initconfig

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-bower-concat');

    grunt.registerTask('default', ['wiredep','bower_concat', 'concat', 'sass', 'connect', 'watch']);
}
