module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    watch: {
      specs: {
        files: ['<%= jasmine.src %>', '<%= jasmine.options.specs %>', '<%= jasmine.options.vendor %>', 'specs/fixtures/*.html', 'Gruntfile.js', ],
        tasks: ['jshint', 'jasmine', 'uglify']
      },
      readme: {
        options: {
          livereload: true
        },
        files: ['Gruntfile.js', '*.md'],
        tasks: 'markdown:readme'
      }
    },
    jasmine: {
      src:  'backbone.datatableview.js',
      options: {
        specs: 'specs/spec/*.js',
        helpers: [
          'specs/lib/jasmine-jquery.js',
          'specs/lib/sinon.js',
          'specs/lib/jasmine-sinon.js',
          'specs/support/spec-helper.js'
        ],
        vendor: [
          'vendor/javascripts/jquery-1.7.1.min.js',
          'vendor/javascripts/json2.js',
          'vendor/javascripts/jquery.ba-serializeobject.js',
          'vendor/javascripts/underscore-min.js',
          'vendor/javascripts/backbone-min.js',
          'vendor/javascripts/backbone.localStorage-min.js',
          'vendor/javascripts/bootstrap.min.js',
          'vendor/javascripts/jquery.dataTables.min.js',
          'vendor/javascripts/DT_bootstrap.js'
        ]
      }
    },
    jshint: {
      files: ['<%= jasmine.src %>'],
      options: {
        jshintrc : '.jshintrc'
      }
    },
    uglify : {
      options: {
        preserveComments: 'some'
      },
      build : {
        src : '<%= jasmine.src %>',
        dest : 'backbone.datatableview.min.js'
     }
    },
    markdown: {
      readme: {
        files: [
          {
            expand: true,
            src: '*.md',
            dest: '',
            ext: '.html'
          }
        ]
      },
      options: {
        markdownOptions: {
          gfm: true,
          tables: true,
          breaks: true,
          pedantic: false,
          sanitize: true,
          smartLists: true,
          smartypants: false
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-markdown');


  grunt.registerTask('default', ['jshint', 'jasmine']);

}

