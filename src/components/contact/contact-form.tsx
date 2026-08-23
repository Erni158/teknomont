"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useInquirySubmit } from "@/hooks/use-inquiry-submit";

type FormValues = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
};

export function ContactForm() {
  const t = useTranslations("ContactPage.form");

  const { submit, isSubmitting, isSuccess, error, resetStatus } =
    useInquirySubmit();

  const schema = z.object({
    name: z.string().min(2, t("validation.name")),

    company: z.string().optional(),

    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),

    phone: z.string().optional(),

    message: z.string().min(5, t("validation.message")),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(data: FormValues) {
    resetStatus();

    try {
      await submit({
        type: "contact",

        fields: {
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          message: data.message,
        },

        fallbackError: t("error"),
      });

      reset();
    } catch {
      // Hook obsługuje błąd.
    }
  }

  const inputClassName = `
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
  `;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        rounded-[20px]
        border border-[#d8e4eb]
        bg-[#f7fafb]
        p-5

        sm:p-7

        lg:p-8
      "
    >
      <div className="mb-6">
        <h3
          className="
            text-[22px]
            font-extrabold
            tracking-[-0.03em]
            text-[var(--foreground)]
          "
        >
          {t("title")}
        </h3>

        <p className="mt-2 text-[13px] leading-6 text-[var(--muted-foreground)]">
          {t("description")}
        </p>
      </div>

      <div
        className="
          grid gap-4

          sm:grid-cols-2
        "
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-[12px] font-extrabold text-[var(--foreground)]"
          >
            {t("name.label")}
          </label>

          <input
            id="name"
            type="text"
            disabled={isSubmitting}
            placeholder={t("name.placeholder")}
            {...register("name", {
              onChange: resetStatus,
            })}
            className={inputClassName}
          />

          {errors.name && (
            <p className="mt-1.5 text-[12px] text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="company"
            className="mb-2 block text-[12px] font-extrabold text-[var(--foreground)]"
          >
            {t("company.label")}
          </label>

          <input
            id="company"
            type="text"
            disabled={isSubmitting}
            placeholder={t("company.placeholder")}
            {...register("company", {
              onChange: resetStatus,
            })}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[12px] font-extrabold text-[var(--foreground)]"
          >
            {t("email.label")}
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            placeholder={t("email.placeholder")}
            {...register("email", {
              onChange: resetStatus,
            })}
            className={inputClassName}
          />

          {errors.email && (
            <p className="mt-1.5 text-[12px] text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-[12px] font-extrabold text-[var(--foreground)]"
          >
            {t("phone.label")}
          </label>

          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            disabled={isSubmitting}
            placeholder={t("phone.placeholder")}
            {...register("phone", {
              onChange: resetStatus,
            })}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="message"
          className="mb-2 block text-[12px] font-extrabold text-[var(--foreground)]"
        >
          {t("message.label")}
        </label>

        <textarea
          id="message"
          rows={6}
          disabled={isSubmitting}
          placeholder={t("message.placeholder")}
          {...register("message", {
            onChange: resetStatus,
          })}
          className="
            min-h-[150px]
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

        {errors.message && (
          <p className="mt-1.5 text-[12px] text-red-600">
            {errors.message.message}
          </p>
        )}
      </div>

      {isSuccess && (
        <div
          className="
            mt-4
            flex items-start gap-3
            rounded-lg
            border border-emerald-200
            bg-emerald-50
            px-4 py-3
          "
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />

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
            leading-5
            text-red-700
          "
        >
          {error}
        </div>
      )}

      <div
        className="
          mt-5
          grid gap-4

          sm:grid-cols-[1fr_auto]
          sm:items-center
        "
      >
        <p className="text-[10px] leading-4 text-[var(--muted-foreground)]">
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
            text-white
            transition

            hover:brightness-95

            disabled:cursor-not-allowed
            disabled:opacity-60

            sm:w-auto
            sm:min-w-[180px]
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="size-4" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
