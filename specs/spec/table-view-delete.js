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

  describe('Delete', function() {

    beforeEach(function() {
      collection = new Collection([
        {id: 1, name: "Bob", age: 54},
        {id: 2, name: "Harry", age: 30}
      ]);
      server = sinon.fakeServer.create();
      server.respondWith(JSON.stringify(collection));
      view = new View({collection: collection});
      view.beforeDelete = function () {
         var confirmDelete = confirm('Are you sure you want to delete the row?');
         return confirmDelete;
      };
      view.render();
      server.respond();
    });

    afterEach(function() {
       view.close();
       server.restore();
    });

    it('should call user defined beforeDelete method before destroying model', function() {
      var stub = sinon.stub(view, "beforeDelete").returns(false);
      view.$('button.bdt-delete').click();
      expect(stub).toHaveBeenCalled();
      stub.restore();
    });

    it('should display confirmation box on clicking delete button', function() {
      var stub = sinon.stub(window, "confirm").returns(false);
      view.$('button.bdt-delete').click();
      expect(stub).toHaveBeenCalled();
      stub.restore();
    });

    describe('on confirmation', function() {
      var stub, initialCollectionSize;
      beforeEach(function() {
        stub = sinon.stub(window, "confirm");
        initialCollectionSize = view.collection.length;
      });

      afterEach(function() {
        stub.restore();
      });

      it('should remove a row from table for "Yes"', function() {
        stub.returns(true);
        server.respondWith([200, {}, '{}']);
        view.$('button.bdt-delete:first').click();
        server.respond();
        expect(view.$('tbody tr').length).toEqual(initialCollectionSize - 1);
      });

      it('should not remove a row from table for "No"', function() {
        stub.returns(false);
        view.$('button.bdt-delete:first').click();
        expect(view.$('tbody tr').length).toEqual(initialCollectionSize);
      });
    });

    describe('on failure', function() {
      var responseText, stub;
      responseText = "Service Unavailable";

      beforeEach(function() {
        stub = sinon.stub(window, "confirm").returns(true);
        server.respondWith([503, {}, responseText]);
        view.$('button.bdt-delete:first').click();
        server.respond();
      });

      afterEach(function() {
        stub.restore();
      });

      it('should display error notification', function() {
        expect(view.$el).toContain('.alert.alert-error');
      });

      it('should display error response returned by the server', function() {
        expect(view.$('p.alert.alert-error')).toHaveText(responseText);
      });

    });

  });

});
