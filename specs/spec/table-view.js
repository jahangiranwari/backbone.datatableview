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

  beforeEach(function() {
    collection = new Collection([
      {id: 1, name: "Bob", age: 54},
      {id: 2, name: "Harry", age: 30}
    ]);
    server = sinon.fakeServer.create();
    server.respondWith(JSON.stringify(collection));
  });

  afterEach(function() {
    view.close();
    server.restore();
  });

  it('should throw an exception when DataTables Column Definition (i.e. aoColumnDefs) is not defined', function(){
      view = new View({collection: collection});
      view.dataTableOptions.aoColumnDefs = null;
      expect(function () {
        view.render();
        server.respond();
      }).toThrow(new Error('"aoColumnDefs" not found. Please define DataTables aoColumnDefs'));
  });

  describe('Load', function() {

    describe('with default settings', function () {

      beforeEach(function() {
        view = new View({collection: collection});
        view.render();
        server.respond();
      });

      it('should create a Datatable', function() {
        expect($.fn.DataTable.fnIsDataTable(view.$('table')[0])).toBeTruthy();
      });

      it('should create a row for each model', function() {
        expect(view.$('tbody tr').length).toEqual(collection.length);
      });

      it('should have a "Add" button', function() {
        expect(view.$('button.bdt-add').length).toEqual(1);
      });

      it('should have "Edit" and "Delete" buttons in last column', function() {
        var $td = view.$('tbody tr:first td:last');
        expect($td.html()).toContain("Edit")
        expect($td.html()).toContain("Delete")
        expect($('button', $td).length).toEqual(2);
      });

      describe('on failure', function() {
        var responseText = "Cannot find resource";

        beforeEach(function() {
          server.respondWith([404, {}, responseText]);
          collection.reset();
          view = new View({collection: collection});
          view.render();
          server.respond();
        });

        it('should display error notification', function() {
          expect(view.$el).toContain('.alert.alert-error');
        });

        it('should display error response returned by the server', function() {
          expect(view.$('p.alert.alert-error')).toHaveText(responseText);
        });

      });


    });

 describe('with disableAdd set to "true"', function () {

      beforeEach(function() {
        View.prototype.disableAdd = true;
      });

      afterEach(function() {
        View.prototype.disableAdd = false;
      });

      it('should not display Add button', function() {
          view = new View({ collection: collection });
          view.render();
          server.respond();
          expect(view.$el).not.toContain(".bdt-add")
      });
    });

    describe('with disableEditDelete set to "true"', function () {

      beforeEach(function() {
        View.prototype.disableEditDelete = true;
      });

      afterEach(function() {
        View.prototype.disableEditDelete = false;
      });

      it('should not display column with edit and delete buttons', function() {
          view = new View({ collection: collection });
          view.render();
          server.respond();
          var $td = view.$('tbody tr:first td:last');
          expect($td).not.toContain(".bdt-edit")
          expect($('button', $td).length).toEqual(0);
      });

      it('should not contain edit and delete settings in DataTables aoColumnDefs', function() {
          var spy, dataTableOptions;
          spy = sinon.spy(Backbone.DataTableView.prototype, "mergeDataTableOptions");
          view = new View({ collection: collection });
          view.render();
          server.respond();

          dataTableOptions = { sDom : '<"row"<"span4"l><"pull-right"f>r>t<"row-fluid"<"span5"i><"span7"p>>',
            aaSorting : [  ],
            bDestroy : true,
            aoColumnDefs : [
              { mData : 'name', aTargets : [ 0 ] },
              { mData : 'age', aTargets : [ 1 ] }
            ],
            aaData : [
              { id : 1, name : 'Bob', age : 54 },
              { id : 2, name : 'Harry', age : 30 }
            ]};

          expect(spy).toHaveBeenCalled();
          expect(spy.returned(dataTableOptions)).toBeTruthy();
      });
    });

  });

});
