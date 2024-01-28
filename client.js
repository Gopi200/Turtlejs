import * as http from "node:http";

const requests = {"Authorize": true};

const url = new URL("http://localhost:8080/turtles")
const headers = Object({"auth": "Dewinz:P@ssw0rd"});

if (requests["Authorize"]) {
    http.get(url, headers, (res) => {
        console.log(res.statusCode);

        let rawData = "";
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            if (rawData == "") { return; }
            try {
                const parsedData = JSON.parse(rawData);
                console.log(parsedData);
            }
            catch (error) {
                console.log (error);
            }
        });
    }).on('error', (error) => {
        console.log(error);
    });
}
