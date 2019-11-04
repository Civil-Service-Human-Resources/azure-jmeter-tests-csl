
var config = require('./config.json');
const faker = require('faker');
const fs = require('fs');

const JSON_DATA_FILE = config["json_data_file"];
const NUM_DOCUMENTS = config["numDocuments"];

const SPLIT_RATIO = 0.75;
const experiencedStatementBucket = NUM_DOCUMENTS * SPLIT_RATIO;

console.log("experience statements: " + experiencedStatementBucket);

var populdateJsonPaylode = () => {
    // fs.unlinkSync(JSON_DATA_FILE);
    faker.seed(98765);

    var output = [];
    var count = 0;
    var addTtl = false;

    for (i=0; i< NUM_DOCUMENTS; i++){
        count++;
        var statement = {};

        var display = {
            "display": {
                "en-GB": ""
            }
        };

        var definition = {
            "definition": {
                "type": ""
            }
        };

        // statement.actor.account.name
        var actor = {
            "account": {
                "name": ""
            }
        }

        // var random_ = Math.random() >= 0.5;
        var random_ = true;

        if ( count > experiencedStatementBucket ){
            random_ = false;
        }

        var payload = {}
        payload["firstName"] = faker.name.findName();
        payload["lastName"] = faker.name.findName();
        payload["email"] = faker.internet.email();
        payload["phone"] = faker.phone.phoneNumber();

        display["display"]["en-GB"] = faker.internet.url();
        definition["definition"]["type"] = faker.internet.url();
        ac["definition"]["type"] = faker.internet.url();

        if (random_){
            display["display"]["en-GB"] = "experienced";
            // definition["definition"]["type"] = faker.internet.url() + "/elearning";
            definition["definition"]["type"] = "http://cslearning.gov.uk/activities/elearning"
        }else{
            display["display"]["en-GB"] = faker.internet.url();
            definition["definition"]["type"] = faker.internet.url();
        }

        statement["verb"] = display;
        statement["object"] = definition;
        payload["statement"] = statement;

        payload["ip"] = faker.internet.ip();
        payload["avatar"] = faker.internet.avatar();
        payload["avatar"] = faker.lorem.sentence();
    
        if (addTtl) payload["ttl"] = 10;
        // console.log(JSON.stringify(payload));
        output.push(payload);
    }

    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(output, null, 4));
    console.log("created " + count + " documents");
}

populdateJsonPaylode();
