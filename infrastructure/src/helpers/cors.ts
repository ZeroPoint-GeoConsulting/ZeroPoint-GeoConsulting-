import type { APIGatewayProxyResult } from "aws-lambda";
import { ALLOWED_ORIGINS } from "./types.js";

export const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
});

export const respond = (statusCode: number, body: unknown, origin: string): APIGatewayProxyResult => ({
  statusCode,
  headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  body: JSON.stringify(body),
});
