import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 3.5 * 1024 * 1024; // 3.5 MB

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const mailFrom = process.env.MAIL_FROM;
    const mailTo = process.env.MAIL_TO;

    if (!apiKey || !mailFrom || !mailTo) {
      console.error("Missing email configuration", {
        hasApiKey: Boolean(apiKey),
        hasMailFrom: Boolean(mailFrom),
        hasMailTo: Boolean(mailTo),
      });

      return NextResponse.json(
        {
          error: "Brak konfiguracji wysyłki e-mail.",
        },
        {
          status: 500,
        },
      );
    }

    const resend = new Resend(apiKey);

    const formData = await request.formData();

    const type = String(formData.get("type") ?? "contact");

    const email = String(formData.get("email") ?? "").trim();

    const name = String(formData.get("name") ?? "").trim();

    const phone = String(formData.get("phone") ?? "").trim();

    const company = String(formData.get("company") ?? "").trim();

    const partNumber = String(formData.get("partNumber") ?? "").trim();

    const quantity = String(formData.get("quantity") ?? "").trim();

    const message = String(formData.get("message") ?? "").trim();

    const file = formData.get("file");

    // EMAIL
    if (!email) {
      return NextResponse.json(
        {
          error: "Brak adresu e-mail.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: "Niepoprawny adres e-mail.",
        },
        {
          status: 400,
        },
      );
    }

    // ATTACHMENT
    const attachments: {
      filename: string;
      content: Buffer;
    }[] = [];

    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: "Plik jest zbyt duży. Maksymalny rozmiar to 3,5 MB.",
          },
          {
            status: 400,
          },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      attachments.push({
        filename: sanitizeFileName(file.name),
        content: buffer,
      });
    }

    const isSourcing = type === "sourcing";

    const subject = isSourcing
      ? `Zapytanie sourcingowe: ${partNumber || "nowe zapytanie"}`
      : `Zapytanie ze strony: ${name || email}`;

    const html = `
      <!doctype html>

      <html lang="pl">
        <head>
          <meta charset="utf-8" />
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background: #f4f7f8;
            font-family: Arial, sans-serif;
            color: #071d33;
          "
        >
          <div
            style="
              max-width: 680px;
              margin: 0 auto;
              padding: 32px 16px;
            "
          >
            <div
              style="
                background: #ffffff;
                border: 1px solid #dce6ec;
                border-radius: 12px;
                overflow: hidden;
              "
            >
              <div
                style="
                  padding: 24px 28px;
                  background: #07345d;
                  color: #ffffff;
                "
              >
                <div
                  style="
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    opacity: 0.75;
                  "
                >
                  Teknomont
                </div>

                <h1
                  style="
                    margin: 8px 0 0;
                    font-size: 22px;
                    line-height: 1.3;
                  "
                >
                  ${
                    isSourcing
                      ? "Nowe zapytanie sourcingowe"
                      : "Nowe zapytanie ze strony"
                  }
                </h1>
              </div>

              <div style="padding: 24px 28px;">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    width: 100%;
                    border-collapse: collapse;
                  "
                >
                  ${name ? renderRow("Imię / osoba", name) : ""}

                  ${company ? renderRow("Firma", company) : ""}

                  ${renderRow("E-mail", email)}

                  ${phone ? renderRow("Telefon", phone) : ""}

                  ${
                    partNumber
                      ? renderRow("Numer części / opis", partNumber)
                      : ""
                  }

                  ${quantity ? renderRow("Ilość", quantity) : ""}
                </table>

                ${
                  message
                    ? `
                      <div
                        style="
                          margin-top: 24px;
                          padding-top: 20px;
                          border-top: 1px solid #e4ebef;
                        "
                      >
                        <div
                          style="
                            margin-bottom: 8px;
                            font-size: 12px;
                            font-weight: 700;
                            color: #607484;
                            text-transform: uppercase;
                            letter-spacing: 0.04em;
                          "
                        >
                          Wiadomość
                        </div>

                        <div
                          style="
                            font-size: 14px;
                            line-height: 1.7;
                            white-space: pre-wrap;
                          "
                        >${escapeHtml(message)}</div>
                      </div>
                    `
                    : ""
                }

                ${
                  attachments.length > 0
                    ? `
                      <div
                        style="
                          margin-top: 20px;
                          padding: 12px 14px;
                          border-radius: 8px;
                          background: #f3f7f9;
                          font-size: 12px;
                          color: #607484;
                        "
                      >
                        Do wiadomości dołączono plik:
                        <strong>
                          ${escapeHtml(attachments[0].filename)}
                        </strong>
                      </div>
                    `
                    : ""
                }
              </div>
            </div>

            <div
              style="
                padding: 16px 4px 0;
                font-size: 11px;
                line-height: 1.5;
                color: #82929d;
              "
            >
              Wiadomość została wysłana z formularza na stronie tmidc.pl.
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: mailFrom,

      to: [mailTo],

      // Po kliknięciu "Odpowiedz"
      // odpowiedź trafi bezpośrednio do klienta.
      replyTo: email,

      subject,

      html,

      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        {
          error: "Nie udało się wysłać wiadomości.",
        },
        {
          status: 500,
        },
      );
    }

    console.log("Inquiry email sent:", data?.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Inquiry route error:", error);

    return NextResponse.json(
      {
        error: "Wystąpił błąd serwera. Spróbuj ponownie.",
      },
      {
        status: 500,
      },
    );
  }
}

function renderRow(label: string, value: string) {
  return `
    <tr>
      <td
        style="
          width: 180px;
          padding: 10px 16px 10px 0;
          border-bottom: 1px solid #edf1f3;
          font-size: 12px;
          font-weight: 700;
          color: #607484;
          vertical-align: top;
        "
      >
        ${escapeHtml(label)}
      </td>

      <td
        style="
          padding: 10px 0;
          border-bottom: 1px solid #edf1f3;
          font-size: 14px;
          color: #071d33;
          vertical-align: top;
        "
      >
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sanitizeFileName(value: string) {
  return value.replace(/[^\p{L}\p{N}._\- ()]/gu, "_").slice(0, 150);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
