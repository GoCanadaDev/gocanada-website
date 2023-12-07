import { getEnv } from "./env.server";

export { handleRequest as default } from "@netlify/remix-adapter";

// put ENV on the global namespace so it's available in any server code
global.ENV = getEnv()