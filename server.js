var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var mm = require('mongodb-migrations');
var ObjectID = mongodb.ObjectID;

var ENTRIES_COLLECTION = "entries";

var mmConfig = {
	host: process.env.MONGODB_HOST,
	port: process.env.MONGODB_PORT,
	db: process.env.MONGODB_DB,
	user: process.env.MONGODB_USER,
	password: process.env.MONGODB_PASS,
	collection: ENTRIES_COLLECTION,
	poolSize: 5
}

var mmDir = 'migrations';

var app = express();
var migrator = new mm.Migrator(mmConfig);

migrator.runFromDir(mmDir, function (err, result) {
	if (err) {
		console.error(err, result);
		process.exit(1);
		return;
	}

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

		// Update the schema
		console.log("Updating schemas");
		db.collection(ENTRIES_COLLECTION).find({
			firstName: {
				$exists: false
			}
		}).forEach(
			function (doc) {
				// Add new fields
				doc.firstName = doc.fullName || "";
				doc.lastName = "";

				// Save the updated document
				db.collection(ENTRIES_COLLECTION).save(doc);
			}
		);

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

		if (!req.body.firstName || !req.body.lastName) {
			handleError(res, "Invalid user input", "Missing required body property", 400);
		}

		db.collection(ENTRIES_COLLECTION).insertOne(newEntry, function (err, doc) {
			if (err) {
				handleError(res, err.message, "Failed to create new entry.");
			} else {
				res.status(201).json(doc.ops[0]);
			}
		});
	});
});
