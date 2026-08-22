import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: number | string;
};

export function Container({
  children,
  className = "",
  maxWidth = 1280,
}: ContainerProps) {
  const resolvedMaxWidth =
    typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

  return (
    <div
      className={`mx-auto w-full px-5 md:px-8 xl:px-10 ${className}`}
      style={{
        maxWidth: resolvedMaxWidth,
      }}
    >
      {children}
    </div>
  );
}
