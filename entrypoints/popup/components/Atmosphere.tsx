export function Atmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -top-[90px] -left-[200px] h-[560px] w-[780px] rounded-full bg-atmosphere-glow opacity-75 blur-[150px]" />
      <div className="absolute top-[80px] left-[40px] h-[460px] w-[640px] rounded-full bg-atmosphere-highlight opacity-45 blur-[150px]" />
    </div>
  );
}
