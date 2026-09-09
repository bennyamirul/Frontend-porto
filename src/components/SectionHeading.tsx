type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

/**
 * Menyatukan gaya judul section agar halaman terasa konsisten.
 * Dipakai di home dan route detail karena portfolio memiliki beberapa section dengan struktur teks serupa.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-black sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 leading-7 text-gray-600">{description}</p>
      ) : null}
    </div>
  );
}
