"use client";

import { FormEvent, useRef, useState } from "react";

import { FileText, LockKeyhole, Paperclip, Send, X } from "lucide-react";

import { useTranslations } from "next-intl";

export function SourcingForm() {
  const t = useTranslations("Home.sourcing.form");

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // TODO:
    // Server Action / API / wysyłka maila
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        rounded-[14px]
        border border-[#d6e3ec]
        bg-white/90
        p-4
        shadow-[0_14px_40px_rgba(15,50,76,0.06)]
        backdrop-blur-sm

        sm:rounded-[18px]
        sm:p-6

        lg:p-7
        xl:p-8
      "
    >
      {/* PART */}
      <div>
        <label
          htmlFor="part"
          className="
            block
            text-[12px] font-bold
            text-[var(--foreground)]
            sm:text-[13px]
          "
        >
          {t("partLabel")}
        </label>

        <input
          id="part"
          name="part"
          type="text"
          required
          placeholder={t("partPlaceholder")}
          className="
            mt-1.5
            h-11 w-full
            rounded-lg
            border border-[#d7e2ea]
            bg-white
            px-3.5
            text-[13px]
            text-[var(--foreground)]
            outline-none
            transition
            placeholder:text-[#95a3af]

            focus:border-[var(--primary)]
            focus:ring-4
            focus:ring-[rgba(0,78,138,0.07)]

            sm:mt-2
            sm:h-[52px]
            sm:px-4
            sm:text-sm
          "
        />
      </div>

      {/* QUANTITY + EMAIL */}
      <div
        className="
          mt-3
          grid gap-3

          sm:mt-5
          sm:grid-cols-2
          sm:gap-4
        "
      >
        <div>
          <label
            htmlFor="quantity"
            className="
              block
              text-[12px] font-bold
              text-[var(--foreground)]
              sm:text-[13px]
            "
          >
            {t("quantityLabel")}
          </label>

          <input
            id="quantity"
            name="quantity"
            type="text"
            placeholder={t("quantityPlaceholder")}
            className="
              mt-1.5
              h-11 w-full
              rounded-lg
              border border-[#d7e2ea]
              bg-white
              px-3.5
              text-[13px]
              text-[var(--foreground)]
              outline-none
              transition
              placeholder:text-[#95a3af]

              focus:border-[var(--primary)]
              focus:ring-4
              focus:ring-[rgba(0,78,138,0.07)]

              sm:mt-2
              sm:h-[52px]
              sm:px-4
              sm:text-sm
            "
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="
              block
              text-[12px] font-bold
              text-[var(--foreground)]
              sm:text-[13px]
            "
          >
            {t("emailLabel")}
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            className="
              mt-1.5
              h-11 w-full
              rounded-lg
              border border-[#d7e2ea]
              bg-white
              px-3.5
              text-[13px]
              text-[var(--foreground)]
              outline-none
              transition
              placeholder:text-[#95a3af]

              focus:border-[var(--primary)]
              focus:ring-4
              focus:ring-[rgba(0,78,138,0.07)]

              sm:mt-2
              sm:h-[52px]
              sm:px-4
              sm:text-sm
            "
          />
        </div>
      </div>

      {/* MESSAGE */}
      <div className="mt-3 sm:mt-5">
        <label
          htmlFor="message"
          className="
            block
            text-[12px] font-bold
            text-[var(--foreground)]
            sm:text-[13px]
          "
        >
          {t("messageLabel")}
        </label>

        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={t("messagePlaceholder")}
          className="
            mt-1.5
            w-full resize-none
            rounded-lg
            border border-[#d7e2ea]
            bg-white
            px-3.5 py-2.5
            text-[13px]
            leading-5
            text-[var(--foreground)]
            outline-none
            transition
            placeholder:text-[#95a3af]

            focus:border-[var(--primary)]
            focus:ring-4
            focus:ring-[rgba(0,78,138,0.07)]

            sm:mt-2
            sm:px-4
            sm:py-3
            sm:text-sm
            sm:leading-6
          "
        />
      </div>

      {/* FILE */}
      <div className="mt-3 sm:mt-5">
        <input
          ref={inputRef}
          type="file"
          name="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.xls,.xlsx,.csv"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
          }}
        />

        {!file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="
              flex w-full
              items-center gap-2.5
              rounded-lg
              border border-dashed border-[#c7d8e4]
              bg-[#f7fafc]
              px-3 py-3
              text-left
              transition

              hover:border-[var(--primary)]
              hover:bg-[#f2f7fa]

              sm:gap-3
              sm:px-4
              sm:py-4
            "
          >
            <div
              className="
                flex size-8 shrink-0
                items-center justify-center
                rounded-full
                bg-white
                text-[var(--primary)]

                sm:size-10
              "
            >
              <Paperclip className="size-4 sm:size-[18px]" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[12px] font-bold
                  leading-4
                  text-[var(--foreground)]

                  sm:text-[13px]
                "
              >
                {t("fileTitle")}
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px] leading-4
                  text-[var(--muted-foreground)]

                  sm:text-[11px]
                "
              >
                {t("fileDescription")}
              </p>
            </div>
          </button>
        ) : (
          <div
            className="
              flex items-center
              justify-between gap-3
              rounded-lg
              border border-[#c7d8e4]
              bg-[#f7fafc]
              px-3 py-2.5

              sm:px-4
              sm:py-3
            "
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <FileText
                className="
                  size-4 shrink-0
                  text-[var(--primary)]
                  sm:size-5
                "
              />

              <span
                className="
                  truncate
                  text-[12px] font-semibold
                  sm:text-[13px]
                "
              >
                {file.name}
              </span>
            </div>

            <button
              type="button"
              aria-label={t("removeFile")}
              onClick={() => {
                setFile(null);

                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
              className="
                flex size-8 shrink-0
                items-center justify-center
                rounded-full
                transition
                hover:bg-white
              "
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="
          mt-4
          flex h-11 w-full
          items-center justify-center gap-2
          rounded-lg
          bg-[var(--primary)]
          px-4
          text-[12px] font-extrabold
          uppercase
          tracking-[0.02em]
          text-white
          transition
          hover:brightness-90

          sm:mt-5
          sm:h-[52px]
          sm:px-6
          sm:text-[13px]
        "
      >
        <Send className="size-4" />
        {t("submit")}
      </button>

      {/* PRIVACY */}
      <div
        className="
          mt-3
          flex items-start gap-2
          text-[10px] leading-4
          text-[var(--muted-foreground)]

          sm:mt-4
          sm:text-[11px]
        "
      >
        <LockKeyhole className="mt-0.5 size-3 shrink-0 sm:size-3.5" />

        <span>{t("privacy")}</span>
      </div>
    </form>
  );
}
