'use strict';

describe('Form View', function() {
  var view, View, formTemplate, model, Model, spy, server;

  Model = Backbone.Model.extend({
    url: "test",
    validate: function(attrs, options) {
      var errors = [];
      if (!attrs.name) {
        errors.push("Please enter a name");
      }
      if (attrs.age > 110) {
        errors.push("Please enter a real age");
      }
      return errors.length > 0 ? errors : false;
    }
  });

  model = new Backbone.Model();
  View = Backbone.DataTableFormView;
  formTemplate = readFixtures('form-view.html');

  afterEach(function () {
    view.close();
  });

  it('should throw an exception when there is no valid formTemplate', function(){
      spy = sinon.spy(Backbone.DataTableFormView.prototype, "compileTemplate");
      view = new View({ model: model, template: formTemplate });
      view.options.template = null;
      expect(function () {
        view.render();
      }).toThrow(new Error('Form template not found. Please define a template'));
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveThrown();
      Backbone.DataTableFormView.prototype.compileTemplate.restore();
  });

  it('should call user-defined serialize method on save if its provided', function() {
    spy = sinon.spy();
    model.sync = function() {};
    view = new View({ model: model, template: formTemplate, serialize: spy });
    view.save();
    expect(spy).toHaveBeenCalled();
  });

  it('should use user-defined compiled template if its provided', function() {
    var myCompileTemplate = _.template('<p>This template is compiled by user</p>');
    view = new View({ model: model, template: myCompileTemplate });
    view.render();
    expect(view.$el).toHaveText('This template is compiled by user');
  });

  describe('should close', function () {
    var collection = new Backbone.Collection([{ id: 1, name: "Bob" }]);
    collection.url = 'test';
    beforeEach(function() {
      spy = sinon.spy(Backbone.DataTableFormView.prototype, "close");
      view = new View({ model: collection.first(), template: formTemplate });
    });

    afterEach(function () {
      Backbone.DataTableFormView.prototype.close.restore();
    });

    it('when "Close" button is clicked', function() {
      view.render();
      view.$('button.bdt-close').click();
      expect(spy).toHaveBeenCalled();
    });

    it('after saving a model', function() {
      server = sinon.fakeServer.create();
      server.respondWith(JSON.stringify(collection.first()));
      view.render();
      view.$('button.bdt-save').click();
      server.respond();
      expect(spy).toHaveBeenCalled();
      server.restore();
   });
  });

  describe('validation', function () {

    beforeEach(function() {
      model = new Model();
      view = new View({ model: model, template: formTemplate });
    });

    it('should displays a error message on any failed model validation', function() {
       view.render();
       model.set({age: 150});
       view.$('button.bdt-save').click();
       expect(view.$el).toContain('.alert.alert-error');
    });

    it('should display error inside paragraph tag for just one error', function() {
       view.render();
       model.set({name: 'Dwight', age: 150});
       view.$('button.bdt-save').click();
       expect(view.$el).toContain('p.alert.alert-error');
       expect(view.$('p.alert')).toHaveText('Please enter a real age');
    });

    it('should display an unordered list of errors for more than two errors', function() {
       view.render();
       model.set({age: 150});
       view.$('button.bdt-save').click();
       expect(view.$el).toContain('div.alert.alert-error');
       expect(view.$('div.alert li:first')).toHaveText('Please enter a name');
       expect(view.$('div.alert li:last')).toHaveText('Please enter a real age');
    });

    it('should display server returned error message on a failed model save', function() {
       var responseText, xhr, requests = [];
       responseText = 'Error: cannot save record.';
       xhr = sinon.useFakeXMLHttpRequest();
       xhr.onCreate = function (xhr) { requests.push(xhr); };
       model.set({id: 1, name: 'Dwight', age: 15});
       view.render();
       view.save();
       requests[0].respond(400, {}, responseText);
       expect(view.$el).toContain('p.alert.alert-error');
       expect(view.$('p.alert')).toHaveText(responseText);
       xhr.restore();
    });

  });

});