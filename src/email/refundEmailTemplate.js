export function getRefundEmailHTML({ userEmail, userId, reason, requestDate }) {
  const formattedDate = requestDate
    ? new Date(requestDate).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("en-IN");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Refund Request Alert</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; padding: 40px 10px;">
      <tr>
        <td align="center">
          
          <table width="100%" max-width="580" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #121215; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(224, 97, 56, 0.15);">
            
            <tr>
              <td style="height: 4px; background: linear-gradient(90deg, #e06138 0%, #d9532f 50%, #b86b42 100%);"></td>
            </tr>

            <tr>
              <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #18181b;">
                <table border="0" cellspacing="0" cellpadding="0" align="center">
                  <tr>
                    <td align="center">
                      <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #e06138 0%, #a8502d 100%); border-radius: 12px; color: #ffffff; font-weight: 800; font-size: 20px; line-height: 48px; text-align: center; letter-spacing: -0.5px; box-shadow: 0 0 15px rgba(224, 97, 56, 0.4); margin: 0 auto 16px auto;">
                        RS
                      </div>
                    </td>
                  </tr>
                </table>

                <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                  RepoScribe Admin Alert
                </h1>
                <p style="margin: 6px 0 0 0; color: #a1a1aa; font-size: 13px;">
                  New Pro Refund & Revocation Request
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 28px 32px;">
                
                <div style="background-color: rgba(224, 97, 56, 0.1); border: 1px solid rgba(224, 97, 56, 0.3); border-radius: 10px; padding: 12px 16px; margin-bottom: 24px;">
                  <table border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td style="color: #f97316; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                        🚨 Immediate Action Required
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #d4d4d8; font-size: 13px; margin-top: 4px; display: block;">
                        A Pro customer has requested a refund. Pro access was automatically revoked.
                      </td>
                    </tr>
                  </table>
                </div>

                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 24px; overflow: hidden;">
                  <tr>
                    <td style="padding: 14px 18px; border-bottom: 1px solid #27272a; color: #71717a; font-size: 12px; font-weight: 600; text-transform: uppercase;">Customer Email</td>
                    <td style="padding: 14px 18px; border-bottom: 1px solid #27272a; color: #ffffff; font-size: 13px; font-weight: 600; text-align: right;">${userEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 18px; border-bottom: 1px solid #27272a; color: #71717a; font-size: 12px; font-weight: 600; text-transform: uppercase;">User Clerk ID</td>
                    <td style="padding: 14px 18px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 12px; font-family: monospace; text-align: right;">${userId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 18px; color: #71717a; font-size: 12px; font-weight: 600; text-transform: uppercase;">Request Date</td>
                    <td style="padding: 14px 18px; color: #a1a1aa; font-size: 12px; text-align: right;">${formattedDate}</td>
                  </tr>
                </table>

                <div style="margin-bottom: 28px;">
                  <label style="display: block; color: #a1a1aa; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                    Provided Reason
                  </label>
                  <div style="background-color: #18181b; border-left: 3px solid #e06138; border-radius: 0 10px 10px 0; padding: 14px 18px; color: #f4f4f5; font-size: 14px; line-height: 1.6; font-style: italic;">
                    "${reason}"
                  </div>
                </div>

                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <a href="https://dashboard.razorpay.com/app/payments" target="_blank" style="display: inline-block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #e06138 0%, #d9532f 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; text-align: center; padding: 14px 24px; border-radius: 10px; box-shadow: 0 4px 14px rgba(224, 97, 56, 0.35);">
                        Open Razorpay & Issue Refund ➔
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <tr>
              <td style="padding: 20px 32px; background-color: #0d0d10; border-top: 1px solid #18181b; text-align: center;">
                <p style="margin: 0; color: #52525b; font-size: 12px;">
                  RepoScribe AI Documentation System • Automated Admin Notification
                </p>
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
