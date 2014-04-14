var App = App || {
          Data: {},
          Views: {},
          Models: {},
          Collections: {}
        };

App.Models.Repository = Backbone.Model.extend({
   localStorage: new Backbone.LocalStorage("datatables-backbone-repositories"),
    defaults: {
      repository_name: "",
      repository_description: "",
      repository_language:  "",
      repository_homepage:  "",
      repository_url:  ""
     }
});


App.Collections.Repository = Backbone.Collection.extend({
    model: App.Models.Repository,
    localStorage: new Backbone.LocalStorage("datatables-backbone-repositories"),
});



App.Views.T3Repositories = Backbone.DataTableView.extend({
  initialize: function () {
    this.dataTableOptions = {
      "sDom": "<l<f>r>t<'col-lg-5'i><'col-lg-7'p>",
      'sPaginationType': 'bootstrap',
      'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
      "aoColumnDefs": [
        { "mData": "repository_name", "sTitle": "Name", "aTargets": [0] },
        { "mData": "repository_description", "sTitle": "Description", "aTargets": [1] },
        { "mData": "repository_language", "sTitle": "Language", "aTargets": [2] },
        { "mData": "repository_homepage", "sTitle": "Homepage", "aTargets": [3] },
        { "mData": "repository_url", "sTitle": "URL", "aTargets": [4] }
      ]
    };
    this.disableAdd = true;
    this.disableEditDelete = true;
   }
});


App.Views.T3RepositoriesAddOnly = Backbone.DataTableView.extend({
  formTemplate: utils.template.getByName("bootstrap3"),
  addButton: '<button class="btn btn-default btn-sm bdt-add" data-toggle="modal">Add</button>',
  initialize: function () {
    this.dataTableOptions = {
      "sDom": "<l<f>r>t<'col-lg-5'i><'col-lg-7'p>",
      'sPaginationType': 'bootstrap',
      'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
      "aoColumnDefs": [
        { "mData": "repository_name", "sTitle": "Name", "aTargets": [0] },
        { "mData": "repository_description", "sTitle": "Description", "aTargets": [1] },
        { "mData": "repository_language", "sTitle": "Language", "aTargets": [2] },
        { "mData": "repository_homepage", "sTitle": "Homepage", "aTargets": [3] },
        { "mData": "repository_url", "sTitle": "URL", "aTargets": [4] }
      ]
    };
    this.disableEditDelete = true;
   }
});


App.Views.T3RepositoriesEditOnly = Backbone.DataTableView.extend({
  formTemplate: utils.template.getByName("bootstrap3"),
  editButton: '<button class="btn btn-default btn-xs bdt-edit">&#9998;</button>',
  initialize: function () {
       this.dataTableOptions = {
           "sDom": "<l<f>r>t<'col-lg-5'i><'col-lg-7'p>",
           'sPaginationType': 'bootstrap',
           'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
           "aoColumnDefs": [
               { "mData": "repository_name", "sTitle": "Name", "aTargets": [0] },
               { "mData": "repository_description", "sTitle": "Description", "aTargets": [1] },
               { "mData": "repository_language", "sTitle": "Language", "aTargets": [2] },
               { "mData": "repository_homepage", "sTitle": "Homepage", "aTargets": [3] },
               { "mData": "repository_url", "sTitle": "URL", "aTargets": [4] }
           ]
       };
      this.disableAdd = true;
      this.disableDelete = true;
   }
});


App.Views.T3RepositoriesDeleteOnly = Backbone.DataTableView.extend({
  formTemplate: utils.template.getByName("bootstrap3"),
  deleteButton: '<button class="btn btn-default btn-xs btn-danger bdt-delete">&#10005;</button>',
  initialize: function () {
    this.dataTableOptions = {
      "sDom": "<l<f>r>t<'col-lg-5 result-info'i><'col-lg-7'p>",
      'sPaginationType': 'bootstrap',
      'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
      "aoColumnDefs": [
        { "mData": "repository_name", "sTitle": "Name", "aTargets": [0] },
        { "mData": "repository_description", "sTitle": "Description", "aTargets": [1] },
        { "mData": "repository_language", "sTitle": "Language", "aTargets": [2] },
        { "mData": "repository_homepage", "sTitle": "Homepage", "aTargets": [3] },
        { "mData": "repository_url", "sTitle": "URL", "aTargets": [4] }
      ]
    };
    this.disableAdd = true;
    this.disableEdit = true;
   }
});
