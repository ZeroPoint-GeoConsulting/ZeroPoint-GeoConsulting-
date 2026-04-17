import { SENDER, MAX_ATTACHMENT_BYTES, type ContactPayload } from "./types.js";

export function buildEmailPayload(body: ContactPayload) {
  const message: Record<string, unknown> = {
    subject: `New Enquiry: ${body.projectType} — ${body.name}`,
    body: {
      contentType: "HTML",
      content: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${body.name}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${body.email}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;">${body.phone || "—"}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Company</td><td style="padding:6px 12px;">${body.company || "—"}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Project Type</td><td style="padding:6px 12px;">${body.projectType}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Location</td><td style="padding:6px 12px;">${body.location || "—"}</td></tr>
        </table>
        <h3>Message</h3>
        <p>${body.message.replace(/\n/g, "<br>")}</p>
      `.trim(),
    },
    toRecipients: [{ emailAddress: { address: SENDER } }],
    replyTo: [{ emailAddress: { address: body.email, name: body.name } }],
  };

  if (body.fileName && body.fileBase64) {
    const sizeBytes = Buffer.from(body.fileBase64, "base64").length;
    if (sizeBytes > MAX_ATTACHMENT_BYTES) throw new Error("Attachment exceeds 10MB limit");

    message.attachments = [
      {
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: body.fileName,
        contentType: body.fileType || "application/octet-stream",
        contentBytes: body.fileBase64,
      },
    ];
  }

  return { message, saveToSentItems: true };
}

export async function sendMail(token: string, payload: Record<string, unknown>): Promise<void> {
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${SENDER}/sendMail`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Graph API error ${res.status}: ${error}`);
  }
}
