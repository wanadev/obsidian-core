"use strict";

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            doc: ["doc/yuidoc/"],
            tests: ["build/test/"]
        },

        copy: {
            tests: {
                files: [
                    {expand: true, cwd: "test/", src: ["index.html"], dest: "build/test/"},
                    {expand: true, cwd: "node_modules/mocha/", src: ["mocha.js", "mocha.css"], dest: "build/test/"}
                ]
            }
        },

        browserify: {
            tests: {
                files: {
                    "build/test/test.js": ["test/**/*.js"]
                },
                options: {
                    transform: ["babelify"],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },

        yuidoc: {
            doc: {
                name: "<%= pkg.name %>",
                description:"<%= pkg.description %>",
                version:"<%= pkg.version %>",
                options: {
                    paths: ["lib/", "helpers/"],
                    outdir: "doc/yuidoc/",
                    linkNatives: true,
                    tabtospace: 4
                }
            }
        },

        jshint: {
            app: {
                src: ["lib/*.js", "helpers/*.js", "test/*.js"],
                options: {
                    jshintrc: true
                }
            }
        },

        shell: {
            mocha_chrome: {
                command: "npx mocha-headless-chrome -f build/test/index.html",
            }
        },

    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-yuidoc");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-shell");

    grunt.registerTask("default", ["test"]);

    grunt.registerTask("build-tests", "Build the tests", ["clean:tests", "copy:tests", "browserify:tests"]);

    grunt.registerTask("test", "Run all code quality checks and unit tests", ["jshint", "build-tests", "shell:mocha_chrome"]);
};
