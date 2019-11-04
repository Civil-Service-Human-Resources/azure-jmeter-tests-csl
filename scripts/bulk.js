
var config = require('./config.json');
const faker = require('faker');
const fs = require('fs');

var BULK_STATEMENTS_FILE = config["bulk_statements_file"];
var numDocuments = config["numBulkDocuments"];

var populdateJsonPaylode = () => {
    // fs.unlinkSync(BULK_STATEMENTS_FILE);
    var output = [];
    var count = 0;


    // var payload = { updateOne : {
    //     "filter" : { 
    //         "statement.verb.display.en-GB" : "experienced", 
    //         "statement.object.definition.type" : 1
    //     },
    //     "update" : { $set: {"statement.object.definition.type" : "http://cslearning.gov.uk/activities/elearning"} }
    // }};

    var payload = { updateOne : {
        "filter" : { 
            "statement.verb.display.en-GB" : "experienced", 
            "statement.object.definition.type" : 1
        },
        "update" : { $set: { "ttl": 5 } }
    }};

    // var payload = { "deleteOne" : {
    //     "filter" : {"purgeDocument" : 1}
    // }};

    for (i=0; i<numDocuments; i++){
        output.push(payload);
        count++;
    }

    fs.writeFileSync(BULK_STATEMENTS_FILE, JSON.stringify(output, null, 4));
    console.log("created " + count + " documents");
}

populdateJsonPaylode();
