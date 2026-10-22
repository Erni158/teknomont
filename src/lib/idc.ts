import { z } from "zod";

export const IDC_PINS = [10, 14, 16, 20, 26, 34, 40, 50, 64] as const;
export const IDC_FILE_LIMIT = 3.5 * 1024 * 1024;

// Bounds protect the preview and inquiry payload; they are not production limits.
export const idcConfigurationSchema = z
  .object({
    pins: z
      .number()
      .int()
      .refine((value) => IDC_PINS.some((pins) => pins === value)),
    length: z.number().int().min(1).max(100000),
    color: z.enum(["gray", "black"]),
    endA: z.enum(["socket", "none", "custom"]),
    endB: z.enum(["socket", "none", "custom"]),
    partA: z.string().trim().max(160),
    partB: z.string().trim().max(160),
    orientation: z.enum(["same", "opposite"]),
    quantity: z.number().int().min(1).max(1000000),
  })
  .superRefine((config, context) => {
    for (const side of ["A", "B"] as const) {
      if (config[`end${side}`] === "custom" && !config[`part${side}`]) {
        context.addIssue({
          code: "custom",
          path: [`part${side}`],
          message: "Part number required",
        });
      }
    }
  });

export type IdcConfiguration = z.infer<typeof idcConfigurationSchema>;
export type IdcSide = "A" | "B";

export const DEFAULT_IDC_CONFIGURATION: IdcConfiguration = {
  pins: 40,
  length: 300,
  color: "gray",
  endA: "socket",
  endB: "socket",
  partA: "",
  partB: "",
  orientation: "same",
  quantity: 100,
};

export function hasStandardEnds(config: IdcConfiguration) {
  return config.endA === "socket" && config.endB === "socket";
}

export function formatIdcSpecification(
  config: IdcConfiguration,
  locale: "pl" | "en",
) {
  const pl = locale === "pl";
  const end = (side: IdcSide) => {
    const type = config[`end${side}`];
    if (type === "none") return pl ? "Bez złącza" : "No connector";
    if (type === "custom")
      return `${pl ? "Numer części" : "Part number"}: ${config[`part${side}`]}`;
    return pl
      ? `IDC żeńskie, ${config.pins} styków (do potwierdzenia)`
      : `IDC female, ${config.pins} contacts (to be confirmed)`;
  };
  return [
    "TEKNOMONT / IDC STUDIO",
    pl
      ? "Specyfikacja do zapytania — nie jest zamówieniem ani rysunkiem wykonawczym."
      : "Inquiry specification — not an order or a manufacturing drawing.",
    "",
    `${pl ? "Typ" : "Type"}: IDC / ribbon cable`,
    `${pl ? "Liczba żył" : "Conductors"}: ${config.pins}`,
    `${pl ? "Raster taśmy" : "Cable pitch"}: 1.27 mm`,
    `${pl ? "Przekrój / izolacja" : "Wire gauge / insulation"}: 28 AWG / PVC`,
    `${pl ? "Długość L" : "Length L"}: ${config.length} mm`,
    `${pl ? "Pomiar L" : "L reference"}: ${pl ? "między osiami złączy; przy braku złącza do końca taśmy" : "between connector axes; to the cable end where no connector is selected"}`,
    `${pl ? "Kolor" : "Colour"}: ${pl ? (config.color === "gray" ? "szary" : "czarny") : config.color}; ${pl ? "czerwony znacznik żyły 1" : "red conductor 1 marker"}`,
    `${pl ? "Zakończenie" : "End"} A: ${end("A")}`,
    `${pl ? "Zakończenie" : "End"} B: ${end("B")}`,
    `${pl ? "Ułożenie złączy" : "Connector orientation"}: ${hasStandardEnds(config) ? (config.orientation === "same" ? (pl ? "zgodne" : "same side") : pl ? "przeciwne" : "opposite sides") : pl ? "do uzgodnienia wg zakończeń / rysunku" : "to be agreed from end types / drawing"}`,
    `${pl ? "Ilość" : "Quantity"}: ${config.quantity} ${pl ? "szt." : "pcs"}`,
    "",
    pl
      ? "Model 3D jest poglądowy. Raster złącza w modelu: 2.54 × 2.54 mm. Numery części, wymiary obudów, pinout, sposób pomiaru, tolerancje i możliwość wykonania wymagają potwierdzenia w wycenie."
      : "The 3D model is illustrative. Model connector pitch: 2.54 × 2.54 mm. Part numbers, housing dimensions, pinout, length reference, tolerances and feasibility require confirmation in the quotation.",
  ].join("\n");
}
