const mysql = require('mysql');
const moment = require('moment');
const uuidv1 = require('uuid/v1');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pa55w0rd'
});

// truncate tables
var truncateTables = () => {
    const tablesNames = [
        'TRUNCATE TABLE identity.identity',
        'TRUNCATE TABLE identity.identity_role',
        'TRUNCATE TABLE csrs.identity',
        'TRUNCATE TABLE csrs.civil_servant',
        'TRUNCATE TABLE csrs.civil_servant_other_areas_of_work',
        'TRUNCATE TABLE csrs.civil_servant_interests'
    ];

    tablesNames.forEach(statement => {
        con.query(statement, (err,rows) => {
            if(err) throw err;
            console.log("table " + statement + " has been truncated");
        });
    })
}

// identity.identity_role
var createNewIdentityRole = (uniqueId) => {

    const newIdentityRole = { 
        identity_id: uniqueId,
        role_id: 1
    };
    con.query('INSERT INTO identity.identity_role SET ?', newIdentityRole, (err,rows) => {
        if(err) throw err;
    });
}

// csrs.civil_servant
var createNewCsrsCivilServant = (identityId, mail) => {
    const newCivilServantIdentity = { 
        identity_id: identityId, 
        organisational_unit_id: 1, 
        grade_id: 4, 
        profession_id: 22, 
        full_name: mail
    };
    
    con.query('INSERT INTO csrs.civil_servant SET ?', newCivilServantIdentity, (err,rows) => {
        if(err) throw err;
    });
}

// csrs.civil_servant_interests
var createNewCsrsCivilServantInterest = (identityId, mail) => {
    const newCivilServantInterests = { 
        civil_servant_id: identityId, 
        interests_id: 1
    };
    
    con.query('INSERT INTO csrs.civil_servant_interests SET ?', newCivilServantInterests, (err,rows) => {
        if(err) throw err;
        console.log("created user " + mail);
    });
}

// csrs.civil_servant_other_areas_of_work
var createNewCsrsCivilServantOtherAreasOfWork = (identityId, mail) => {
    const newCivilServantOtherAreasOfWork = { 
        civil_servant_id: identityId, 
        other_areas_of_work_id: 1
    };
    
    con.query('INSERT INTO csrs.civil_servant_other_areas_of_work SET ?', newCivilServantOtherAreasOfWork, (err,rows) => {
        if(err) throw err;
        createNewCsrsCivilServantInterest(identityId, mail);
    });
}

// csrs.identity
var createNewCsrsIdentity = (uuid, mail) => {
    const newCsrsIdentity = { 
        uid: uuid
    };
    
    con.query('INSERT INTO csrs.identity SET ?', newCsrsIdentity, (err,rows) => {
        if(err) throw err;
        con.query('SELECT id FROM csrs.identity WHERE uid = ?', uuid, (err,rows) => {
            if(err) throw err;
            createNewCsrsCivilServant(rows[0].id, mail);
            createNewCsrsCivilServantOtherAreasOfWork(rows[0].id, mail);
        });
    });
}

// close DB connection
var closeConnection = () => {
    con.end((err) => {
        console.log("The connection is terminated gracefully");
    });
}

// create users
var createUsers = (numUsers) =>{
    for(i=1; i<=numUsers; i++){

        // identity.identity
        const domain = "example.com"
        const uuid = uuidv1();
        const mail = "user" + i+ "@" + domain;
        const password = "$2a$10$sGfnyPnJ8a0b9R.vqIphKu5vjetS3.Bvi6ISv39bOphq5On0U2m36";
        const logged_in = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    
        const newIdentity = { 
            active: true ,
            locked: false,
            uid: uuid,
            email: mail,
            password ,
            last_logged_in: logged_in
        };
        
        con.query('INSERT INTO identity.identity SET ?', newIdentity, (err,rows) => {
            if(err) throw err;
            // console.log(rows);
        });
        
        con.query('SELECT id FROM identity.identity WHERE uid = ?', uuid, (err,rows) => {
            if(err) throw err;
            createNewIdentityRole(rows[0].id);
            createNewCsrsIdentity(uuid, mail);
        });
    }
}

con.connect((err) => {
    if(err){
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
    truncateTables();
    createUsers(3000);
});

