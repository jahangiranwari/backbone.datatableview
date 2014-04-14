'use strict';

var utils = {};
utils.template = (function(){

    // Private variable to store all loaded templates
    var _templates = {};

    // Perform a GET request to fetch an external template
    var getByUrl = function (src) {

        return $.ajax({
                    type: 'GET',
                    url: src + '.html',
                    dataType: 'html',
                    async: false
            }).responseText;
    }

    // Returns a template using its name.
    // Note: For inline templates the name is the "id" attribute of the <script type="text/template"> element
    var  getByName = function (name) {

        if ($('#'+name).length != 0) {
            _templates[name] = $('#'+name).html();
        }

        if (typeof _templates[name] == 'undefined' ) {
            _loadTemplate(name, this);
        }

        return _templates[name];

    }

    // Change context to "template" module and loads an external template
    var _loadTemplate = function(name, context) {
        var self = context;
        _templates[name] = self.getByUrl(self.dir +'/'+ name);
        return;
    }

    // Load all external templates
    // Note: Its necessary to pass the "this" context which currently points to "tpl" module
    var  loadTemplates = function (names) {
        var len = names.length;
        while (len--) _loadTemplate(names[len], this);
    }

   // Public interface
   return {
            dir: '',
            getByUrl: getByUrl,
            getByName: getByName,
            load: loadTemplates
          }
})();

utils.template.dir = "app/templates";