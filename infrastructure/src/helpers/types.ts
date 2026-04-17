export const REQUIRED_FIELDS = ["name", "email", "projectType", "message"] as const;
export const SENDER = "info@zeropointgeo.co.za";
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const ALLOWED_ORIGINS = [
  "https://zeropointgeo.co.za",
  "https://www.zeropointgeo.co.za",
];

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  location?: string;
  message: string;
  fileName?: string;
  fileType?: string;
  fileBase64?: string;
}
