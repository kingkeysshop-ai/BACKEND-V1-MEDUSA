import { defineMiddlewares } from "@medusajs/framework/http"
import { raw } from "body-parser"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/aurpay/webhook",
      method: ["POST"],
      bodyParser: false,
      middlewares: [
        raw({ type: "application/json" }),
      ],
    },
  ],
})