import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Resend from "@auth/core/providers/resend";

function resetEmailHtml(code: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f0e6;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid rgba(138,109,72,0.15);">

          <!-- Header -->
          <tr>
            <td style="background:#2a2318;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;color:#c4a87a;letter-spacing:3px;font-weight:700;">
                STUDIUM VERBI
              </h1>
              <p style="margin:6px 0 0;font-family:Georgia,serif;font-size:11px;color:rgba(196,168,122,0.5);letter-spacing:2px;text-transform:uppercase;">
                Scripture &middot; Commentary &middot; Exegesis
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 20px;">
              <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:20px;color:#2e281f;font-weight:700;">
                Reset Your Password
              </h2>
              <p style="margin:0 0 28px;font-family:Georgia,serif;font-size:15px;color:#6a5e4e;line-height:1.6;">
                We received a request to reset the password for your account. Enter the code below on the reset page to set a new password.
              </p>

              <!-- Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <div style="display:inline-block;background:#f0e8d4;border-radius:8px;padding:16px 36px;border:2px solid #8a6d48;">
                      <span style="font-family:'Courier New',monospace;font-size:34px;font-weight:700;color:#2e281f;letter-spacing:10px;">
                        ${code}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-family:Georgia,serif;font-size:13px;color:#8a7e6e;line-height:1.5;text-align:center;">
                This code expires in 24 hours.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e6dcc6;margin:24px 0 0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 40px 28px;">
              <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:#8a7e6e;line-height:1.5;">
                If you didn't request this, you can safely ignore this email. Your password will not be changed.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

function resetEmailText(code: string): string {
  return `Studium Verbi — Password Reset\n\nYour verification code is: ${code}\n\nEnter this code on the password reset page to set your new password. This code will expire in 24 hours.\n\nIf you did not request this reset, you can safely ignore this email.`;
}

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      reset: Resend({
        from: "Studium Verbi <support@giotech.ai>",
        apiKey: process.env.AUTH_RESEND_KEY,
        generateVerificationToken() {
          const code = Math.floor(100000 + Math.random() * 900000).toString();
          return code;
        },
        async sendVerificationRequest(params) {
          const { identifier: to, provider, url } = params;
          // Extract the 6-digit code from the URL (may be in ?token=, ?code=, or the path)
          const parsed = new URL(url);
          const code =
            parsed.searchParams.get("token") ??
            parsed.searchParams.get("code") ??
            (url.match(/\b(\d{6})\b/)?.[1]) ??
            url;

          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${provider.apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: provider.from,
              to,
              subject: "Your Studium Verbi Password Reset Code",
              html: resetEmailHtml(code),
              text: resetEmailText(code),
            }),
          });

          if (!res.ok) {
            throw new Error(
              "Resend error: " + JSON.stringify(await res.json())
            );
          }
        },
      }),
    }),
  ],
});
