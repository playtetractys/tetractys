"use client";

export function MenuItem({
  icon,
  title,
  action,
  isActive = null,
}: {
  icon?: string | React.ReactNode;
  title?: string;
  action?: () => void;
  isActive?: (() => boolean) | null;
}) {
  return (
    <button
      className={`flex items-center justify-center menu-item${isActive && isActive() ? " is-active" : ""}`}
      onClick={action}
      title={title}
    >
      {typeof icon === "string" ? <i className={`ri-${icon}`} /> : icon}
    </button>
  );
}
