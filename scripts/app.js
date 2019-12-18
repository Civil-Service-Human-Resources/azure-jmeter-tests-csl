const moment = require('moment');
const uuidv1 = require('uuid/v1');
const dbConnector = require('./database-connector')

const con = dbConnector.connectMysql({
    host: process.env.DB_HOST || 'host',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASS || 'pass',
    ssl: {
        rejectUnauthorized: false
    }
});

const USERS_TO_LOAD = parseInt(process.env.USERS_TO_LOAD || '10' ,10);
const PAGE = parseInt(process.env.PAGE || '0' ,10);
const SHOULD_TRUNCATE = (process.env.SHOULD_TRUNCATE || 'true') === 'true';
const SHOULD_CREATE_CSRS = (process.env.SHOULD_CREATE_CSRS || 'true') === 'true';
const IDENTITY_ROLE = parseInt(process.env.ID_ROLE || '1', 10);

// truncate tables
async function cleanUp () {
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

	await con.commit()
}

// identity.identity_role
async function createNewIdentityRole (uniqueId) {

    const newIdentityRole = {
        identity_id: uniqueId,
        role_id: IDENTITY_ROLE
    };

    try {
		await con.query('INSERT INTO identity.identity_role SET ?', newIdentityRole);
	} catch (err) {
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
		var selectResult = await con.query('SELECT id FROM csrs.civil_servant WHERE identity_id = ?', identityId);
		return selectResult[0].id
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
	} catch(e) {
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

async function createIdentityData (identityDto, commitAfter) {
    try {
		await con.query('INSERT INTO identity.identity SET ?', identityDto);
        var identityUUID = identityDto.uid;
        const resultSelect = await con.query('SELECT id FROM identity.identity WHERE uid = ?', identityUUID);
        const identity_id = resultSelect[0].id
        await createNewIdentityRole(identity_id);
        if (SHOULD_CREATE_CSRS) {
		    await createCsrsData(identityUUID, identityDto.email);
        }
		if (commitAfter) {
			await con.commit();
		}
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
		const civilServantId = await createNewCsrsCivilServant(selectResult[0].id, email);
		createNewCsrsCivilServantOtherAreasOfWork(civilServantId, email);
        console.log('a new CSRS identity created for: %s', email);
    } catch(e) {
        _logAndThrow(e);
    }
}

// create users
async function createUsers (numUsers) {
    for(i=1; i<=numUsers; i++){
        const uuid = uuidv1();
        const mail = getUserEmail(i)
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
       await createIdentityData(newIdentity, shouldCommit(i));
    }
}

function getUserEmail(i) {
	const domain = "example.com"
	const id = i + (PAGE * USERS_TO_LOAD)
	return "user" + id + "@" + domain;
}
function shouldCommit(i) {
	return i%100 === 0;
}

var calculateElapsedTime = (startTime)=> {
    var endTime = Date.now();
    return Math.round( (endTime- startTime)/1000); //in sec
};

var main = async () => {
    var startTime = 0;
    try {
		startTime = Date.now();
		if (SHOULD_TRUNCATE) {
			console.log('cleanUp started');
			await cleanUp();
			console.log('cleanUp finished');
		}
        await createUsers(USERS_TO_LOAD);
    } catch (err) {
        console.log('# Error %s',err.toString());
    } finally {
		console.log('# Finishing off');
        await con.close().catch((e) => {
			console.log(e)
		});
        console.log('Time elapsed: %s s',calculateElapsedTime(startTime));
    }
};

main();

