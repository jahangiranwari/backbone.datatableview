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

  describe('Add', function() {

    beforeEach(function() {
      collection = new Collection([
        {id: 1, name: "Bob", age: 54},
        {id: 2, name: "Harry", age: 30}
      ]);
      server = sinon.fakeServer.create();
      server.respondWith(JSON.stringify(collection));
      spy = sinon.spy(Backbone.DataTableView.prototype, "addRow");
      view = new View({collection: collection});
      view.render();
      server.respond();
      view.$('button.bdt-add').click();
    });

    afterEach(function() {
      view.close();
      server.restore();
      Backbone.DataTableView.prototype.addRow.restore();
    });

    it('should call addRow method when "Add" button is clicked', function() {
      expect(spy).toHaveBeenCalled();
    });

    it('should display a modal form', function() {
      var defaultAge = Model.prototype.defaults.age + '';
      expect(spy).toHaveBeenCalled();
      expect(view.$el).toContainHtml('<h3>Add</h3>');
      expect(view.$el).toContainHtml('<label for="name">Name</label>');
      expect(view.$('input[name=age]')).toHaveValue(defaultAge);
    });

    it('add new modal to collection on save', function() {
      //given
      model = {name: "Jimbo", age: 12};
      server.respondWith(JSON.stringify(model));
      var intialCollectionSize = view.collection.length;

      //when
      view.$('input[name=name]').val(model.name);
      view.$('input[name=age]').val(model.age);
      view.$('button.bdt-save').click();
      server.respond();

      //then
      expect(spy).toHaveBeenCalled();
      expect(view.collection.length).toEqual(intialCollectionSize + 1);
    });
  });

});
