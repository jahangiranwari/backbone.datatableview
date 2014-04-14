
/*!
 * Backbone.DataTableView
 *
 * Copyright (c)2013 Jahangir Anwari
 * Dual licensed under the MIT and GPLv2 licenses.
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */


// A view to enable easy CRUD functionality using DataTables
(function ($, _, Backbone) {
  'use strict';
  var Events, generateErrorHTML, renderError;

  Events = Backbone.Events;

  Backbone.DataTableView = Backbone.View.extend({
    template: '<div class="errors"></div><div class="modal-form"></div>' +
              '<table class="table table-striped table-bordered"></table>',

    addButton: '<button class="btn bdt-add" data-toggle="modal">Add</button>',
    editButton: '<button class="btn btn-mini bdt-edit">Edit</button>',
    deleteButton: '<button class="btn btn-danger btn-mini bdt-delete">Delete</button>',

    /**
     * Doing our initialization here
     * Caching reference to current view's table in this.$table
     */
    preRenderInitialize: function () {
      _.bindAll(this, 'render', 'renderDataTable', 'renderEditDeleteColumn', 'handleError');
      Events.on('create' + this.cid, this.createRow, this);
      Events.on('update' + this.cid, this.updateRow, this);
      this.$el.html(this.template);
      this.$table = this.$('table');
      if (!this.disableAdd) {
        this.$el.prepend(this.addButton);
      }
      this.options = {};
    },

    events: {
      'click .bdt-add': 'addRow',
      'click .bdt-edit': 'editRow',
      'click .bdt-delete': 'deleteRow'
    },

    // Default DataTables settings.
    // See http://datatables.net/blog/Twitter_Bootstrap_2
    defaultDataTableOptions: {
      'sDom': '<"row"<"span4"l><"pull-right"f>r>t<"row-fluid"<"span5"i><"span7"p>>',
      'aaSorting': [],
      'bDestroy': true
    },


    /**
     * Fetches the collection
     *   On success creates and renders a DataTable
     *   On failure displays errors
     *
     * @returns {Backbone.DataTableView} this
     */
    render: function () {
      if (!this.dataTableOptions.aoColumnDefs || this.dataTableOptions.aoColumnDefs.length === 0){
        throw new Error('"aoColumnDefs" not found. Please define DataTables aoColumnDefs');
      }
      this.preRenderInitialize();

      if (this.collection.length === 0) {
        this.collection.fetch({
          success: this.renderDataTable,
          error: this.handleError
        });
      }
      else {
        this.renderDataTable(null, this.collection.toJSON());
      }

      return this;
    },

    /**
     * Creates a DataTable and renders it
     *
     * @param {Backbone.Collection} collection
     * @param {jXHR} response
     * @param {object} options
     */
    renderDataTable: function (collection, response, options) {
      var dataTableOptions = this.mergeDataTableOptions(response);
      this.$table.dataTable(dataTableOptions);
    },


    /**
     * Create a new model and display the modal form to allow users to input values
     * @param {Events} event "Add" button click
     */
    addRow: function (event) {
      var model = new this.collection.model();
      this.createAndRenderFormView(model);
    },


    /**
     * Add the saved model to collection
     * Calls DataTables fnAddData to add new model to the table
     * @param {Backbone.Model} model
     */
    createRow: function (model) {
      this.collection.add(model);
      this.$table.fnAddData(model.toJSON());
    },


    /**
     * Gets the model for corresponding row and displays the modal form for editing
     *
     * @param {Events} event "Edit" button click
     */
    editRow: function (event) {
      var id, model;
      id = this.getModelId($(event.currentTarget));
      model = this.collection.get(id);
      this.createAndRenderFormView(model);
    },


    /**
     * Updates the current row being edited with updated model values.
     * Finds the row to update by getting the position of the model in collection
     * Delegates to DataTables#fnUpdate to update the row
     *
     * @param {Backbone.Model} model
     */
    updateRow: function (model) {
      var rowIndex = this.collection.indexOf(model);
      this.$table.fnUpdate(model.toJSON(), rowIndex, undefined, false, false);
    },


    /**
     * Destroys a model and remove the corresponding row from the table
     *
     * @param {Event} event jQuery event object
     */
     deleteRow: function (event) {
      var self, id, model, continueDelete, rowIndex;

      continueDelete = _.isFunction(this.beforeDelete) ? this.beforeDelete() : true;
      if (continueDelete) {
        id = this.getModelId($(event.currentTarget));
        model = this.collection.get(id);
        rowIndex = this.collection.indexOf(model);
        self = this;
        model.destroy({
            success: function (model, response) {
              self.$table.fnDeleteRow(rowIndex);
            },
            error: this.handleError
          },{ wait: true });
      }
    },

    /**
     * Create a Backbone.DataTableFormView and passes all user-defined methods
     * The current table's view.cid is also passed along to allow TableFormView
     * that is used when adding custom events
     *
     * @param {type} model
     * @returns {@exp;Backbone@call;DataTableFormView}
     */
    createAndRenderFormView: function (model) {
      var view = new Backbone.DataTableFormView({
                model: model,
                template: this.formTemplate,
                tableViewCid: this.cid,
                serialize: this.serialize,
                compiledTemplate: this.compileTemplate,
                renderError: this.renderError
              });
      this.displayModalForm(view);
    },

    /**
     * Add the form view (Bootstrap's Modal) to DOM
     *
     * @param {type} model
     * @returns {undefined}
     */
    displayModalForm: function (view) {
      this.$('div.modal-form').html(view.render().el);
      this.$('div.modal').modal('show');
    },

    handleError: function (collection, response, options) {
      renderError(response.responseText, this);
    },

    renderEditDeleteColumn: function () {
      var button;
      if (this.disableEdit) {
        button = this.deleteButton;
      }
      else if (this.disableDelete) {
        button = this.editButton;
      }
      else {
        button = this.editButton + '\u0009' + this.deleteButton;
      }
      return button;
    },

    /**
     * Retrieve the model id for the current row where the edit/delete button was clicked
     *
     * @param {object} $target jQuery button object
     * @returns {int|string} id Model id
     */
    getModelId: function ($target) {
      var row, id;
      row = $target.closest('tr')[0];
      id = this.$table.fnGetData(row).id;
      return id;
    },

    /**
     * Merge the default DataTables settings with the one provided by the user
     * Additionally if "disableEditDelete" is not set then add column definition
     * for Edit/Delete column
     *
     * @param {type} response
     * @returns {object} dataTableOptions
     */
    mergeDataTableOptions: function (response) {

      var dataTableOptions = {};
      dataTableOptions = _.clone(this.defaultDataTableOptions);
      _.extend(dataTableOptions, this.dataTableOptions, {aaData: response});

      if (!this.disableEditDelete) {
        dataTableOptions.aoColumnDefs.push({
          'mData': null,
          'aTargets': [dataTableOptions.aoColumnDefs.length],
          'bSearchable': false,
          'bSortable': false,
          'sClass': 'edit-delete',
          'mRender': this.renderEditDeleteColumn
        });
      }

      return dataTableOptions;
    },

    /**
     * Unbinding element events
     * Unbind all collection events
     * Destroy DataTable generated table
     * Remove the view from the DOM
     */
    close: function () {
      this.off();
      this.collection.off(null, null, this);
      if (this.$table && $.fn.DataTable.fnIsDataTable(this.$table[0])) {
        this.$table.fnDestroy(true);
      }
      this.remove();
    }

  });


  /**
   * A modal view that displays the form for a model.
   *
   */
  Backbone.DataTableFormView = Backbone.View.extend({
    initialize: function (options) {
      var self = this;
      _.bindAll(this, 'handleError');
      this.options = options;
      this.listenTo(this.model, 'invalid', this.handleError);
      this.listenTo(this.model, 'sync', this.close);
      this.$('div.modal').on('hidden hidden.bs.modal', function () {
        self.remove();
        self.$('div.modal').off();
      });
    },

    events: {
      'click .bdt-save': 'save',
      'click .bdt-close': 'close'
    },

    render: function () {
      this.template = this.compileTemplate(this.options.template);
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    /**
     * Compiles the template. By default uses Underscore.js "_.template" method.
     * If the user has already given a compiled template then we just return that.
     *
     * @param {string} formTemplate
     * @returns {func}
     */
    compileTemplate: function(formTemplate){
      if (!formTemplate || formTemplate.length === 0){
        throw new Error('Form template not found. Please define a template');
      }

      return  _.isFunction(formTemplate) ? formTemplate : _.template(formTemplate);
    },

    /**
     * Save model on server/persistence layer
     *
     *  On "success" triggers "update" event that will update the model's row in table
     *  On "error" calls handleError method to parse and display the errors
     *
     * @param {Event} event "Save" button click
     */
    save: function (event) {
      var eventName = this.model.isNew() ? 'create' : 'update';
      eventName += this.options.tableViewCid;

      this.model.save(this.serialize(), {
        success: function (model, response, options) {
          Events.trigger(eventName, model);
        },
        error: this.handleError
      });
    },

    /**
     * Serializes the form input values to an object
     * By default uses Ben Alman's jQuery serializeObject plugin
     * Users can override the default serialization by
     * defining their own serialize method
     *
     * @returns {object} attrs
     */
    serialize: function () {
      var attrs = {};
      if (this.options.serialize) {
        attrs = this.options.serialize.call(this);
      }
      else {
        attrs = this.serializeObject();
      }
      return attrs;
    },

    //! jQuery serializeObject - Copyright 2010 "Cowboy" Ben Alman
    serializeObject: function () {
      var obj = {};
      $.each(this.$('form').serializeArray(), function (i, o) {
        var n = o.name, v = o.value;
        obj[n] = obj[n] === undefined ? v
                : $.isArray(obj[n]) ? obj[n].concat(v)
                : [obj[n], v];
      });
      return obj;
    },

    handleError: function (model, error) {
      if (_.isObject(error) && error.responseText) {
        error = error.responseText;
      }
      renderError(error, this);
    },

    close: function () {
      if (!_.isEmpty(this.model.validationError)) {
        this.model.attributes = this.model.previousAttributes();
      }
      this.unbind();
      this.$('div.modal').modal('hide');
    }
  });


  //
  // Common helper methods used by Backbone.DataTableFormView and Backbone.DataTableView
  //

  /**
   * Get the HTML for the errors and adds it to the view, most often <div class="errors">
   * Users can override the default error handling by providing their own
   * renderError method.
   *
   * Note: this method is shared by both DataTableView and DataTableFormView
   *
   * @param {array|string} errors
   * @param {Backbone.View} view  Backbone.DataTableView/Backbone.DataTableFormView
   */
  renderError = function (errors, view) {
    if (view.renderError) {
      view.renderError(errors);
    }
    else if (view.options.renderError) {
      view.options.renderError(errors);
    }
    else {
      var errorsHTML = generateErrorHTML(errors);
      view.$el.find('div.errors').html(errorsHTML);
    }
  };

 /**
   * Generate the HTML necessary for displaying the error
   * Depending on the type of the error argument the generated HTML could be
   *    A UL consisting a list of all errors
   *    A P tag containing the error
   *
   * @param {array|string} error
   * @returns {String} errorHTML
   */
  generateErrorHTML = function (error) {
    var errorHTML;

    if (_.isArray(error) && error.length > 1) {
      errorHTML = '<div class="alert alert-error"><ul>';
      _.each(error, function (errorItem) {
        errorHTML += '<li>' + errorItem + '</li>';
      });
      errorHTML += '</ul></div>';
    }
    else {
      errorHTML = '<p class="alert alert-error">' + error + '</p>';
    }
    return errorHTML;
  };

}(jQuery, _, Backbone));