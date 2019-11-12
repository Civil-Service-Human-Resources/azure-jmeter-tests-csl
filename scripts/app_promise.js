const mysqlP = require('mysql-promise');
const uuidv1 = require('uuid/v1');

async function createNewIdentityRole (uniqueId, con) {

    const newIdentityRole = {
        identity_id: uniqueId,
        role_id: 1
    };
    await con.query('INSERT INTO identity.identity_role SET ?', newIdentityRole, (err,rows) => {
        if(err) throw err;
    });
}

// csrs.civil_servant
async function createNewCsrsCivilServant (identityId, mail, con) {
    const newCivilServantIdentity = {
        identity_id: identityId,
        organisational_unit_id: 1,
        grade_id: 4,
        profession_id: 22,
        full_name: mail
    };

    await con.query('INSERT INTO csrs.civil_servant SET ?', newCivilServantIdentity, (err,rows) => {
        if(err) throw err;
    });
}

// csrs.civil_servant_interests
async function createNewCsrsCivilServantInterest (identityId, con) {
    const newCivilServantInterests = {
        civil_servant_id: identityId,
        interests_id: 1
    };

    await con.query('INSERT INTO csrs.civil_servant_interests SET ?', newCivilServantInterests, (err,rows) => {
        if(err) throw err;
    });
}

// csrs.civil_servant_other_areas_of_work
async function createNewCsrsCivilServantOtherAreasOfWork (identityId, con) {
    const newCivilServantOtherAreasOfWork = {
        civil_servant_id: identityId,
        other_areas_of_work_id: 1
    };

    await con.query('INSERT INTO csrs.civil_servant_other_areas_of_work SET ?', newCivilServantOtherAreasOfWork, (err,rows) => {
        if(err) throw err;
    });
    createNewCsrsCivilServantInterest(identityId, con);
}

async function createCsrsData (uuid, email, con){
    const newCsrsIdentity = {
        uid: uuid
    };
    await con.query('INSERT INTO csrs.identity SET ?', newCsrsIdentity, (err,rows) => {
        if(err) throw err;

    });
    var csrsIdentity = await con.query('SELECT id FROM csrs.identity WHERE uid = ?', uuid, (err,rows) => {
        if(err) throw err;

    });

    createNewCsrsCivilServant(csrsIdentity[0].id, email, con);
    createNewCsrsCivilServantOtherAreasOfWork(csrsIdentity[0].id, email, con);

    console.log('a new CSRS identity created for: %s', email);
}

async function createIdentityData (identityDto, con) {

    await con.query('INSERT INTO identity.identity SET ?', identityDto, async (err, results, fields)=>{
        if(err) throw err;
    });
    const newIdentity = await con.query('SELECT id FROM identity.identity WHERE uid = ?', identityUUID, (err,rows) => {
        if (err) throw err;
    });
    var identity_id = newIdentity[0].id;
    createNewIdentityRole(identity_id, con);
    createCsrsData(identityUUID, identityDto.email, con);

    console.log('new identity created uuid: %s', identityDto.uid);
}

async function createUsers(numUsers, connection) {
    for (i = 1; i <= numUsers; i++) {
        // identity.identity
        const domain = "example.com"
        const uuid = uuidv1();
        const mail = "user" + i + "@" + domain;
        const _password = "$2a$10$sGfnyPnJ8a0b9R.vqIphKu5vjetS3.Bvi6ISv39bOphq5On0U2m36";
        const logged_in = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        const newIdentity = {
            active: true,
            locked: false,
            uid: uuid,
            email: mail,
            password: _password,
            last_logged_in: logged_in
        };
        createIdentityData(newIdentity, connection);
    }
}

var calculateElapsedTime = (startTime)=> {
    endTime = Date.now();
    return Math.round( (endTime- startTime)/1000); //in sec
}

async function loadIdentityAndCSRSData(num){
    const con = await mysqlP.createConnection({
        host: 'localhost',
        user: 'changeme',
        password: 'changeme',
        ssl: {
            rejectUnauthorized: false
        }
    });

    var startTime = Date.now();
    createUsers(num, con);
    con.end();
    console.log('Time elapsed: %s s',calculateElapsedTime(startTime));
}

loadIdentityAndCSRSData(2);
