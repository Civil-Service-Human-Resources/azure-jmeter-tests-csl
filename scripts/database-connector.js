const util = require( 'util' );
const mysql = require( 'mysql' );

function connectMysql( config ) {
    const connection = mysql.createConnection( config);
    return {
        query( sql, values, cb ) {
            return util.promisify( connection.query ).call(connection, sql, values, cb );
        },
        close(options, cb) {
            return util.promisify( connection.end ).call( connection, options, cb);
        },
        connect(options, cb) {
            return util.promisify(connection.connect).call(connection, options, cb);
        }
    };
}

module.exports = {
    connectMysql
};
