import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { REQUIRED_FIELDS, type ContactPayload } from "../helpers/types";
import { respond } from "../helpers/cors";
import { getGraphClient } from "../helpers/auth";
import { buildEmailPayload, sendMail } from "../helpers/email";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const origin = event.headers?.origin || event.headers?.Origin || "";

  if (event.httpMethod === "OPTIONS") {
    return respond(204, null, origin);
  }

  try {
    const body: ContactPayload = JSON.parse(event.body || "{}");

    const missing = REQUIRED_FIELDS.filter((f) => !body[f]?.trim());
    if (missing.length) {
      return respond(400, { error: `Missing fields: ${missing.join(", ")}` }, origin);
    }

    const client = await getGraphClient();
    const message = buildEmailPayload(body);
    await sendMail(client, message);

    return respond(200, { message: "Enquiry sent successfully" }, origin);
  } catch (err) {
    console.error("Contact form error:", err);
    return respond(500, { error: err instanceof Error ? err.message : "Unknown error" }, origin);
  }
};
