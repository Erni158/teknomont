export type LeadType = "sourcing" | "contact" | "b2b";

type WindowWithGtag = Window & {
  gtag?: (
    command: "event",
    eventName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export function trackLead(leadType: LeadType) {
  if (typeof window === "undefined") {
    return;
  }

  const gtag = (window as WindowWithGtag).gtag;

  if (!gtag) {
    return;
  }

  gtag("event", "generate_lead", {
    lead_type: leadType,
  });
}
