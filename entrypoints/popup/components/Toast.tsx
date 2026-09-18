type ToastProps = {
  message: string | null;
};

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-x-5 bottom-5 z-20 flex justify-center"
    >
      <p className="rounded-row border border-glass-edge-soft bg-glass-element px-3 py-2 text-[11px] leading-[1.4] text-ink backdrop-blur-[20px]">
        {message}
      </p>
    </div>
  );
}
