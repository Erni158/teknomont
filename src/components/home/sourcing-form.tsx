"use client";

import { useRef } from "react";

import {
  CheckCircle2,
  FileText,
  Loader2,
  Paperclip,
  Send,
  X,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useInquirySubmit } from "@/hooks/use-inquiry-submit";

type FormValues = {
  partNumber: string;
  quantity: string;
  email: string;
  message?: string;
  file?: File;
};

export function SourcingForm() {
  const t = useTranslations("Home.sourcing.form");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { submit, isSubmitting, isSuccess, error, resetStatus } =
    useInquirySubmit();

  const formSchema = z.object({
    partNumber: z.string().min(1, t("validation.partNumber")),

    quantity: z.string().min(1, t("validation.quantity")),

    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),

    message: z.string().optional(),

    file: z.any().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      partNumber: "",
      quantity: "",
      email: "",
      message: "",
      file: undefined,
    },
  });

  const selectedFile = watch("file") as File | undefined;

  async function onSubmit(data: FormValues) {
    resetStatus();

    try {
      await submit({
        type: "sourcing",

        fields: {
          partNumber: data.partNumber,
          quantity: data.quantity,
          email: data.email,
          message: data.message,
        },

        file: selectedFile ?? null,

        fallbackError: t("error"),
      });

      reset();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      // Komunikat błędu jest już
      // obsługiwany przez useInquirySubmit.
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    resetStatus();

    const file = event.target.files?.[0];

    if (!file) {
      setValue("file", undefined);
      return;
    }

    setValue("file", file, {
      shouldValidate: true,
    });
  }

  function removeFile() {
    setValue("file", undefined, {
      shouldValidate: true,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    resetStatus();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        rounded-[18px]
        border border-[#d8e4eb]
        bg-white
        p-4
        shadow-[0_16px_45px_rgba(7,29,51,0.06)]

        sm:p-6

        lg:p-7
      "
    >
      {/* TOP ROW */}
      <div
        className="
          grid gap-4

          md:grid-cols-[1.35fr_0.65fr]

          lg:gap-5
        "
      >
        {/* PART NUMBER */}
        <div>
          <label
            htmlFor="partNumber"
            className="
              mb-2
              block
              text-[12px]
              font-extrabold
              text-[var(--foreground)]
            "
          >
            {t("partNumber.label")}
          </label>

          <input
            id="partNumber"
            type="text"
            placeholder={t("partNumber.placeholder")}
            disabled={isSubmitting}
            {...register("partNumber", {
              onChange: resetStatus,
            })}
            className="
              h-11
              w-full
              rounded-lg
              border border-[#d8e3e9]
              bg-white
              px-4
              text-[14px]
              text-[var(--foreground)]
              outline-none
              transition

              placeholder:text-[#9aaab5]

              focus:border-[var(--primary)]
              focus:ring-2
              focus:ring-[var(--primary)]/10

              disabled:cursor-not-allowed
              disabled:bg-[#f6f8f9]
            "
          />

          {errors.partNumber && (
            <p className="mt-1.5 text-[12px] text-red-600">
              {errors.partNumber.message}
            </p>
          )}
        </div>

        {/* QUANTITY */}
        <div>
          <label
            htmlFor="quantity"
            className="
              mb-2
              block
              text-[12px]
              font-extrabold
              text-[var(--foreground)]
            "
          >
            {t("quantity.label")}
          </label>

          <input
            id="quantity"
            type="text"
            inputMode="numeric"
            placeholder={t("quantity.placeholder")}
            disabled={isSubmitting}
            {...register("quantity", {
              onChange: resetStatus,
            })}
            className="
              h-11
              w-full
              rounded-lg
              border border-[#d8e3e9]
              bg-white
              px-4
              text-[14px]
              text-[var(--foreground)]
              outline-none
              transition

              placeholder:text-[#9aaab5]

              focus:border-[var(--primary)]
              focus:ring-2
              focus:ring-[var(--primary)]/10

              disabled:cursor-not-allowed
              disabled:bg-[#f6f8f9]
            "
          />

          {errors.quantity && (
            <p className="mt-1.5 text-[12px] text-red-600">
              {errors.quantity.message}
            </p>
          )}
        </div>
      </div>

      {/* EMAIL */}
      <div className="mt-4 lg:mt-5">
        <label
          htmlFor="email"
          className="
            mb-2
            block
            text-[12px]
            font-extrabold
            text-[var(--foreground)]
          "
        >
          {t("email.label")}
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("email.placeholder")}
          disabled={isSubmitting}
          {...register("email", {
            onChange: resetStatus,
          })}
          className="
            h-11
            w-full
            rounded-lg
            border border-[#d8e3e9]
            bg-white
            px-4
            text-[14px]
            text-[var(--foreground)]
            outline-none
            transition

            placeholder:text-[#9aaab5]

            focus:border-[var(--primary)]
            focus:ring-2
            focus:ring-[var(--primary)]/10

            disabled:cursor-not-allowed
            disabled:bg-[#f6f8f9]
          "
        />

        {errors.email && (
          <p className="mt-1.5 text-[12px] text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* MESSAGE */}
      <div className="mt-4 lg:mt-5">
        <label
          htmlFor="message"
          className="
            mb-2
            block
            text-[12px]
            font-extrabold
            text-[var(--foreground)]
          "
        >
          {t("message.label")}
        </label>

        <textarea
          id="message"
          rows={4}
          placeholder={t("message.placeholder")}
          disabled={isSubmitting}
          {...register("message", {
            onChange: resetStatus,
          })}
          className="
            min-h-[110px]
            w-full
            resize-y
            rounded-lg
            border border-[#d8e3e9]
            bg-white
            px-4 py-3
            text-[14px]
            leading-6
            text-[var(--foreground)]
            outline-none
            transition

            placeholder:text-[#9aaab5]

            focus:border-[var(--primary)]
            focus:ring-2
            focus:ring-[var(--primary)]/10

            disabled:cursor-not-allowed
            disabled:bg-[#f6f8f9]
          "
        />
      </div>

      {/* FILE */}
      <div className="mt-4 lg:mt-5">
        <p
          className="
            mb-2
            text-[12px]
            font-extrabold
            text-[var(--foreground)]
          "
        >
          {t("file.label")}
        </p>

        {!selectedFile ? (
          <label
            className="
              flex
              min-h-[72px]
              cursor-pointer
              items-center
              justify-center
              gap-3
              rounded-lg
              border
              border-dashed
              border-[#cbdbe4]
              bg-[#f8fafb]
              px-4
              text-center
              transition

              hover:border-[var(--primary)]
              hover:bg-[#f3f8fb]
            "
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              disabled={isSubmitting}
              accept="
                .pdf,
                .jpg,
                .jpeg,
                .png,
                .webp,
                .doc,
                .docx,
                .xls,
                .xlsx
              "
              onChange={handleFileChange}
            />

            <Paperclip
              className="
                size-4
                shrink-0
                text-[var(--primary)]
              "
              strokeWidth={1.8}
            />

            <div>
              <p
                className="
                  text-[13px]
                  font-bold
                  text-[var(--foreground)]
                "
              >
                {t("file.action")}
              </p>

              <p
                className="
                  mt-1
                  text-[11px]
                  text-[var(--muted-foreground)]
                "
              >
                {t("file.description")}
              </p>
            </div>
          </label>
        ) : (
          <div
            className="
              flex
              min-h-[72px]
              items-center
              justify-between
              gap-4
              rounded-lg
              border border-[#d8e4eb]
              bg-[#f8fafb]
              px-4 py-3
            "
          >
            <div
              className="
                flex min-w-0
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#edf5f9]
                  text-[var(--primary)]
                "
              >
                <FileText className="size-4" strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-[13px]
                    font-bold
                    text-[var(--foreground)]
                  "
                >
                  {selectedFile.name}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[11px]
                    text-[var(--muted-foreground)]
                  "
                >
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              disabled={isSubmitting}
              aria-label={t("file.remove")}
              className="
                flex size-9
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[#728692]
                transition

                hover:bg-white
                hover:text-red-600

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* STATUS */}
      {isSuccess && (
        <div
          className="
            mt-4
            flex items-start
            gap-3
            rounded-lg
            border border-emerald-200
            bg-emerald-50
            px-4 py-3
          "
        >
          <CheckCircle2
            className="
              mt-0.5
              size-5
              shrink-0
              text-emerald-600
            "
          />

          <div>
            <p className="text-[13px] font-extrabold text-emerald-900">
              {t("success.title")}
            </p>

            <p className="mt-1 text-[12px] leading-5 text-emerald-800">
              {t("success.description")}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          className="
            mt-4
            rounded-lg
            border border-red-200
            bg-red-50
            px-4 py-3
            text-[12px]
            font-medium
            leading-5
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* BOTTOM */}
      <div
        className="
          mt-5
          grid gap-3

          sm:grid-cols-[1fr_auto]
          sm:items-center
        "
      >
        <p
          className="
            text-[10px]
            leading-4
            text-[var(--muted-foreground)]

            sm:max-w-[520px]
          "
        >
          {t("privacy")}
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            inline-flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[var(--primary)]
            px-6
            text-[12px]
            font-extrabold
            uppercase
            tracking-[0.02em]
            text-white
            transition

            hover:brightness-95

            disabled:cursor-not-allowed
            disabled:opacity-65

            sm:w-auto
            sm:min-w-[185px]
          "
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="
                  size-4
                  animate-spin
                "
              />

              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="size-4" strokeWidth={1.8} />

              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
