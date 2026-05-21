type Props = {
  className?: string;
  small?: boolean;
};

export default function Mascot({ className = "", small = false }: Props) {
  return (
    <img
      src={small ? "/majorica-frog-sm.webp" : "/majorica-frog.webp"}
      alt="maj0rika — Majo Rika witch frog"
      className={`object-contain ${className}`}
      draggable={false}
      decoding="async"
      loading="lazy"
    />
  );
}
