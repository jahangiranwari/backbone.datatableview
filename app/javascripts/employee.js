var App = App || {
          Data: {},
          Views: {},
          Models: {},
          Collections: {}
        };

App.Models.Employee = Backbone.Model.extend({
   localStorage: new Backbone.LocalStorage("datatables-backbone-employee"),
   defaults: {
    firstName: "",
    lastName: "",
    gender:  "",
    email:  "",
    phoneNumber:  "",
    country:  "",
    startDate: new Date().toISOString()
   },
   validate: function(attrs, options) {
     var errors = [];
     if (attrs.gender != 'F' && attrs.gender != 'M') {
       errors.push('Gender can be either "M" or "F"');
     }

     if (!attrs.firstName) {
       errors.push("Please enter a first name");
     }

    return errors.length > 0 ? errors : false;
   }
});


App.Collections.Employee = Backbone.Collection.extend({
    model: App.Models.Employee,
    localStorage: new Backbone.LocalStorage("datatables-backbone-employee"),
});


App.Views.Employees = Backbone.DataTableView.extend({
  formTemplate: utils.template.getByName("employee"),
  initialize: function () {
    this.dataTableOptions = {
      'sPaginationType': 'bootstrap',
      'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
      "aoColumnDefs": [
        { "mData": "firstName", "sTitle": "First name", "aTargets": [0] },
        { "mData": "lastName", "sTitle": "Last name", "aTargets": [1] },
        { "mData": "gender", "sTitle": "Gender", "aTargets": [2] },
        { "mData": "email", "sTitle": "Email", "aTargets": [3] },
        { "mData": "phoneNumber", "sTitle": "Phone number", "aTargets": [4] },
        { "mData": "country", "sTitle": "Country", "aTargets": [5] },
        { "mData": "startDate", "sTitle": "Start date", "aTargets": [6],
          "mRender": function (data, type, full) {
            return new Date(data).toDateString();
           }
        }
      ]
     };
   }
});


App.Views.EmployeesWithSerialize = Backbone.DataTableView.extend({
   formTemplate: utils.template.getByName("employee"),
   initialize: function () {
    this.dataTableOptions = {
      'sPaginationType': 'bootstrap',
      'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
      "aoColumnDefs": [
        { "mData": "firstName", "sTitle": "First name", "aTargets": [0] },
        { "mData": "lastName", "sTitle": "Last name", "aTargets": [1] },
        { "mData": "gender", "sTitle": "Gender", "aTargets": [2] },
        { "mData": "email", "sTitle": "Email", "aTargets": [3] },
        { "mData": "phoneNumber", "sTitle": "Phone number", "aTargets": [4] },
        { "mData": "country", "sTitle": "Country", "aTargets": [5] },
        { "mData": "startDate", "sTitle": "Start date", "aTargets": [6],
          "mRender": function (data, type, full) {
            return new Date(data).toDateString();
           }
        }
      ]
    };
   },
   serialize: function () {
     var attrs = {};
     attrs = this.$('form').serializeObject();
     attrs.startDate = new Date(attrs.startDate).toISOString();
     return attrs;
   }
});


App.Views.EmployeesWithBeforeDelete = Backbone.DataTableView.extend({
   formTemplate: utils.template.getByName("employee"),
   initialize: function () {
       this.dataTableOptions = {
          'sPaginationType': 'bootstrap',
          'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
          "aoColumnDefs": [
               { "mData": "firstName", "sTitle": "First name", "aTargets": [0] },
               { "mData": "lastName", "sTitle": "Last name", "aTargets": [1] },
               { "mData": "gender", "sTitle": "Gender", "aTargets": [2] },
               { "mData": "email", "sTitle": "Email", "aTargets": [3] },
               { "mData": "phoneNumber", "sTitle": "Phone number", "aTargets": [4] },
               { "mData": "country", "sTitle": "Country", "aTargets": [5] },
               { "mData": "startDate", "sTitle": "Start date", "aTargets": [6],
                  "mRender": function (data, type, full) {
                      return new Date(data).toDateString();
                    }
               }
           ]
       };
   },
   beforeDelete: function() {
     return confirm('Are you sure you want to delete?');
   }
});


App.Views.EmployeesWithRenderError = Backbone.DataTableView.extend({
   formTemplate: utils.template.getByName("employee"),
   initialize: function () {
       this.dataTableOptions = {
           'sPaginationType': 'bootstrap',
           'oLanguage': {'sLengthMenu': '_MENU_ records per page'},
           "aoColumnDefs": [
               { "mData": "firstName", "sTitle": "First name", "aTargets": [0] },
               { "mData": "lastName", "sTitle": "Last name", "aTargets": [1] },
               { "mData": "gender", "sTitle": "Gender", "aTargets": [2] },
               { "mData": "email", "sTitle": "Email", "aTargets": [3] },
               { "mData": "phoneNumber", "sTitle": "Phone number", "aTargets": [4] },
               { "mData": "country", "sTitle": "Country", "aTargets": [5] },
               { "mData": "startDate", "sTitle": "Start date", "aTargets": [6],
                 "mRender": function (data, type, full) {
                    return new Date(data).toDateString();
                  }
               }
           ]
       };
   },
   renderError: function(errors) {
     _.each(errors, function(error) {
        alert(error);
     });
   }
});