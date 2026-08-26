"use client";

import { trackLead } from "@/lib/analytics";
import { useCallback, useState } from "react";

type InquiryType = "sourcing" | "contact" | "b2b";

type SubmitInquiryOptions = {
  type: InquiryType;

  fields: Record<string, string | number | null | undefined>;

  file?: File | null;

  fallbackError?: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function useInquirySubmit() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async ({
      type,
      fields,
      file,
      fallbackError = "Failed to submit form.",
    }: SubmitInquiryOptions) => {
      setStatus("loading");
      setError(null);

      try {
        const formData = new FormData();

        formData.append("type", type);

        for (const [key, value] of Object.entries(fields)) {
          if (value === undefined || value === null || value === "") {
            continue;
          }

          formData.append(key, String(value));
        }

        if (file) {
          formData.append("file", file);
        }

        const response = await fetch("/api/inquiry", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? fallbackError);
        }

        trackLead(type);

        setStatus("success");

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : fallbackError;

        setError(message);
        setStatus("error");

        throw err;
      }
    },
    [],
  );

  const resetStatus = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return {
    submit,

    status,

    error,

    isSubmitting: status === "loading",

    isSuccess: status === "success",

    isError: status === "error",

    resetStatus,
  };
}
