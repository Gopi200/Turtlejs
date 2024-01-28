// import {WebSocketServer} from "ws";
import * as http from "node:http";
import * as mysql from "mysql";
import { config } from "dotenv";
config();

if (process.env.api_use_sql == "true") {
    var mysqlConn = mysql.createConnection({
        host: process.env.api_sql_host,
        port: process.env.api_sql_port,
        user: process.env.api_sql_user,
        password: process.env.api_sql_password,
        database: process.env.api_sql_database
    });
    mysqlConn.connect((error) => {
        if (error) { throw error; }
        console.log("Connected to MySQL DB.");
    });
}

if (process.env.api_use_http == "true") {
    const httpAPI = http.createServer(async (req, res) => {
        console.log(`Requested at: ${req.url}`);

        // console.log(req.headers);

        var clientAuthorization = await authorizeClient(req.headers["authorization"]);

        // console.log(`With authorization ${interpreted_auth}`)

        if (clientAuthorization[0] != 200) {
            res.writeHead(clientAuthorization[0]);
            res.end();
            return;
        }

        /* 
        *  TODO { Review and possibly amend code }
        *  I don't know enough about how this compiles to say if this is the most efficient it can be.
        */
        switch (true) {
            case req.url == "/":
                res.writeHead(200);
                res.end();
                break;
            case req.url.match(/^\/turtles\/?(?=$)/i) != null:
                var turtles = await mysqlQuery(clientAuthorization[1], "turtles", ["TurtleName"]);
                console.log(turtles);
                res.writeHead(200)
                res.write(JSON.stringify(turtles), (error) => {
                    if (error) { console.log(error); }
                });
                res.end();
                break;
            default:
                // Matches for the first items in a url.
                var search = req.url.match(/(?<=^\/).+?(?=\/|$)/)[0];
                var turtles = await mysqlQuery(clientAuthorization[1], "turtles", ["TurtleName"]);
                var turtle = turtles.find((element) => { return element[0].toLowerCase() == search.toLowerCase()});
                if (turtle) {
                    switch (true) {
                        case req.url.match(/(?<=.\/)inventory(?!\/.)/i) != null:
                            res.writeHead(200);
                            var inventory = await mysqlQuery(clientAuthorization[1], "turtles", ["Inventory"]);
                            res.write(JSON.stringify(inventory[0]), (error) => {
                                if (error) { console.log(error); }
                            });
                            res.end();
                            break;
                        case req.url.match(/(?<=.\/)equipment(?!\/.)/i) != null:
                            res.writeHead(200);
                            var equipment = await mysqlQuery(clientAuthorization[1], "turtles", ["Equipment"]);
                            res.write(JSON.stringify(equipment[0]), (error) => {
                                if (error) { console.log(error); }
                            });
                            res.end();
                            break;
                        case req.url.match(/(?<=.\/)location(?!\/.)|(?<=.\/)coordinates(?!\/.)/i) != null:
                            res.writeHead(200);
                            var equipment = await mysqlQuery(clientAuthorization[1], "turtles", ["x", "y", "z"], {"TurtleName": turtle, "Status": "Waiting"});
                            res.write(JSON.stringify(equipment[0]), (error) => {
                                if (error) { console.log(error); }
                            });
                            res.end();
                            break;
                        default:
                            res.writeHead(200);
                            res.end();
                            break;
                    }
                }
                else {
                    res.writeHead(404, "Not found");
                    res.end();
                break;
                }
        }

    }).listen(process.env.api_http_port);

    console.log(`httpAPI is listening at 127.0.0.1:${process.env.api_http_port}`);
}



/**
 * TODO { Max characters, Proper encryption, }
 * Determines is the client is authorized
 * @param {*} auth The raw authorization used in the HTTP request.
 * @returns Returns an array with the statuscode, and the user if the authentication was succesful.
 */
async function authorizeClient(auth) {
    // Checks if authentication was supplied.
    if (auth) {
        // Checks what authentication was used and decodes the message.
        switch (true) {
            case auth.substring(0, 5) == "Basic":
                console.log(auth)
                var result = atob(auth.substring(6));
                break;
            default:
                console.log("400: Wrong authorization encoding given.");
                return [400];
        }
        var user = /^.+?(?=:)/.exec(result)[0];
        var apikey = /(?<=:).+?($|\s)/.exec(result)[0];
        var apikeyMatch = await mysqlQuery(user, "users", ["APIKey"]);
        
        if (apikey === apikeyMatch[0][0]) {
            console.log("200: Authorization successful.");
            return [200, user];
        }
    }
    console.log("401: Not authorized.");
    return [401];
}


/**
 * Queries items from MySQL server.
 * @param {string} user Which user is assigned to the queried items.
 * @param {string} table Which table the items you want to query live.
 * @param {Array} columns The columns you want to query items from.
 * @param {Object} condition The condition an row has to comply to for the given item.
 * @returns Returns an array inside an array, which represent row and column.
 */
function mysqlQuery(user, table, columns, condition = {}) {
    return new Promise((resolve) => {
        var select = "";
        for (let i = 0; i < columns.length; i++) {
            select += `${columns[i]},`;
        }
        var conditions = "";
        
        if (Object.keys(condition).length > 0) {
            for (let i = 0; i < Object.keys(condition).length; i++) {
                conditions += ` AND ${Object.keys(condition)[i]}="${Object.values(condition)[i]}"`;
            }
        }
        select = select.slice(0, -1);
        mysqlConn.query(`SELECT ${select} FROM ${table} WHERE UserName = "${user}"${conditions}`, (error, results) => {
            if (error) { console.log(error); return; }
            results = JSON.parse(JSON.stringify(results));
            var result = [];
            for (let row = 0; row < Object.keys(results).length; row++) {
                result[row] = [];
                for (let column = 0; column < columns.length; column++) {
                    result[row][column] = results[row][columns[column]];
                }
            }
            resolve(result);
        })
    })
}