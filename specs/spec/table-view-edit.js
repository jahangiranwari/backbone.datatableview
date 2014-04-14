'use strict';

describe('Table View', function() {
  var view, model, collection, View, Model, Collection, spy, server;

  View = Backbone.DataTableView.extend({
    initialize: function() {
      this.dataTableOptions = {
        "aoColumnDefs": [
          {"mData": "name", "aTargets": [0]},
          {"mData": "age", "aTargets": [1]}
        ]
      };
    },
    formTemplate: readFixtures('table-view.html')
  });
  Model = Backbone.Model.extend({url: "test", defaults: {name: "", age: 15}});
  Collection = Backbone.Collection.extend({url: "test", model: Model});

  describe('Edit', function() {

    beforeEach(function() {
      collection = new Collection([
        {id: 1, name: "Bob", age: 54},
        {id: 2, name: "Harry", age: 30}
      ]);
      server = sinon.fakeServer.create();
      server.respondWith(JSON.stringify(collection));
      spy = sinon.spy(Backbone.DataTableView.prototype, "editRow");
      view = new View({collection: collection});
      view.render();
      server.respond();
      view.$('button.bdt-edit:first').click();
    });

    afterEach(function() {
      view.close();
      server.restore();
      Backbone.DataTableView.prototype.editRow.restore();
    });

    it('should call editRow method when "Edit" button is clicked', function() {
      expect(spy).toHaveBeenCalled();
    });

    it('should display a edit modal form', function() {
      var name, age;
      name = collection.first().get('name');
      age = collection.first().get('age').toString();

      expect(spy).toHaveBeenCalled();
      expect(view.$el).toContainHtml('<h3>Edit</h3>');
      expect(view.$('input[name=name]')).toHaveValue(name);
      expect(view.$('input[name=age]')).toHaveValue(age);
    });

    describe('on saving', function() {
      var newName = "Tom";

      beforeEach(function() {
        server.respondWith(JSON.stringify({id: 1, name: newName, age: 54}));
        view.$('input[name=name]').val(newName);
        view.$('button.bdt-save').click();
        server.respond();
      });

      it('should update model in collection', function() {
        expect(spy).toHaveBeenCalled();
        expect(collection.first().get('name')).toEqual(newName);
      });

      it('should update row in table', function() {
        expect(spy).toHaveBeenCalled();
        expect(view.$('tbody td:first')).toHaveText(newName);
      });
    });
  });

});
