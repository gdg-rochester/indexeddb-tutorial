let db;                                             // Initialize a variable 
let dbReq = indexedDB.open('myDatabase', 1);        // Open version '1' of our db 'myDatabase'

// Imp - It doens't retun a db, 
// instead it returns a `request` for a db,
// because IndexedDB is asynchronous API.
// This request object has `onupgradeneeded`,
// `onsuccess` or `onerror` etc...
// that we handle as events.
console.log(dbReq);

dbReq.onupgradeneeded = function(event) {
  console.log("This is the event that brought us in here \n"+ event);

	// Set the DB variable to our database
	// So we can use it !
	db = event.target.result;
	console.log("This is how our db looks now \n"+db);

	// Create an object store named notes. 
	// Object stores in databases are where data are stored 
  // Anaglogous to Tables in SQL or Documents in MongoDB
	let notes = db.createObjectStore('notes', {autoIncrement: true});
}

dbReq.onsuccess = function(event) {
  console.log(event);
	db = event.target.result;
  /**
  * Level 2 
  * Add some sticky notes
  * Get rid of it level 3
  **/
	// addStickyNote(db, 'Follow GDG Rochester on Twitter');
	// addStickyNote(db, 'Pizza was great.');
	// addStickyNote(db, 'Chrome Summit on November 11,12 ');
}

dbReq.onerror = function(event) {
	alert('error opening database '+ event.target.errorCode);
}

function addStickyNote(db, message) {
  	// Start a database transaction and get the notes object store
    // We start a transaction on our database to write data to our notes object store
  	let tx = db.transaction(['notes'], 'readwrite');

    // Then we retrieve that object store from the transaction.
  	let store = tx.objectStore('notes');

  	// Put the sticky note into the object store
  	let note = {text: message, timestamp: Date.now()};
  	store.add(note);

  	// Wait for the database transaction to complete
  	tx.oncomplete = function() { console.log('stored note!') }
  	tx.onerror = function(event) {
    		alert('error storing note ' + event.target.errorCode);
  	}
}

/** 
* Level 3
**/
// Just like requests have onsuccess and onerror event handlers, 
// transactions have oncomplete, onerror, and onabort event handlers, 
// we can use for responding to a transaction completing, erroring, or being rolled back.

function retrieveStickyNote(db) {
  // Set up an object store and transaction
  let tx = db.transaction(['notes'], 'readonly');
  let store = tx.objectStore('notes');

  // Set up a request to get the sticky note with the key 1
  let req = store.get(7);

  // We can use the note if the request succeeds, getting it in the
  // onsuccess handler
  req.onsuccess = function(event) {
    let note = event.target.result;
    // console.log("onsuccess fired");
    if (note) {
      console.log(note);
    } else {
      console.log("note 1 not found")
    }
  }

  // If we get an error, like that the note wasn't in the object
  // store, we handle the error in the onerror handler
  req.onerror = function(event) {
    alert('error getting note 1 ' + event.target.errorCode);
  }

  // Note that if the sticky note does not exist, 
  // onsuccess still fires, but event.target.result will be undefined.
}





// The IDBCursor interface of the IndexedDB API represents a cursor 
// for traversing or iterating over multiple records in a database.

function getAndDisplayNotes(db) {
  let tx = db.transaction(['notes'], 'readonly');
  let store = tx.objectStore('notes');

  // Create a cursor request to get all items in the store, which 
  // we collect in the allNotes array
  let req = store.openCursor();
  let allNotes = [];

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;
    if (cursor != null) {
      // If the cursor isn't null, we got an IndexedDB item.
      // Add it to the note array and have the cursor continue!
      allNotes.push(cursor.value);
      cursor.continue();
    } else {
      // If we have a null cursor, it means we've gotten
      // all the items in the store, so display the notes we got
      console.log(allNotes);
    }
  }
  req.onerror = function(event) {
    alert('error in cursor request ' + event.target.errorCode);
  }
}



/**
* Level 3
* Add UI
**/
function submitNote() {
  let message = document.getElementById('newmessage');
  addStickyNote(db, message.value);
  message.value = '';
}

function retrieveNote() {
  retrieveStickyNote(db)
}

function getAllNotes() {
  getAndDisplayNotes(db)
}