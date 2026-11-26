/** Original decorative artwork: parallel yarn strands with a copper accent thread. */
export function ThreadArt({ className = '' }: { className?: string }) {
  const strands = Array.from({ length: 22 }, (_, i) => i);
  return (
    <svg className={className} viewBox="0 0 600 500" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      {strands.map((i) => {
        const y = 20 + i * 22;
        return (
          <path
            key={i}
            d={`M0 ${y + 60} C 160 ${y - 40}, 300 ${y + 90}, 600 ${y - 10}`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.08 + (i % 5 === 0 ? 0.12 : 0.04)}
            strokeWidth={i % 5 === 0 ? 1.4 : 0.8}
          />
        );
      })}
      <path d="M0 330 C 170 210, 310 360, 600 250" fill="none" stroke="#c08560" strokeOpacity=".75" strokeWidth="1.6" />
    </svg>
  );
}
