const util = require( 'util' );
const mysql = require( 'mysql' );

function connectMysql( config ) {
    const connection = mysql.createConnection( config);
    console.log('connected to MySQL ....');
    return {
        query: util.promisify(connection.query).bind(connection),
        close: util.promisify(connection.end).bind(connection),
		connect: util.promisify(connection.connect).bind(connection),
		commit: util.promisify(connection.commit).bind(connection)
    };
}

module.exports = {
    connectMysql
};
