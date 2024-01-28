import * as http from "node:http";

const requests = {"Authorize": true};

const url = new URL("http://localhost:8080/Fuckface0/Inventory")
const headers = Object({"auth": "Dewinz:s0UdFQljEkppoWzjpUQ4aTg3jkw9BguM4lqYiFLTJ4b15NiO52K8jEtMjSeKEqaOhfqZbVieeW0p2SkrKtmt3lfLfNeyrJXgTwyRUyJFuTjLucThuBDCJcLL3rfXMkxP"});

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
