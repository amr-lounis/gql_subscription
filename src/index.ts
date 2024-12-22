import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { applyMiddleware } from 'graphql-middleware'
import { makeSchema } from 'nexus';
import * as types_gql from './gql';
import { myConfig } from './config';
import { MyToken, https_server, myMiddleware, ws_server, http_server } from './utils';
// --------------------------------------------------
const main = async () => {
  // -----------------------
  const schema = makeSchema({
    types: types_gql,
  });
  // -----------------------
  const app = express();
  //
  const schemaWithMiddleware = applyMiddleware(schema, myMiddleware)
  // ----------------------- https or http
  const server = myConfig.SERVER_SSL ? https_server(app, myConfig.path_ssl_crt, myConfig.path_ssl_key) : http_server(app);
  // ----------------------- ws
  const serverCleanup = ws_server(server, schema)
  // ----------------------- ApolloServer
  const apolloServer = new ApolloServer({
    schema: schemaWithMiddleware,
    csrfPrevention: false,
    formatError(err) {
      return new Error(err.message);
    },
    context: (ctx) => {
      const headerToken = ctx?.req?.headers?.token || '';
      return { jwt: MyToken.Token_Verifay(headerToken) };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer: server }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: myConfig.graphql_url })
  // ------------------------------------------------ listen
  if (myConfig.SERVER_SSL) {
    server.listen(myConfig.PORT_HTTPS, () => {
      console.log(`https://localhost:${myConfig.PORT_HTTPS}/${myConfig.graphql_url}`);
    });
  } else {
    server.listen(myConfig.PORT_HTTP, () => {
      console.log(`http://localhost:${myConfig.PORT_HTTP}/${myConfig.graphql_url}`);
    });
  }
};
// --------------------------------------------------
main()
// --------------------------------------------------