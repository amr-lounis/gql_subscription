import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from 'ws'
import { MyToken } from "./token_controller";
import { PubSub } from "graphql-subscriptions";

// -------------------------------------------------- PubSub
class Models {
    private static instance = new PubSub()
    public static getInstance = () => Models.instance;
}
export const pubsub = Models.getInstance();

// -------------------------------------------------- ws_server
export const ws_server = (_server: any, _schema: any) => {
    const wsServer = new WebSocketServer({
        server: _server,

    });
    return useServer({
        schema: _schema,
        context: (ctx, msg, args) => {
            const headerToken = ctx?.connectionParams?.token || ''
            return { jwt: MyToken.Token_Verifay(headerToken) };
        },
        onConnect: async (ctx) => {
            const headerToken = ctx?.connectionParams?.token || ''
            const jwt = MyToken.Token_Verifay(headerToken);

            if (jwt.id == null) {// return false to server disconnect ro throw new Error('')
                return false;
            }
        },
        onDisconnect(ctx, code, reason) { },
    }
        , wsServer);
}