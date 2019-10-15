### GDG Rochester Meetup 15/10
* #### Workshop folder contains code to be written
* #### Solutions folder contains completed example

#### Cheatsheet 
* Create a new db 
`indexedDB.open('name_of_db', 1);`

* Set db to a variable in event handler
`db = event.target.result;`

* Create an object store
`db.createObjectStore('name_of_object_store', {autoIncrement: true});`

* Start a transaction on object store in db with `readwrite` permissions
`tx = db.transaction(['name_of_object_store'], 'readwrite');`

* Retrieve object store from tx
`tx.objectStore('name_of_object_store');`

* Add to object store 
`store.add(var_to_add);`

* Start a transaction on object store in db with `readonly` permissions
`db.transaction(['name_of_object_store'], 'readonly');`

* Get object from object store
`store.get(index);`