import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";

import {
  hasStandardEnds,
  idcConfigurationSchema,
  type IdcConfiguration,
  type IdcSide,
} from "@/lib/idc";

export type IdcPdfPreview = {
  dataUrl: string;
  width: number;
  height: number;
};

type IdcPdfAssets = {
  regularFont: Uint8Array;
  boldFont: Uint8Array;
  logo?: Uint8Array;
};

export type IdcPdfOptions = {
  configuration: IdcConfiguration;
  locale: "pl" | "en";
  preview: IdcPdfPreview | null;
  generatedAt?: Date;
  assets?: IdcPdfAssets;
};

const PAGE = { width: 595.28, height: 841.89, margin: 40, bottom: 61 };
const COLORS = {
  ink: rgb(0.063, 0.145, 0.251),
  muted: rgb(0.365, 0.435, 0.522),
  blue: rgb(0.027, 0.349, 0.863),
  border: rgb(0.875, 0.902, 0.937),
  pale: rgb(0.953, 0.969, 0.992),
  white: rgb(1, 1, 1),
};

let cachedAssets: Promise<IdcPdfAssets> | undefined;

async function assetBytes(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`PDF asset could not be loaded: ${url}`);
  return new Uint8Array(await response.arrayBuffer());
}

function loadAssets() {
  if (!cachedAssets) {
    cachedAssets = Promise.all([
      assetBytes("/fonts/noto-sans-regular.ttf"),
      assetBytes("/fonts/noto-sans-bold.ttf"),
      assetBytes("/images/logo.png").catch(() => undefined),
    ])
      .then(([regularFont, boldFont, logo]) => ({
        regularFont,
        boldFont,
        logo,
      }))
      .catch((error) => {
        cachedAssets = undefined;
        throw error;
      });
  }
  return cachedAssets;
}

/** Wraps individual code points too, so an unbroken manufacturer MPN is preserved. */
function wrapText(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  for (const paragraph of text.replace(/\r\n?/g, "\n").split("\n")) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of paragraph.split(/\s+/u)) {
      if (!word) continue;
      const joined = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(joined, size) <= width) {
        line = joined;
        continue;
      }
      if (line) lines.push(line);
      line = "";
      for (const point of word) {
        if (line && font.widthOfTextAtSize(line + point, size) > width) {
          lines.push(line);
          line = point;
        } else line += point;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

export async function createIdcPdf({
  configuration,
  locale,
  preview,
  generatedAt = new Date(),
  assets,
}: IdcPdfOptions): Promise<Uint8Array> {
  const config = idcConfigurationSchema.parse(configuration);
  const pl = locale === "pl";
  const copy = pl
    ? {
        title: "Specyfikacja przewodu IDC",
        subtitle: "Konfiguracja do indywidualnej wyceny",
        date: "Data przygotowania",
        preview: "PODGLĄD KONFIGURACJI",
        previewMissing:
          "Podgląd 3D jest niedostępny. Wybrane parametry zapisano poniżej.",
        previewCaption:
          "Model poglądowy. Oznaczenia A i B wskazują zakończenia przewodu.",
        parameters: "WYBRANE PARAMETRY",
        pins: "Liczba żył",
        length: "Długość L",
        quantity: "Ilość",
        pieces: "szt.",
        type: "Typ przewodu",
        cablePitch: "Raster taśmy",
        connectorPitch: "Raster złącza w modelu",
        gauge: "Przekrój / izolacja",
        colour: "Kolor taśmy",
        gray: "Szary / czerwony znacznik żyły 1",
        black: "Czarny / czerwony znacznik żyły 1",
        end: "Zakończenie",
        socket: `IDC żeńskie, ${config.pins} styków (do potwierdzenia)`,
        none: "Bez złącza",
        part: "Numer części",
        orientation: "Ułożenie złączy",
        same: "Zgodne - otwory po tej samej stronie",
        opposite: "Przeciwne - złącze B odwrócone",
        drawing: "Do uzgodnienia według zakończeń / rysunku",
        referenceTitle: "Sposób pomiaru L",
        reference:
          "Między osiami złączy; przy braku złącza do końca taśmy. Sposób pomiaru i tolerancje potwierdzimy w wycenie.",
        note: "Dokument służy do przygotowania zapytania. Nie jest zamówieniem ani rysunkiem wykonawczym. Numery części, wymiary obudów, pinout i możliwość wykonania wymagają potwierdzenia. Ułożenie obudów nie określa połączeń elektrycznych.",
        continuation: "Specyfikacja IDC - ciąg dalszy",
        page: "Strona",
      }
    : {
        title: "IDC ribbon cable specification",
        subtitle: "Configuration for an individual quotation",
        date: "Prepared on",
        preview: "CONFIGURATION PREVIEW",
        previewMissing:
          "3D preview is unavailable. The selected parameters are recorded below.",
        previewCaption:
          "Illustrative model. A and B identify the cable terminations.",
        parameters: "SELECTED PARAMETERS",
        pins: "Conductor count",
        length: "Length L",
        quantity: "Quantity",
        pieces: "pcs",
        type: "Cable type",
        cablePitch: "Cable pitch",
        connectorPitch: "Model connector pitch",
        gauge: "Wire gauge / insulation",
        colour: "Cable colour",
        gray: "Grey / red conductor 1 marker",
        black: "Black / red conductor 1 marker",
        end: "End",
        socket: `IDC female, ${config.pins} contacts (to be confirmed)`,
        none: "No connector",
        part: "Part number",
        orientation: "Connector orientation",
        same: "Same side - sockets facing the same way",
        opposite: "Opposite sides - connector B reversed",
        drawing: "To be agreed from end types / drawing",
        referenceTitle: "Length L reference",
        reference:
          "Between connector axes, or to the cable end where no connector is selected. The measurement reference and tolerances will be confirmed in the quotation.",
        note: "This document is for an inquiry. It is not an order or a manufacturing drawing. Part numbers, housing dimensions, pinout and feasibility require confirmation. Housing orientation does not define electrical connections.",
        continuation: "IDC specification - continued",
        page: "Page",
      };
  const date = new Intl.DateTimeFormat(pl ? "pl-PL" : "en-GB", {
    dateStyle: "medium",
    timeZone: "Europe/Warsaw",
  }).format(generatedAt);
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`${copy.title} - ${config.pins} / ${config.length} mm`);
  pdf.setAuthor("Teknomont");
  pdf.setCreator("Teknomont IDC Studio");
  pdf.setSubject(copy.subtitle);
  pdf.setLanguage(locale);
  pdf.setCreationDate(generatedAt);
  pdf.setModificationDate(generatedAt);
  const bytes = assets ?? (await loadAssets());
  const [regular, bold, logo] = await Promise.all([
    pdf.embedFont(bytes.regularFont, { subset: true }),
    pdf.embedFont(bytes.boldFont, { subset: true }),
    bytes.logo ? pdf.embedPng(bytes.logo).catch(() => undefined) : undefined,
  ]);
  const contentWidth = PAGE.width - PAGE.margin * 2;
  let page!: PDFPage;
  let y = 0;

  function drawLines(
    lines: string[],
    x: number,
    top: number,
    font = regular,
    size = 9,
    lineHeight = 13,
    color = COLORS.ink,
  ) {
    lines.forEach((line, index) => {
      page.drawText(line, {
        x,
        y: top - size - index * lineHeight,
        font,
        size,
        color,
      });
    });
  }
  function newPage(continuation: boolean) {
    page = pdf.addPage([PAGE.width, PAGE.height]);
    const top = PAGE.height - PAGE.margin;
    if (logo) {
      const size = logo.scaleToFit(52, 36);
      page.drawImage(logo, {
        x: PAGE.margin,
        y: top - size.height,
        width: size.width,
        height: size.height,
      });
    }
    const brandX = PAGE.margin + (logo ? 63 : 0);
    page.drawText("TEKNOMONT", {
      x: brandX,
      y: top - 14,
      font: bold,
      size: 14,
      color: COLORS.ink,
    });
    page.drawText("IDC STUDIO / 3D", {
      x: brandX,
      y: top - 29,
      font: regular,
      size: 8.5,
      color: COLORS.blue,
    });
    const dateX =
      PAGE.width - PAGE.margin - regular.widthOfTextAtSize(date, 8.5);
    page.drawText(copy.date, {
      x: PAGE.width - PAGE.margin - regular.widthOfTextAtSize(copy.date, 7),
      y: top - 11,
      font: regular,
      size: 7,
      color: COLORS.muted,
    });
    page.drawText(date, {
      x: dateX,
      y: top - 27,
      font: regular,
      size: 8.5,
      color: COLORS.ink,
    });
    page.drawLine({
      start: { x: PAGE.margin, y: top - 48 },
      end: { x: PAGE.width - PAGE.margin, y: top - 48 },
      thickness: 0.7,
      color: COLORS.border,
    });
    y = top - 60;
    if (continuation) {
      page.drawText(copy.continuation, {
        x: PAGE.margin,
        y: y - 16,
        font: bold,
        size: 16,
        color: COLORS.ink,
      });
      y -= 39;
    }
  }
  function reserve(height: number) {
    if (y - height < PAGE.bottom) newPage(true);
  }
  function paragraph(
    text: string,
    size = 8.3,
    lineHeight = 12,
    color = COLORS.muted,
  ) {
    const lines = wrapText(text, regular, size, contentWidth);
    reserve(lines.length * lineHeight + 6);
    drawLines(lines, PAGE.margin, y, regular, size, lineHeight, color);
    y -= lines.length * lineHeight + 6;
  }
  function sectionTitle(text: string) {
    reserve(29);
    page.drawText(text, {
      x: PAGE.margin,
      y: y - 9,
      font: bold,
      size: 8,
      color: COLORS.blue,
    });
    y -= 25;
  }
  function tableRow(label: string, value: string) {
    const labelWidth = 154;
    const fontSize = 9;
    const lineHeight = 12;
    const labelLines = wrapText(label, regular, 8.2, labelWidth - 14);
    const valueLines = wrapText(
      value,
      regular,
      fontSize,
      contentWidth - labelWidth - 16,
    );
    const height = Math.max(
      25,
      Math.max(labelLines.length, valueLines.length) * lineHeight + 13,
    );
    reserve(height);
    drawLines(
      labelLines,
      PAGE.margin + 10,
      y - 7,
      regular,
      8.2,
      lineHeight,
      COLORS.muted,
    );
    drawLines(
      valueLines,
      PAGE.margin + labelWidth,
      y - 7,
      regular,
      fontSize,
      lineHeight,
    );
    page.drawLine({
      start: { x: PAGE.margin, y: y - height },
      end: { x: PAGE.width - PAGE.margin, y: y - height },
      thickness: 0.6,
      color: COLORS.border,
    });
    y -= height;
  }
  newPage(false);
  page.drawText(copy.title, {
    x: PAGE.margin,
    y: y - 22,
    font: bold,
    size: 22,
    color: COLORS.ink,
  });
  y -= 34;
  paragraph(copy.subtitle, 9, 13);
  y -= 5;

  const metricWidth = (contentWidth - 16) / 3;
  for (const [index, [label, value]] of [
    [copy.pins, String(config.pins)],
    [copy.length, `${config.length} mm`],
    [copy.quantity, `${config.quantity} ${copy.pieces}`],
  ].entries()) {
    const x = PAGE.margin + index * (metricWidth + 8);
    page.drawRectangle({
      x,
      y: y - 49,
      width: metricWidth,
      height: 49,
      color: COLORS.pale,
    });
    page.drawText(label, {
      x: x + 12,
      y: y - 15,
      font: regular,
      size: 7.5,
      color: COLORS.muted,
    });
    page.drawText(value, {
      x: x + 12,
      y: y - 35,
      font: bold,
      size: 13.5,
      color: COLORS.ink,
    });
  }
  y -= 62;
  sectionTitle(copy.preview);
  const imageHeight = 176;
  reserve(imageHeight + 30);
  page.drawRectangle({
    x: PAGE.margin,
    y: y - imageHeight,
    width: contentWidth,
    height: imageHeight,
    color: COLORS.pale,
    borderColor: COLORS.border,
    borderWidth: 0.5,
  });
  if (preview) {
    if (
      !preview.dataUrl.startsWith("data:image/png;") ||
      !Number.isFinite(preview.width) ||
      !Number.isFinite(preview.height) ||
      preview.width <= 0 ||
      preview.height <= 0
    )
      throw new Error("Invalid IDC preview image");
    const image = await pdf.embedPng(preview.dataUrl);
    const size = image.scaleToFit(contentWidth - 16, imageHeight - 12);
    page.drawImage(image, {
      x: PAGE.margin + (contentWidth - size.width) / 2,
      y: y - imageHeight + (imageHeight - size.height) / 2,
      width: size.width,
      height: size.height,
    });
  } else {
    const lines = wrapText(copy.previewMissing, regular, 10, contentWidth - 76);
    drawLines(
      lines,
      PAGE.margin + 38,
      y - imageHeight / 2 + lines.length * 7,
      regular,
      10,
      15,
      COLORS.muted,
    );
  }
  y -= imageHeight + 7;
  paragraph(copy.previewCaption, 7.2, 10.5);
  y -= 3;
  sectionTitle(copy.parameters);
  const end = (side: IdcSide) =>
    config[`end${side}`] === "none"
      ? copy.none
      : config[`end${side}`] === "custom"
        ? `${copy.part}: ${config[`part${side}`]}`
        : copy.socket;
  tableRow(copy.type, "IDC / ribbon cable");
  tableRow(copy.cablePitch, "1.27 mm");
  tableRow(copy.connectorPitch, "2.54 × 2.54 mm");
  tableRow(copy.gauge, "28 AWG / PVC");
  tableRow(copy.colour, config.color === "gray" ? copy.gray : copy.black);
  tableRow(`${copy.end} A`, end("A"));
  tableRow(`${copy.end} B`, end("B"));
  tableRow(
    copy.orientation,
    hasStandardEnds(config)
      ? config.orientation === "same"
        ? copy.same
        : copy.opposite
      : copy.drawing,
  );
  y -= 16;
  reserve(70);
  page.drawText(copy.referenceTitle, {
    x: PAGE.margin,
    y: y - 9,
    font: bold,
    size: 8.3,
    color: COLORS.ink,
  });
  y -= 18;
  paragraph(copy.reference, 8.1, 11.5);
  paragraph(copy.note, 7.4, 10.5);

  const pages = pdf.getPages();
  for (const [index, current] of pages.entries()) {
    current.drawLine({
      start: { x: PAGE.margin, y: 42 },
      end: { x: PAGE.width - PAGE.margin, y: 42 },
      thickness: 0.6,
      color: COLORS.border,
    });
    current.drawText("tmidc.pl  |  IDC Studio", {
      x: PAGE.margin,
      y: 27,
      font: regular,
      size: 7,
      color: COLORS.muted,
    });
    const number = `${copy.page} ${index + 1} / ${pages.length}`;
    current.drawText(number, {
      x: PAGE.width - PAGE.margin - regular.widthOfTextAtSize(number, 7),
      y: 27,
      font: regular,
      size: 7,
      color: COLORS.muted,
    });
  }
  return pdf.save();
}
