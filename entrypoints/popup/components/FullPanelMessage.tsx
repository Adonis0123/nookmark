type FullPanelMessageProps = {
  title?: string;
  body?: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function FullPanelMessage({
  title,
  body,
  hint,
  actionLabel,
  onAction,
}: FullPanelMessageProps) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2 py-6">
      {title ? (
        <h2 className="text-[15px] leading-[1.4] font-semibold text-ink">{title}</h2>
      ) : null}
      {body ? (
        <p className="text-[11px] leading-[1.4] text-ink-muted">{body}</p>
      ) : null}
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="w-fit cursor-pointer text-[12.5px] leading-[1.4] text-accent"
        >
          {actionLabel}
        </button>
      ) : null}
      {hint ? (
        <p className="text-[11px] leading-[1.4] text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}
