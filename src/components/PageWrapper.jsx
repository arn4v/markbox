import clsx from "clsx";

export function PageWrapper({ children, className = "" }) {
  return (
    <div
      className={clsx([
        "flex w-screen h-screen overflow-hidden bg-gray-900",
        className,
      ])}>
      {children}
    </div>
  );
}
