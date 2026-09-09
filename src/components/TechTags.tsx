type TechTagsProps = {
  items: string[];
};

/**
 * Merender tech stack sebagai kumpulan tag, bukan progress bar.
 * Dipakai di card project, detail project, dan skills supaya teknologi terlihat sebagai kemampuan praktis.
 */
export function TechTags({ items }: TechTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 transition hover:border-black/20 hover:text-black"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
