// import {WebSocketServer} from "ws";
import * as http from "node:http";
import * as mysql from "mysql";

const useHttpAPI = true;
const httpURL = "";
const httpPORT = 0;

const useMysql = true;
const mysqlURL = "";
const mysqlPORT = 0;


if (useMysql) {
    var mysqlConn = mysql.createConnection({
        host: mysqlURL,
        port: mysqlPORT,
        user: "",
        password: "",
        database: ""
    });
    mysqlConn.connect((error) => {
        if (error) { throw error; }
        console.log("Connected to MySQL DB.");
    });
}

if (useHttpAPI) {
    if (typeof httpPORT != "number") {
        throw new Error("httpPORT is not defined or not a number!");
    }
    const httpAPI = http.createServer(async (req, res) => {
        console.log(`Requested at: ${req.url}`);

        // console.log(req.headers);

        var clientAuthorization = await authorizeClient(req.headers["authorization"]);

        // console.log(`With authorization ${interpreted_auth}`)

        if (clientAuthorization != 200) {
            res.writeHead(clientAuthorization);
            res.end();
            return;
        }

        switch (req.url) {
            case "/":
                res.writeHead(200);
                res.end();
                break;
            case "/turtles":
                var turtles = await mysqlQuery("Dewinz", "turtles", "TurtleName");
                console.log(turtles);
                res.writeHead(200)
                res.write(JSON.stringify(turtles), (error) => {
                    if (error) { console.log(error); }
                });
                res.end();
                break;
            default:
                res.writeHead(404, "Not found");
                res.end();
                break;
        }

    }).listen(httpPORT);

    console.log(`httpAPI is listening at 127.0.0.1:${httpPORT}`);
}

/**
 * TODO { Max characters, Proper encryption, Global user(returns the authorized user) }
 * Determines is the client is authorized
 * @param {*} auth The raw authorization used in the HTTP request.
 * @returns Returns given StatusCode.
 */
async function authorizeClient(auth) {
    // Checks if authentication was supplied.
    if (auth) {
        // Checks what authentication was used and decodes the message.
        switch (true) {
            case auth.substring(0, 5) == "Basic":
                var result = atob(auth.substring(6));
                break;
            default:
                console.log("400: Wrong authorization encoding given.");
                return 400;
        }
        // Verifies if the user exists.
        var user = /^.+?(?=:)/.exec(result)[0];
        var password = /(?<=:).+?($|\s)/.exec(result)[0];
        var passwordMatch = await mysqlQuery(user, "users", "Password");
        
        if (password === passwordMatch[0]) {
            console.log("200: Authorization successful.");
            return 200;
        }
    }
    console.log("401: Not authorized.");
    return 401;
}


/**
 * TODO { Multiple column support }
 * Queries items from MySQL server.
 * @param {string} user Which user is assigned to the queried items.
 * @param {string} table Which table the items you want to query live.
 * @param {string} column The items you want to query.
 * @returns Returns a list of the queried items.
 */
function mysqlQuery(user, table, column) {
    return new Promise((resolve) => {
        mysqlConn.query(`SELECT ${column} FROM ${table} WHERE UserName = "${user}"`, (error, results) => {
            if (error) { console.log(error); return; }
            results = JSON.parse(JSON.stringify(results));
            for (let i = 0; i < Object.keys(results).length; i++) {
                results[i] = results[i][column];
            }
            resolve(results);
        })
    })
}