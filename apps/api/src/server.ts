import cors from "@fastify/cors";
import Fastify from "fastify";
import { rpc } from "@stellar/stellar-sdk";
import { allowedOrigins, apiEnv } from "./env.js";

export function buildServer() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== "production",
  });

  app.register(cors, {
    origin(origin, callback) {
      if (!origin || allowedOrigins().includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed"), false);
    },
  });

  app.get("/api/health", async () => ({
    status: "ok",
  }));

  app.get("/api/network", async () => {
    let rpcConfigured = Boolean(apiEnv.API_STELLAR_RPC_URL);

    try {
      const server = new rpc.Server(apiEnv.API_STELLAR_RPC_URL, {
        allowHttp: apiEnv.API_STELLAR_RPC_URL.startsWith("http://"),
        timeout: 5_000,
      });
      await server.getHealth();
    } catch {
      rpcConfigured = false;
    }

    return {
      network: "testnet",
      contractId: apiEnv.API_CONTRACT_ID,
      rpcConfigured,
    };
  });

  app.get("/api/counter", async () => ({
    total: 1284,
    source: apiEnv.API_CONTRACT_ID ? "stellar-testnet" : "demo",
  }));

  app.setErrorHandler((error, _request, reply) => {
    const statusCode = error instanceof Error && "statusCode" in error && typeof error.statusCode === "number" && error.statusCode >= 400
      ? error.statusCode
      : 500;
    const message = error instanceof Error ? error.message : "Request failed";

    reply.status(statusCode).send({
      error: {
        code: "api_error",
        message: statusCode >= 500 ? "The API could not complete the request." : message,
      },
    });
  });

  return app;
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  const app = buildServer();
  app.listen({ port: apiEnv.API_PORT, host: "127.0.0.1" }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
