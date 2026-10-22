"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  FileCheck2,
  Info,
  Layers,
  LoaderCircle,
  Paperclip,
  RotateCcw,
  Send,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useInquirySubmit } from "@/hooks/use-inquiry-submit";
import {
  DEFAULT_IDC_CONFIGURATION,
  hasStandardEnds,
  IDC_FILE_LIMIT,
  IDC_PINS,
  idcConfigurationSchema,
  type IdcConfiguration,
  type IdcSide,
} from "@/lib/idc";
import { IdcViewer, type IdcViewerHandle } from "./idc-viewer";
import s from "./idc-studio.module.css";

export function IdcStudio() {
  const t = useTranslations("IdcStudio");
  const locale = useLocale() === "en" ? "en" : "pl";
  const [config, setConfig] = useState<IdcConfiguration>(
    DEFAULT_IDC_CONFIGURATION,
  );
  const [length, setLength] = useState(String(config.length));
  const [quantity, setQuantity] = useState(String(config.quantity));
  const [fileName, setFileName] = useState("");
  const [formError, setFormError] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const viewerRef = useRef<IdcViewerHandle>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const inquiryRef = useRef<HTMLHeadingElement>(null);
  const inquiry = useInquirySubmit();
  const candidate = {
    ...config,
    length: Number(length),
    quantity: Number(quantity),
  };
  const valid = idcConfigurationSchema.safeParse(candidate).success;
  const standardEnds = hasStandardEnds(config);

  function patch<K extends keyof IdcConfiguration>(
    key: K,
    value: IdcConfiguration[K],
  ) {
    setConfig((current) => ({ ...current, [key]: value }));
    setDownloaded(false);
    if (inquiry.isSuccess) inquiry.resetStatus();
  }
  function changeNumber(key: "length" | "quantity", value: string) {
    (key === "length" ? setLength : setQuantity)(value);
    const number = Number(value);
    if (
      Number.isInteger(number) &&
      number >= 1 &&
      number <= (key === "length" ? 100000 : 1000000)
    )
      patch(key, number);
  }
  function endLabel(side: IdcSide) {
    const type = config[`end${side}`];
    return type === "socket"
      ? t("fields.socket", { pins: config.pins })
      : type === "none"
        ? t("fields.none")
        : config[`part${side}`] || t("fields.custom");
  }
  async function download() {
    const parsed = idcConfigurationSchema.safeParse(candidate);
    if (!parsed.success || isGeneratingPdf) return;
    setDownloadError("");
    setDownloaded(false);
    setIsGeneratingPdf(true);
    try {
      const configuration = parsed.data;
      const preview = viewerRef.current?.capturePreview(configuration) ?? null;
      const { createIdcPdf } = await import("@/lib/idc-pdf");
      const bytes = await createIdcPdf({ configuration, locale, preview });
      const url = URL.createObjectURL(
        new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `Teknomont-IDC-${configuration.pins}p-${configuration.length}mm.pdf`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      setDownloaded(true);
    } catch {
      setDownloadError(t("downloadError"));
    } finally {
      setIsGeneratingPdf(false);
    }
  }
  function reset() {
    setConfig({ ...DEFAULT_IDC_CONFIGURATION });
    setLength(String(DEFAULT_IDC_CONFIGURATION.length));
    setQuantity(String(DEFAULT_IDC_CONFIGURATION.quantity));
    setDownloaded(false);
    if (inquiry.isSuccess) inquiry.resetStatus();
  }
  function goToInquiry() {
    inquiryRef.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    inquiryRef.current?.focus({ preventScroll: true });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inquiry.isSubmitting || inquiry.isSuccess) return;
    setFormError("");
    const parsed = idcConfigurationSchema.safeParse(candidate);
    if (!parsed.success) {
      setFormError(t("form.invalidConfig"));
      return;
    }
    const form = new FormData(event.currentTarget);
    const file = fileRef.current?.files?.[0] ?? null;
    if (file && file.size > IDC_FILE_LIMIT) {
      setFormError(t("form.fileError"));
      return;
    }
    try {
      await inquiry.submit({
        type: "idc",
        fields: {
          locale,
          configuration: JSON.stringify(parsed.data),
          name: String(form.get("name") || "").trim(),
          email: String(form.get("email") || "").trim(),
          company: String(form.get("company") || "").trim(),
          phone: String(form.get("phone") || "").trim(),
          message: String(form.get("message") || "").trim(),
        },
        file,
        fallbackError: t("form.error"),
      });
    } catch {
      /* The localized error is displayed below the form. */
    }
  }
  const summary = [
    [t("fields.pins"), String(config.pins)],
    [t("fields.length"), `${config.length} mm`],
    [t("fields.color"), t(`fields.${config.color}`)],
    [t("fields.end", { side: "A" }), endLabel("A")],
    [t("fields.end", { side: "B" }), endLabel("B")],
    [
      t("fields.orientation"),
      standardEnds ? t(`fields.${config.orientation}`) : t("fields.byDrawing"),
    ],
  ];

  return (
    <main className={s.root}>
      <div className={s.shell}>
        <nav className={s.breadcrumbs} aria-label={t("breadcrumb")}>
          <Link href="/produkty">{t("products")}</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span>IDC Studio</span>
        </nav>
        <header className={s.intro}>
          <div>
            <p className={s.eyebrow}>
              <span />
              {t("eyebrow")}
            </p>
            <h1>{t("heading")}</h1>
            <p className={s.tagline}>
              {t("title")} {t("accent")}
            </p>
            <p className={s.description}>{t("description")}</p>
          </div>
          <div className={s.downloadActions}>
            <button
              type="button"
              className={s.secondaryButton}
              onClick={download}
              disabled={!valid || isGeneratingPdf}
              aria-busy={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <LoaderCircle
                  className={s.spinner}
                  size={17}
                  aria-hidden="true"
                />
              ) : downloaded ? (
                <Check size={17} aria-hidden="true" />
              ) : (
                <Download size={17} aria-hidden="true" />
              )}
              {t(
                isGeneratingPdf
                  ? "downloading"
                  : downloaded
                    ? "downloaded"
                    : "download",
              )}
            </button>
            {downloadError && (
              <p className={s.downloadError} role="alert">
                {downloadError}
              </p>
            )}
          </div>
        </header>

        <div className={s.studioGrid}>
          <section className={s.settings} aria-labelledby="idc-settings-title">
            <div className={s.panelHeading}>
              <div>
                <span className={s.step}>01</span>
                <h2 id="idc-settings-title">{t("settings")}</h2>
              </div>
              <button
                type="button"
                className={s.iconButton}
                onClick={reset}
                aria-label={t("reset")}
                title={t("reset")}
                disabled={inquiry.isSubmitting || isGeneratingPdf}
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <fieldset
              disabled={inquiry.isSubmitting || isGeneratingPdf}
              className={s.settingsFields}
            >
              <legend className={s.srOnly}>{t("settings")}</legend>
              <div className={s.family}>
                <Layers size={19} aria-hidden="true" />
                <div>
                  <strong>IDC / Ribbon cable</strong>
                  <small>1.27 mm · 28 AWG · PVC</small>
                </div>
                <Check size={15} aria-hidden="true" />
              </div>
              <label className={s.field}>
                {t("fields.pins")}
                <select
                  form="idc-inquiry"
                  name="pins"
                  value={config.pins}
                  onChange={(event) =>
                    patch("pins", Number(event.target.value))
                  }
                >
                  {IDC_PINS.map((pins) => (
                    <option key={pins} value={pins}>
                      {t("fields.pinsOption", { pins })}
                    </option>
                  ))}
                </select>
              </label>
              <label className={s.field}>
                {t("fields.length")}
                <div className={s.unitInput}>
                  <input
                    form="idc-inquiry"
                    name="length"
                    type="number"
                    required
                    min={1}
                    max={100000}
                    step={1}
                    value={length}
                    onChange={(event) =>
                      changeNumber("length", event.target.value)
                    }
                    aria-describedby="idc-length-help"
                  />
                  <span>mm</span>
                </div>
              </label>
              <p id="idc-length-help" className={s.fieldHelp}>
                {t("fields.lengthHelp")}
              </p>
              <fieldset className={s.colorField}>
                <legend>{t("fields.color")}</legend>
                <div className={s.colorOptions}>
                  {(["gray", "black"] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={t(`fields.${color}`)}
                      aria-pressed={config.color === color}
                      className={s.colorButton}
                      onClick={() => patch("color", color)}
                    >
                      <span
                        className={
                          color === "gray" ? s.graySwatch : s.blackSwatch
                        }
                      />
                      <span>{t(`fields.${color}`)}</span>
                      {config.color === color && (
                        <Check size={13} aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className={s.subheading}>{t("fields.ends")}</div>
              {(["A", "B"] as const).map((side) => (
                <div key={side} className={s.endField}>
                  <label className={s.field}>
                    <span>
                      <span className={s.sideTag}>{side}</span>
                      {t("fields.end", { side })}
                    </span>
                    <select
                      form="idc-inquiry"
                      name={`end${side}`}
                      value={config[`end${side}`]}
                      onChange={(event) =>
                        patch(
                          `end${side}`,
                          event.target.value as IdcConfiguration["endA"],
                        )
                      }
                    >
                      <option value="socket">
                        {t("fields.socket", { pins: config.pins })}
                      </option>
                      <option value="none">{t("fields.none")}</option>
                      <option value="custom">{t("fields.custom")}</option>
                    </select>
                  </label>
                  {config[`end${side}`] === "custom" && (
                    <label className={s.field}>
                      {t("fields.part", { side })}
                      <input
                        form="idc-inquiry"
                        name={`part${side}`}
                        required
                        maxLength={160}
                        pattern=".*\S.*"
                        value={config[`part${side}`]}
                        onChange={(event) =>
                          patch(`part${side}`, event.target.value)
                        }
                        placeholder={t("fields.partPlaceholder")}
                      />
                      <small>{t("fields.customHelp")}</small>
                    </label>
                  )}
                </div>
              ))}
              <label className={s.field}>
                {t("fields.orientation")}
                <select
                  form="idc-inquiry"
                  name="orientation"
                  disabled={!standardEnds}
                  value={standardEnds ? config.orientation : "drawing"}
                  onChange={(event) =>
                    patch(
                      "orientation",
                      event.target.value as IdcConfiguration["orientation"],
                    )
                  }
                >
                  {standardEnds ? (
                    <>
                      <option value="same">{t("fields.same")}</option>
                      <option value="opposite">{t("fields.opposite")}</option>
                    </>
                  ) : (
                    <option value="drawing">{t("fields.byDrawing")}</option>
                  )}
                </select>
              </label>
              <p className={s.fieldHelp}>{t("fields.orientationHelp")}</p>
            </fieldset>
          </section>

          <div className={s.previewColumn}>
            <IdcViewer config={config} ref={viewerRef} />
            <div className={s.previewNote}>
              <Info size={17} aria-hidden="true" />
              <p>{t("previewNote")}</p>
            </div>
            <div className={s.technicalStrip}>
              <div>
                <span>{t("technical.cablePitch")}</span>
                <strong>1.27 mm</strong>
              </div>
              <div>
                <span>{t("technical.connectorPitch")}</span>
                <strong>2.54 × 2.54 mm</strong>
              </div>
              <div>
                <span>{t("technical.gauge")}</span>
                <strong>28 AWG / PVC</strong>
              </div>
            </div>
          </div>

          <aside className={s.summary} aria-labelledby="idc-summary-title">
            <div className={s.panelHeading}>
              <div>
                <span className={s.step}>02</span>
                <h2 id="idc-summary-title">{t("summary")}</h2>
              </div>
              <FileCheck2 size={18} aria-hidden="true" />
            </div>
            <div className={s.summaryBody}>
              <p className={s.summaryFamily}>IDC / RIBBON CABLE</p>
              <p className={s.summaryNumber}>
                {config.pins}
                <span> {t("conductors")}</span>
              </p>
              <dl className={s.summaryRows}>
                {summary.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <label className={s.field}>
                {t("fields.quantity")}
                <div className={s.unitInput}>
                  <input
                    form="idc-inquiry"
                    type="number"
                    name="quantity"
                    required
                    min={1}
                    max={1000000}
                    step={1}
                    value={quantity}
                    disabled={inquiry.isSubmitting || isGeneratingPdf}
                    onChange={(event) =>
                      changeNumber("quantity", event.target.value)
                    }
                  />
                  <span>{t("pcs")}</span>
                </div>
              </label>
              <button
                type="button"
                className={s.primaryButton}
                onClick={goToInquiry}
              >
                {t("review")}
                <ArrowDown size={17} aria-hidden="true" />
              </button>
              <p className={s.summaryNote}>{t("quoteNote")}</p>
            </div>
          </aside>
        </div>

        <section className={s.guide} aria-labelledby="idc-guide-title">
          <h2 id="idc-guide-title">{t("guide.title")}</h2>
          <p className={s.guideIntro}>{t("guide.introduction")}</p>
          <div className={s.guideGrid}>
            {(["pitch", "length", "ends", "inquiry"] as const).map((topic) => (
              <article key={topic} className={s.guideArticle}>
                <h3>{t(`guide.items.${topic}.title`)}</h3>
                <p>{t(`guide.items.${topic}.description`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={s.inquiry} aria-labelledby="idc-inquiry-title">
          <div className={s.inquiryIntro}>
            <p className={s.eyebrow}>{t("form.eyebrow")}</p>
            <h2 ref={inquiryRef} id="idc-inquiry-title" tabIndex={-1}>
              {t("form.title")}
            </h2>
            <p>{t("form.description")}</p>
            <div className={s.included}>
              <FileCheck2 size={20} aria-hidden="true" />
              <div>
                <strong>{t("form.included")}</strong>
                <span>
                  {t("form.includedDescription", {
                    pins: config.pins,
                    length: config.length,
                  })}
                </span>
              </div>
            </div>
            <p className={s.formNote}>{t("form.confirmation")}</p>
          </div>
          {inquiry.isSuccess ? (
            <div className={s.success} role="status">
              <span>
                <Check size={26} aria-hidden="true" />
              </span>
              <h3>{t("form.successTitle")}</h3>
              <p>{t("form.success")}</p>
              <button
                type="button"
                className={s.secondaryButton}
                onClick={() => inquiry.resetStatus()}
              >
                {t("form.another")}
              </button>
            </div>
          ) : (
            <form id="idc-inquiry" onSubmit={submit} className={s.inquiryForm}>
              <fieldset disabled={inquiry.isSubmitting || isGeneratingPdf}>
                <legend className={s.srOnly}>{t("form.title")}</legend>
                <div className={s.formGrid}>
                  <label className={s.field}>
                    {t("form.name")} *
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={160}
                      pattern=".*\S.*"
                    />
                  </label>
                  <label className={s.field}>
                    {t("form.email")} *
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                    />
                  </label>
                  <label className={s.field}>
                    {t("form.company")}
                    <input
                      name="company"
                      autoComplete="organization"
                      maxLength={200}
                    />
                  </label>
                  <label className={s.field}>
                    {t("form.phone")}
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      maxLength={80}
                    />
                  </label>
                </div>
                <label className={s.field}>
                  {t("form.message")}
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={6000}
                    placeholder={t("form.messagePlaceholder")}
                  />
                </label>
                <div className={s.upload}>
                  <Paperclip size={17} aria-hidden="true" />
                  <label>
                    {t("form.file")}
                    <input
                      ref={fileRef}
                      type="file"
                      name="file"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setFileName(file?.name || "");
                        setFormError(
                          file && file.size > IDC_FILE_LIMIT
                            ? t("form.fileError")
                            : "",
                        );
                      }}
                      aria-describedby="idc-file-help"
                    />
                  </label>
                  {fileName && <span>{fileName}</span>}
                </div>
                <p id="idc-file-help" className={s.fieldHelp}>
                  {t("form.fileHelp")}
                </p>
                {(formError || inquiry.isError) && (
                  <p className={s.error} role="alert">
                    {formError || t("form.error")}
                  </p>
                )}
                <div className={s.submitRow}>
                  <p>{t("form.privacy")}</p>
                  <button
                    type="submit"
                    className={s.primaryButton}
                    disabled={inquiry.isSubmitting || isGeneratingPdf}
                  >
                    {inquiry.isSubmitting ? (
                      <LoaderCircle className={s.spinner} size={17} />
                    ) : (
                      <Send size={17} />
                    )}
                    {t(
                      inquiry.isSubmitting ? "form.submitting" : "form.submit",
                    )}
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </section>
        <div className={s.bottomLink}>
          <p>{t("otherNeeds")}</p>
          <Link href="/sourcing">
            {t("sourcing")}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
