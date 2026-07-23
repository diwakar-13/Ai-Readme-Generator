export function getContactEmailHtml({ name, email, subject, message }) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Request</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #121215; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
              
              <!-- Header Bar -->
              <tr>
                <td style="padding: 28px 32px; background: linear-gradient(135deg, #18181b 0%, #09090b 100%); border-bottom: 1px solid #27272a;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <span style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Repo<span style="color: #f97316;">Scribe</span></span>
                      </td>
                      <td align="right">
                        <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.05); border: 1px solid #3f3f46; color: #f4f4f5; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">New Inquiry</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 32px;">
                  
                  <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #ffffff;">📩 ${subject || "General Inquiry"}</h2>

                  <!-- Details Grid -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #27272a; font-size: 13px; color: #71717a;">Sender Name:</td>
                      <td align="right" style="padding: 10px 0; border-bottom: 1px solid #27272a; font-size: 13px; font-weight: 600; color: #f4f4f5;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #27272a; font-size: 13px; color: #71717a;">Sender Email:</td>
                      <td align="right" style="padding: 10px 0; border-bottom: 1px solid #27272a; font-size: 13px; font-weight: 600; color: #f97316;">${email}</td>
                    </tr>
                  </table>

                  <!-- Message Box -->
                  <div style="margin-top: 8px;">
                    <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 10px;">Message Body</div>
                    <div style="background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; color: #e4e4e7; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 20px 32px 28px; background-color: #09090b; border-top: 1px solid #18181b; color: #52525b; font-size: 12px;">
                  Sent automatically from RepoScribe Public Contact Page.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}