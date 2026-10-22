"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Expand,
  Layers2,
  LoaderCircle,
  Minimize2,
  RotateCcw,
  RotateCw,
  Ruler,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { IdcConfiguration } from "@/lib/idc";
import type { createIdcScene, IdcView, ViewerAction } from "./idc-scene";
import s from "./idc-studio.module.css";

export function IdcViewer({ config }: { config: IdcConfiguration }) {
  const t = useTranslations("IdcStudio.viewer");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);
  const dimensionRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<ReturnType<typeof createIdcScene> | null>(null);
  const configRef = useRef(config);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "lost">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<IdcView>("perspective");
  const [dimensions, setDimensions] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [expanded]);

  useEffect(() => {
    configRef.current = config;
    sceneRef.current?.update(config);
  }, [config]);

  useEffect(() => {
    let cancelled = false;
    let scene: ReturnType<typeof createIdcScene> | undefined;
    import("./idc-scene")
      .then(({ createIdcScene }) => {
        if (
          cancelled ||
          !canvasRef.current ||
          !stageRef.current ||
          !aRef.current ||
          !bRef.current ||
          !dimensionRef.current
        )
          return;
        scene = createIdcScene(
          canvasRef.current,
          stageRef.current,
          {
            A: aRef.current,
            B: bRef.current,
            dimension: dimensionRef.current,
          },
          configRef.current,
          setView,
          (lost) => setStatus(lost ? "lost" : "ready"),
        );
        sceneRef.current = scene;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [attempt]);

  function retry() {
    setStatus("loading");
    setDimensions(true);
    setView("perspective");
    setAttempt((value) => value + 1);
  }
  function action(value: ViewerAction) {
    sceneRef.current?.action(value);
  }

  return (
    <section
      className={`${s.viewer} ${expanded ? s.expanded : ""}`}
      aria-label={t("title")}
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded || undefined}
      onKeyDown={(event) => {
        if (!expanded) return;
        if (event.key === "Escape") {
          event.preventDefault();
          setExpanded(false);
        }
        if (event.key === "Tab") {
          const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "button:not(:disabled)",
            ),
          ).filter((button) => button.getClientRects().length > 0);
          const first = buttons[0],
            last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      <div className={s.viewerHeader}>
        <div>
          <Box size={17} aria-hidden="true" />
          <strong>{t("title")}</strong>
          <span className={s.liveDot} aria-hidden="true" />
        </div>
        <button
          type="button"
          className={s.iconButton}
          onClick={() => setExpanded(!expanded)}
          aria-pressed={expanded}
          aria-label={expanded ? t("collapse") : t("expand")}
        >
          {expanded ? <Minimize2 size={18} /> : <Expand size={18} />}
        </button>
      </div>
      <div className={s.stage} ref={stageRef}>
        <canvas
          ref={canvasRef}
          aria-label={t("canvas", { pins: config.pins, length: config.length })}
          aria-describedby="idc-viewer-help"
        />
        <div className={s.stageHint} aria-hidden="true">
          <span>IDC / RIBBON</span>
          <small>{t("hint")}</small>
        </div>
        <span ref={aRef} className={s.connectorLabel} hidden aria-hidden="true">
          A
        </span>
        <span ref={bRef} className={s.connectorLabel} hidden aria-hidden="true">
          B
        </span>
        <span
          ref={dimensionRef}
          className={s.dimensionLabel}
          hidden
          aria-hidden="true"
        >
          L {config.length} mm
        </span>
        {status !== "ready" && (
          <div className={s.viewerOverlay} role="status">
            {status === "loading" ? (
              <LoaderCircle
                className={s.spinner}
                size={24}
                aria-hidden="true"
              />
            ) : (
              <Box size={28} aria-hidden="true" />
            )}
            <p>{t(status)}</p>
            {(status === "error" || status === "lost") && (
              <button
                type="button"
                className={s.secondaryButton}
                onClick={retry}
              >
                {t("retry")}
              </button>
            )}
          </div>
        )}
        <div className={s.cameraTabs} role="group" aria-label={t("cameras")}>
          {(["perspective", "top", "endA"] as const).map((value) => (
            <button
              key={value}
              type="button"
              disabled={status !== "ready"}
              aria-pressed={view === value}
              onClick={() => sceneRef.current?.setView(value)}
            >
              {t(value)}
            </button>
          ))}
        </div>
      </div>
      <div className={s.viewerTools} role="group" aria-label={t("controls")}>
        {(
          [
            { action: "rotateLeft", Icon: RotateCcw },
            { action: "rotateRight", Icon: RotateCw },
            { action: "zoomIn", Icon: ZoomIn },
            { action: "zoomOut", Icon: ZoomOut },
          ] as const
        ).map(({ action: value, Icon }) => (
          <button
            key={value}
            type="button"
            className={s.toolButton}
            disabled={status !== "ready"}
            onClick={() => action(value)}
            title={t(value)}
            aria-label={t(value)}
          >
            <Icon size={19} aria-hidden="true" />
          </button>
        ))}
        <span className={s.toolDivider} />
        <button
          type="button"
          className={s.toolButton}
          disabled={status !== "ready"}
          onClick={() => {
            sceneRef.current?.setDimensions(!dimensions);
            setDimensions(!dimensions);
          }}
          aria-label={t("dimensions")}
          aria-pressed={dimensions}
        >
          <Ruler size={18} aria-hidden="true" />
          <span>{t("dimensions")}</span>
        </button>
        <button
          type="button"
          className={s.toolButton}
          disabled={status !== "ready"}
          onClick={() => sceneRef.current?.setView("perspective")}
          aria-label={t("reset")}
          title={t("reset")}
        >
          <Layers2 size={18} aria-hidden="true" />
        </button>
      </div>
      <p id="idc-viewer-help" className={s.viewerHelp}>
        {t("help")}
      </p>
    </section>
  );
}
