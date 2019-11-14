const mysql = require('mysql');
const moment = require('moment');
const uuidv1 = require('uuid/v1');
const dbConnector = require('./database-connector')

const con = dbConnector.connectMysql({
    host: 'localhost',
    user: 'changeme',
    password: 'changeme',
    ssl: {
        rejectUnauthorized: false
    }
});

// truncate tables
async function cleanUp () {
    const truncateStatements = [
        'TRUNCATE TABLE identity.identity',
        'TRUNCATE TABLE identity.identity_role',
        'TRUNCATE TABLE csrs.identity',
        'TRUNCATE TABLE csrs.civil_servant',
        'TRUNCATE TABLE csrs.civil_servant_other_areas_of_work',
        'TRUNCATE TABLE csrs.civil_servant_interests'
    ];

    const deleteStatements = [
        'delete from csrs.civil_servant_interests  where civil_servant_id >1',
        'delete from csrs.civil_servant_other_areas_of_work  where civil_servant_id >1',
        'delete from csrs.identity  where id >1',
        'delete from csrs.civil_servant  where full_name like "user%@example.com"',
        'delete from identity.identity_role where identity_id > 1',
        'delete from identity.identity where email like "user%@example.com"'
    ];

    for (var i=0; i<deleteStatements.length; i++){
        await con.query(deleteStatements[i]);
    }
}

// identity.identity_role
async function createNewIdentityRole (uniqueId) {

    const newIdentityRole = {
        identity_id: uniqueId,
        role_id: 1
    };

    try {
        await con.query('INSERT INTO identity.identity_role SET ?', newIdentityRole);
    }catch (err) {
        _logAndThrow(err);
    }
}

function _logAndThrow(error){
    console.log(error);
    throw error;
}
// csrs.civil_servant
async function createNewCsrsCivilServant (identityId, mail) {
    const newCivilServantIdentity = {
        identity_id: identityId,
        organisational_unit_id: 1,
        grade_id: 4,
        profession_id: 22,
        full_name: mail
    };

    try {
        await con.query('INSERT INTO csrs.civil_servant SET ?', newCivilServantIdentity);
    } catch (err) {
       _logAndThrow(err);
    }
}

// csrs.civil_servant_interests
async function createNewCsrsCivilServantInterest (identityId) {
    const newCivilServantInterests = {
        civil_servant_id: identityId,
        interests_id: 1
    };

    try{
        await con.query('INSERT INTO csrs.civil_servant_interests SET ?', newCivilServantInterests);
    }catch(e) {
        _logAndThrow(e);
    }
}

// csrs.civil_servant_other_areas_of_work
async function createNewCsrsCivilServantOtherAreasOfWork (identityId) {
    const newCivilServantOtherAreasOfWork = {
        civil_servant_id: identityId,
        other_areas_of_work_id: 1
    };

    try {
        await con.query('INSERT INTO csrs.civil_servant_other_areas_of_work SET ?', newCivilServantOtherAreasOfWork);
        createNewCsrsCivilServantInterest(identityId);
    } catch (err) {
        _logAndThrow(err);
    }
}

async function createIdentityData (identityDto) {
    try {
        const result = await con.query('INSERT INTO identity.identity SET ?', identityDto);
        var identityUUID = identityDto.uid;
        const resultSelect = await con.query('SELECT id FROM identity.identity WHERE uid = ?', identityUUID);
        const identity_id = resultSelect[0].id
        await createNewIdentityRole(identity_id);
        await createCsrsData(identityUUID, identityDto.email);
    }catch (e){
        _logAndThrow(e);
    }
    console.log('new identity created uuid: %s', identityDto.uid);
}

async function createCsrsData (uuid, email){
    const newCsrsIdentity = {
        uid: uuid
    };

    try {
        await con.query('INSERT INTO csrs.identity SET ?', newCsrsIdentity);
        var selectResult = await con.query('SELECT id FROM csrs.identity WHERE uid = ?', uuid);
        createNewCsrsCivilServant(selectResult[0].id, email);
        createNewCsrsCivilServantOtherAreasOfWork(selectResult[0].id, email);
        console.log('a new CSRS identity created for: %s', email);
    } catch(e) {
        _logAndThrow(e);
    }
}

// create users
async function createUsers (numUsers) {
    for(i=1; i<=numUsers; i++){
        // identity.identity
        const domain = "example.com"
        const uuid = uuidv1();
        const mail = "user" + i+ "@" + domain;
        const _password = "$2a$10$sGfnyPnJ8a0b9R.vqIphKu5vjetS3.Bvi6ISv39bOphq5On0U2m36";
        const logged_in = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        const newIdentity = {
            active: true ,
            locked: false,
            uid: uuid,
            email: mail,
            password: _password,
            last_logged_in: logged_in
        };
       await createIdentityData(newIdentity);
    }
}

var calculateElapsedTime = (startTime)=> {
    var endTime = Date.now();
    return Math.round( (endTime- startTime)/1000); //in sec
};

var main = async () => {
    var startTime = 0;
    try {
        startTime = Date.now();
        await cleanUp();
        await createUsers(2);
    } catch (err) {
        console.log('# Error %s',err.toString());
    } finally {
        await con.close();
        console.log('Time elapsed: %s s',calculateElapsedTime(startTime));
    }
};

main();

