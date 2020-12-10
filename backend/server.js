/*--------------------------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
 *-------------------------------------------------------------------------------------------------------------*/

'use strict';

require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

(async function() {
	// Use connect to mongo server
	console.log(process.env.MONGO_URL);
	const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true });
	await client.connect();
	console.log('Connected successfully to Mongo DB');
	const db = client.db(process.env.DB_NAME);
	const testHitsCollection = db.collection('test-hits');

	// App
	const app = express();
	app.get('/', async (req, res) => {
		await testHitsCollection.insertOne({ date: new Date() });
		const count = await testHitsCollection.countDocuments();
		res.send('Hello remote world! ' + count + ' test record(s) found.');
	});

	app.listen(process.env.PORT, process.env.HOST);
	console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);

	// Used for automated testing
	if(process.env.REGRESSION_TESTING === 'true') { process.exit(0); }
})();