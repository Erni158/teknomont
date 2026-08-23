import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const type = String(formData.get("type") ?? "contact");
    const email = String(formData.get("email") ?? "");
    const name = String(formData.get("name") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const company = String(formData.get("company") ?? "");

    const partNumber = String(formData.get("partNumber") ?? "");
    const quantity = String(formData.get("quantity") ?? "");
    const message = String(formData.get("message") ?? "");

    const file = formData.get("file");

    if (!email) {
      return NextResponse.json(
        { error: "Brak adresu e-mail." },
        { status: 400 },
      );
    }

    const attachments: {
      filename: string;
      content: Buffer;
    }[] = [];

    if (file instanceof File && file.size > 0) {
      // np. max 10 MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Plik jest zbyt duży." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    const subject =
      type === "sourcing"
        ? `Zapytanie sourcingowe: ${partNumber || "nowe zapytanie"}`
        : `Zapytanie ze strony: ${name || email}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #071d33;">
        <h2>
          ${
            type === "sourcing"
              ? "Nowe zapytanie sourcingowe"
              : "Nowe zapytanie ze strony"
          }
        </h2>

        <table
          cellpadding="8"
          cellspacing="0"
          style="border-collapse: collapse;"
        >
          ${
            name
              ? `
                <tr>
                  <td><strong>Imię / osoba:</strong></td>
                  <td>${escapeHtml(name)}</td>
                </tr>
              `
              : ""
          }

          ${
            company
              ? `
                <tr>
                  <td><strong>Firma:</strong></td>
                  <td>${escapeHtml(company)}</td>
                </tr>
              `
              : ""
          }

          <tr>
            <td><strong>E-mail:</strong></td>
            <td>${escapeHtml(email)}</td>
          </tr>

          ${
            phone
              ? `
                <tr>
                  <td><strong>Telefon:</strong></td>
                  <td>${escapeHtml(phone)}</td>
                </tr>
              `
              : ""
          }

          ${
            partNumber
              ? `
                <tr>
                  <td><strong>Numer części:</strong></td>
                  <td>${escapeHtml(partNumber)}</td>
                </tr>
              `
              : ""
          }

          ${
            quantity
              ? `
                <tr>
                  <td><strong>Ilość:</strong></td>
                  <td>${escapeHtml(quantity)}</td>
                </tr>
              `
              : ""
          }
        </table>

        ${
          message
            ? `
              <h3 style="margin-top: 24px;">Wiadomość</h3>
              <p style="white-space: pre-wrap;">
                ${escapeHtml(message)}
              </p>
            `
            : ""
        }
      </div>
    `;

    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM ?? "Teknomont <noreply@tmidc.pl>",

      to: [process.env.MAIL_TO ?? "biuro@tmidc.pl"],

      replyTo: email,

      subject,
      html,

      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Nie udało się wysłać wiadomości." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Wystąpił błąd serwera." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
