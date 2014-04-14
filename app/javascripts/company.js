var App = App || {
          Data: {},
          Views: {},
          Models: {},
          Collections: {}
        };

App.Models.Company = Backbone.Model.extend({
   localStorage: new Backbone.LocalStorage("datatables-backbone-companies"),
   defaults: {
    'category_name' : '',
    'address' : '',
    'company_name' : '',
    'hiring' : false,
    'address2' : '',
    'url' : ''
   }
});

App.Collections.Company = Backbone.Collection.extend({
    model: App.Models.Company,
    localStorage: new Backbone.LocalStorage("datatables-backbone-companies")
});


//Views
App.Views.Companies = Backbone.DataTableView.extend({
    formTemplate: utils.template.getByName("company"),
    initialize: function () {
      this.dataTableOptions = {
          'sDom': '<"row"<"span4"l>r>t<"row-fluid"<"span5"i><"span7"p>>',
          'sPaginationType': 'bootstrap',
          'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
          "aoColumnDefs": [
              { "mData": "company_name", "sTitle": "Company Name", "aTargets": [0] },
              { "mData": "address", "sTitle": "Address", "aTargets": [1] },
              { "mData": "address2", "sTitle": "Address2", "aTargets": [2] },
              { "mData": "hiring", "sTitle": "Hiring", "aTargets": [3],
                 "mRender": function (data, type, full) {
                      return (data) ? '&#10004;' : '&#10008;';
                  }
              },
              { "mData": "category_name", "sTitle": "Category Name", "aTargets": [4] },
              { "mData": "city", "sTitle": "City", "aTargets": [5] },
              { "mData": "url", "sTitle": "URL", "aTargets": [6] }
          ]
      };
    }
});


App.Views.CompaniesCustomAdd = Backbone.DataTableView.extend({
    formTemplate: utils.template.getByName("company"),
    addButton: '<button class="btn bdt-add"><i class="icon-plus-sign"></i> Add</button>',
    initialize: function () {
      this.dataTableOptions = {
          'sDom': '<"row"<"span4"l>r>t<"row-fluid"<"span5"i><"span7"p>>',
          'sPaginationType': 'bootstrap',
          'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
          "aoColumnDefs": [
              { "mData": "company_name", "sTitle": "Company Name", "aTargets": [0] },
              { "mData": "address", "sTitle": "Address", "aTargets": [1] },
              { "mData": "address2", "sTitle": "Address2", "aTargets": [2] },
              { "mData": "hiring", "sTitle": "Hiring", "aTargets": [3],
                 "mRender": function (data, type, full) {
                      return (data) ? '&#10004;' : '&#10008;';
                  }
              },
              { "mData": "category_name", "sTitle": "Category Name", "aTargets": [4] },
              { "mData": "city", "sTitle": "City", "aTargets": [5] },
              { "mData": "url", "sTitle": "URL", "aTargets": [6] }
          ]
      };
    }
});


App.Views.CompaniesCustomEdit = Backbone.DataTableView.extend({
    formTemplate: utils.template.getByName("company"),
    editButton: '<button class="btn btn-mini bdt-edit">&#9998;</button>',
    initialize: function () {
      this.dataTableOptions = {
          'sDom': '<"row"<"span4"l>r>t<"row-fluid"<"span5"i><"span7"p>>',
          'sPaginationType': 'bootstrap',
          'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
          "aoColumnDefs": [
              { "mData": "company_name", "sTitle": "Company Name", "aTargets": [0] },
              { "mData": "address", "sTitle": "Address", "aTargets": [1] },
              { "mData": "address2", "sTitle": "Address2", "aTargets": [2] },
              { "mData": "hiring", "sTitle": "Hiring", "aTargets": [3],
                 "mRender": function (data, type, full) {
                      return (data) ? '&#10004;' : '&#10008;';
                  }
              },
              { "mData": "category_name", "sTitle": "Category Name", "aTargets": [4] },
              { "mData": "city", "sTitle": "City", "aTargets": [5] },
              { "mData": "url", "sTitle": "URL", "aTargets": [6] }
          ]
      };
    }
});


App.Views.CompaniesCustomDelete = Backbone.DataTableView.extend({
    formTemplate: utils.template.getByName("company"),
    deleteButton: '<button class="btn btn-danger btn-mini bdt-delete">&#10005;</button>',
    initialize: function () {
      this.dataTableOptions = {
          'sDom': '<"row"<"span4"l>r>t<"row-fluid"<"span5"i><"span7"p>>',
          'sPaginationType': 'bootstrap',
          'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
          "aoColumnDefs": [
              { "mData": "company_name", "sTitle": "Company Name", "aTargets": [0] },
              { "mData": "address", "sTitle": "Address", "aTargets": [1] },
              { "mData": "address2", "sTitle": "Address2", "aTargets": [2] },
              { "mData": "hiring", "sTitle": "Hiring", "aTargets": [3],
                 "mRender": function (data, type, full) {
                      return (data) ? '&#10004;' : '&#10008;';
                  }
              },
              { "mData": "category_name", "sTitle": "Category Name", "aTargets": [4] },
              { "mData": "city", "sTitle": "City", "aTargets": [5] },
              { "mData": "url", "sTitle": "URL", "aTargets": [6] }
          ]
      };
    }
});


