Backbone.DataTableView
======================

A Backbone View that provides a simple, easy and flexible way to create a CRUD interface for your Backbone collection.

Features
--------
* **Create:** model and it's corresponding table row
* **Read:** collection and render it as a table, creating a row for each model
* **Update:** model and corresponding row in the table
* **Delete:** model and remove row from table



Additional Features
-------------------
Since Backbone.DataTableView uses *jQuery DataTables* to render the collection,
we get all the goodies that *DataTables* provides for free.

* Sorting
* Search
* Pagination


Usage
-----

To use Backbone.DataTableView you only need to provide

* Backbone.Collection
  If the collection already contains models Backbone.DataTableView will use them if not then it perform a `fetch` to get the models from the server.

* DataTables `aaColumnDefs`
  For the attributes of the model that needs to be displayed you must define a hash containing `mData` and `aTargets`.

  ```javascript
  this.dataTableOptions = {
      "aoColumnDefs": [
          { "mData": "firstName", "sTitle": "First Name", "aTargets": [0] },
          { "mData": "lastName", "sTitle": "Last Name", "aTargets": [1] }
      ]
    };
  ```

* Bootstrap form modal template to add/edit a Backbone.Model
  To allow user to add or edit a model you must provide a `formTemplate`. The template must be a Bootstrap Modal form.
  ```html
  <div class="modal fade modal-container">
    <div class="modal-header">
      <button type="button" class="close bdt-close" data-dismiss="modal">×</button>
    </div>
    <div class="modal-body">

       <!-- Placeholder div to display errors -->
       <div class="errors"></div>
        <form>
        <div class="span3">
          <fieldset>
            <label for="firstName">First Name</label>
            <input class="span2" type="text" name="firstName" value="<%= firstName %>">
          </fieldset>
        </div>
        <div class="span3">
          <fieldset>
            <label for="lastName">Last Name</label>
            <input class="span2" type="text" name="lastName" value="<%= lastName %>">
          </fieldset>
        </div>
      </form>

    </div>
    <div class="modal-footer">
      <button class="btn pull-left bdt-close" data-dismiss="modal">Close</button>
      <button class="btn btn-primary pull-left bdt-save">Save</button>
    </div>
  </div>
  ```

## CSS Classes

<b>B</b>ackbone.<b>D</b>ata<b>T</b>ableView has a set of predefined event listeners attached to
the following classes.

| Class      | Button|
| --------   |-------|
| bdt-add    | Add   |
| bdt-edit   | Edit  |
| bdt-delete | Delete|
| bdt-save   | Save  |
| bdt-close  | Close |

When creating the formTemplate or custom Add/Edit/Delete buttons it is important to make sure that the corresponding class is present.

Examples
---------

#### Minimal configuration ####

```javascript
//View class
View = Backbone.DataTableView.extend({
  formTemplate: $("#employee-form-tpl").html(),
  initialize: function () {

    //DataTables settings
    this.dataTableOptions = {
      "aoColumnDefs": [
          { "mData": "firstName", "sTitle": "First Name", "aTargets": [0] },
          { "mData": "lastName", "sTitle": "Last Name", "aTargets": [1] }
      ]
    };
  }
});

var collection = new EmployeeCollection();
var view = new View({ collection: collection });
$('#container').append(view.render().el);
```

#### Table without add option

By setting `disableAdd` to `true` you can disable the add functionality.

```javascript
View = Backbone.DataTableView.extend({
  initialize: function () {
    this.dataTableOptions = {
      "aoColumnDefs": [
        { "mData": "repository_name", "sTitle": "Name", "aTargets": [0] },
        { "mData": "repository_description", "sTitle": "Description", "aTargets": [1] },
        { "mData": "repository_language", "sTitle": "Language", "aTargets": [2] }
      ]
    };
    this.disableAdd = true;
   }
});;
```
#### Table without edit option

By setting `disableEdit` to `true` you can disable the delete functionality.

```javascript
View = Backbone.DataTableView.extend({
  initialize: function () {
    this.dataTableOptions = {
      "aoColumnDefs": [
        { "mData": "repository_name", "sTitle": "Name", "aTargets": [0] },
        { "mData": "repository_description", "sTitle": "Description", "aTargets": [1] },
        { "mData": "repository_language", "sTitle": "Language", "aTargets": [2] }
      ]
    };
    this.disableEdit = true;
   }
});
```

#### Table without delete option

By setting `disableDelete` to `true` you can disable the delete functionality.

```javascript
View = Backbone.DataTableView.extend({
  initialize: function () {
    this.dataTableOptions = {
      "aoColumnDefs": [
        { "mData": "repository_name", "sTitle": "Name", "aTargets": [0] },
        { "mData": "repository_description", "sTitle": "Description", "aTargets": [1] },
        { "mData": "repository_language", "sTitle": "Language", "aTargets": [2] }
      ]
    };
    this.disableDelete = true;
   }
});;
```


#### Table without add, edit and delete options

You can render a simple table without the 'add', 'edit' and 'delete' functionality by
setting `disableAdd` and `disableEditDelete` to `true`

```javascript
View = Backbone.DataTableView.extend({
  initialize: function () {
    this.dataTableOptions = {
      "aoColumnDefs": [
        { "mData": "repository_name", "sTitle": "Name", "aTargets": [0] },
        { "mData": "repository_description", "sTitle": "Description", "aTargets": [1] },
        { "mData": "repository_language", "sTitle": "Language", "aTargets": [2] }
      ]
    };
    this.disableAdd = true;
    this.disableEditDelete = true;
   }
});

```

Overriding Methods
------------------
You can override the following method to provide a custom implementation to suit your needs.

* `serialize`
* `beforeDelete`
* `renderErrors`

### Examples


#### `serialize`

By default Backbone.DataTableView uses Ben Alman's jQuery serializeObject when saving a model.
You can provide a `serialize` method in your view to do custom serialization.

```javascript
View = Backbone.DataTableView.extend({
  formTemplate: $("#employee-form-tpl").html,
  initialize: function () {
    this.dataTableOptions = {
        "aoColumnDefs": [
            { "mData": "firstName", "sTitle": "First name", "aTargets": [0] },
            { "mData": "lastName", "sTitle": "Last name", "aTargets": [1] },
            { "mData": "startDate", "sTitle": "Start date", "aTargets": [2],
               "mRender": function (data, type, full) {

                  //Display only "date" portion
                  return new Date(data).toDateString();
               }
            }
        ]
     };
   },
   serialize: function () {
     var attrs = {};
     attrs = this.$('form').serializeObject();

     //save the date in ISO 8601 extended format
     attrs.startDate = new Date(attrs.startDate).toISOString();
     return attrs;
   }
});

var collection = new EmployeeCollection();
var view = new View({ collection: collection });
$('#container').append(view.render().el);
```



#### `beforeDelete`

If you want to perform some task before a model is destroyed you can define a `beforeDelete` method.
This method should return a boolean value. If the return value is false the model is not destroyed.

```javascript
View = Backbone.DataTableView.extend({
  formTemplate: $("#employee-form-tpl").html,
  initialize: function () {
    this.dataTableOptions = {
        "aoColumnDefs": [
            { "mData": "firstName", "sTitle": "First name", "aTargets": [0] },
            { "mData": "lastName", "sTitle": "Last name", "aTargets": [1] },
            { "mData": "startDate", "sTitle": "Start date", "aTargets": [2],
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

var collection = new EmployeeCollection();
var view = new View({ collection: collection });
$('#container').append(view.render().el);
```




#### `renderError` 

By default Backbone.DataTableView displays all errors inside &lt;div class="errors">.

* For just a single error it displays the error inside a &lt;p class="alert alert-warning">
* For multiple errors it displays each error inside a &lt;li>

You can override the default error rendering to provide your own.
```javascript
View = Backbone.DataTableView.extend({
  formTemplate: $("#employee-form-tpl").html,
  initialize: function () {
    this.dataTableOptions = {
        "aoColumnDefs": [
            { "mData": "firstName", "sTitle": "First name", "aTargets": [0] },
            { "mData": "lastName", "sTitle": "Last name", "aTargets": [1] },
            { "mData": "startDate", "sTitle": "Start date", "aTargets": [2],
               "mRender": function (data, type, full) {
                  return new Date(data).toDateString();
               }
            }
        ]
     };
   },
   // Display alerts for each error
   renderError: function(errors) {
     _.each(errors, function(error) {
        alert(error);
     });
   }
});

var collection = new EmployeeCollection();
var view = new View({ collection: collection });
$('#container').append(view.render().el);
```

Styling Buttons
---------------

You can provide your own button styles.


#### Add button style

By defining `addButton` we can style the delete button to look the way you want.

```javascript
View = Backbone.DataTableView.extend({
  //Add a plus icon to the add button.
  addButton: '<button class="btn bdt-add"><i class="icon-plus-sign"></i> Add</button>',
  ........
});
```
**Note:** `bdt-add` class must be defined in your custom add button.

#### Edit button style

Define `editButton` in your view to style the delete button to look the way you want.

```javascript
View = Backbone.DataTableView.extend({
  //Display pencil
  editButton: '<button class="btn bdt-edit">&#9998;</button>',
  ........
});
```
**Note:** `bdt-edit` class must be defined in your custom edit button.

#### Delete button style

Define `deleteButton` in your view to style the delete button to look the way you want.

```javascript
View = Backbone.DataTableView.extend({
  //Display cross sign
  deleteButton: '<button class="btn bdt-delete">&#10005;</button>',
  ........
});
```
**Note:** `bdt-delete` class must be defined in your custom delete button.

Dependencies
------------
  - [Backbone](https://github.com/documentcloud/backbone) `1.0`
  - [Underscore](https://github.com/documentcloud/underscore) `>=1.4.3`
  - [jQuery](https://github.com/jquery/jquery) `>= 1.7.1`
  - [Bootstrap](https://github.com/twbs/bootstrap) `>= 2.0.2`
  - [DataTables](https://github.com/DataTables/DataTables) `1.9.1`
