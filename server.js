var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var ENTRIES_COLLECTION = "entries";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	// Save database object from the callback for reuse.
	db = database;
	console.log("Database connection ready");

	// Initialize the app.
	var server = app.listen(process.env.PORT || 8080, function () {
		var port = server.address().port;
		console.log("App now running on port", port);
	});
});

// ENTRIES API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
	console.log("ERROR: " + reason);
	res.status(code || 500).json({
		"error": message
	});
}

/*  "/entries"
 *    GET: finds all entries
 *    POST: creates a new entry
 */

app.get("/entries", function (req, res) {
	db.collection(ENTRIES_COLLECTION).find({}).toArray(function (err, docs) {
		if (err) {
			handleError(res, err.message, "Failed to get entries.");
		} else {
			res.status(200).json(docs);
		}
	});
});

app.post("/entries", function (req, res) {
	var newEntry = req.body;
	newEntry.createDate = new Date();

	if (!req.body.fullName) {
		handleError(res, "Invalid user input", "Must provide a name.", 400);
	}

	db.collection(ENTRIES_COLLECTION).insertOne(newEntry, function (err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to create new entry.");
		} else {
			res.status(201).json(doc.ops[0]);
		}
	});
});
