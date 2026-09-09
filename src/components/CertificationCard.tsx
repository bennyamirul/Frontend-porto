import type { Certification } from "@/lib/api";

type CertificationCardProps = {
  certification: Certification;
};

/**
 * Menampilkan satu certification dengan logo issuer, metadata, dan link credential jika tersedia.
 * Dipakai halaman certificates dan preview home agar fallback visual tetap konsisten saat ImageURL kosong.
 */
export function CertificationCard({ certification }: CertificationCardProps) {
  const issuerInitial =
    certification.issuer.trim().charAt(0).toUpperCase() || "C";

  return (
    <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-black/20">
      <div className="flex items-start gap-4">
        {certification.imageUrl ? (
          // img dipakai karena logo issuer berasal dari backend dan domain eksternalnya bisa berbeda-beda.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`${certification.issuer} logo`}
            className="h-12 w-12 rounded-xl border border-black/10 bg-white object-contain p-1"
            src={certification.imageUrl}
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-gray-100 font-mono text-lg font-semibold text-black">
            {issuerInitial}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-7 text-black">
            {certification.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{certification.issuer}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
          {certification.issueDate || "Issue date TBA"}
        </p>
        {certification.credentialUrl ? (
          <a
            className="text-sm font-medium text-gray-700 transition hover:text-black"
            href={certification.credentialUrl}
            rel="noreferrer"
            target="_blank"
          >
            Lihat Sertifikat
          </a>
        ) : null}
      </div>
    </article>
  );
}
