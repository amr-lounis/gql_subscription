import https from "https";
import fs from "fs"

export const https_server = (_app_express: any, _path_cert: string, _path_key: string) => {
    console.log(" +++++ https_server +++++ ")
    const serverOptions = {
        cert: fs.readFileSync(_path_cert),
        key: fs.readFileSync(_path_key)
    }
    return https.createServer(serverOptions, _app_express);
}