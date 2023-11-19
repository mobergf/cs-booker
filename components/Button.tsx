import { ButtonHTMLAttributes } from "react";

export default function Button({
  children,
  className,
  variant,
  ...rest
}: {
  variant?: "secondary";
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const css =
    variant === "secondary"
      ? `rounded-[3px] inline-flex items-center justify-center bg-white dark:bg-transparent border-2 border-primary px-2 md:h-10 h-[30px] text-sm transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white dark:focus:bg-primary focus:bg-primary-dark focus:text-white focus:outline-none disabled:cursor-not-allowed md:px-4 ${className}`
      : `rounded-[3px] inline-flex items-center justify-center border-none bg-primary px-2 md:h-10 h-[30px] text-sm text-white transition-colors hover:bg-primary-dark focus:bg-primary-dark focus:outline-none disabled:cursor-not-allowed md:px-4 ${className}`;

  return (
    <button className={css} {...rest}>
      {children}
    </button>
  );
}
