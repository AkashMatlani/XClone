import arcjet, {
  tokenBucket,
  shield,
  detectBot,
} from "@arcjet/node";
import { ENV } from "./env.js";

//initialize Arcjet with security rules

export default arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    //shiled protects your app from common attacks e.g SQL injections,xss,CSRF attacks

    shield({ mode: "LIVE" }),

    //bot detection -block all bots except search engines

    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        //allow legitimate search engine bots
      ],
    }),
    //rate limiting wit token bucket alogorithim

    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 10,
      capacity: 15,
    }),
  ],
});
