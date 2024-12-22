import http from "http";

export const http_server = (_app_express: any) => {
    console.log(" +++++ http_server +++++ ")
    return http.createServer(_app_express);
}
