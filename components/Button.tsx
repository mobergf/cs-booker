import { ButtonHTMLAttributes } from "react";

export default function Button({
  children,
  className,
  variant,
  ...rest
}: {
  variant?: "secondary" | "blue";
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const css =
    variant === "secondary"
      ? `rounded-md inline-flex items-center justify-center border-none bg-primary px-4 py-2 text-lg text-white transition-colors hover:bg-primary-dark focus:bg-primary-dark focus:outline-none disabled:cursor-not-allowed md:px-8 ${className}`
      : `rounded-md inline-flex items-center justify-center border-none bg-primary px-4 py-2 text-lg text-white transition-colors hover:bg-primary-dark focus:bg-secondary-dark focus:outline-none disabled:cursor-not-allowed md:px-8 ${className}`;

  return (
    <button className={css} {...rest}>
      {children}
    </button>
  );
}
