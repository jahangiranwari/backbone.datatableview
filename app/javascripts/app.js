var App = {
    Data: {},
    Views: {},
    Models: {},
    Collections: {},
    init: function() {

      var companiesColl, companiesView;
      companiesColl = new App.Collections.Company();
      if (localStorage.getItem("datatables-backbone-companies") === null) {
        companiesColl.add(App.Data.Companies);
        companiesColl.each(function(model) { model.save() });
      }
      companiesView = new App.Views.Companies({ collection: companiesColl  });
      $('#companies').append(companiesView.render().el);


      var employeeColl, employeesView;
      employeeColl = new App.Collections.Employee();
      if (localStorage.getItem("datatables-backbone-employee") === null) {
        employeeColl.add(App.Data.Employees);
        employeeColl.each(function(model) { model.save() });
      }
      var employeesView = new App.Views.Employees({ collection: employeeColl });
      $('#employees').html(employeesView.render().el);


      var languageColl, employeesView;
      jcoll = languageColl = new App.Collections.Language();
      if (localStorage.getItem("datatables-backbone-language") === null) {
        languageColl.add(App.Data.Languages);
        languageColl.each(function(model) { model.save() });
      }
      var languagesView = new App.Views.Languages({ collection: languageColl });
      $('#languages').append(languagesView.render().el);

    }

};