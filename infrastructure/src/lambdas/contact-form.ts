import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { respond } from "../helpers/cors";
import { ContactPayload, REQUIRED_FIELDS } from "../helpers/types";
import { getAccessToken } from "../helpers/auth";
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

    const token = await getAccessToken();
    const payload = buildEmailPayload(body);
    await sendMail(token, payload);

    return respond(200, { message: "Enquiry sent successfully" }, origin);
  } catch (err) {
    return respond(500, { error: "Failed to send enquiry. Please try again." }, origin);
  }
};
