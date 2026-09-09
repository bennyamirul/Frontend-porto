"use client";

import { FormEvent, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { sendMessage } from "@/lib/api";

/**
 * Menampilkan form contact dan mengirim pesan ke backend.
 * Dipakai route "/contact" supaya visitor bisa mengirim name, email, dan message ke POST /api/messages.
 */
export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Menangani submit form tanpa refresh halaman.
   * preventDefault dipakai karena React mengelola request POST secara manual lewat helper API.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      await sendMessage({ name, email, message });
      setStatus("success");
      setStatusMessage(
        "Pesan berhasil dikirim. Terima kasih, saya akan cek secepatnya.",
      );
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setStatusMessage(
        "Pesan belum bisa dikirim saat ini. Silakan coba lagi nanti.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
      <Reveal>
        <SectionHeading
          description="Ceritakan project, kebutuhan, atau ide yang ingin kamu bangun. Saya akan membalas secepatnya."
          eyebrow="Contact"
          title="Tell me what you are building."
        />
      </Reveal>
      <Reveal
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
        delay={0.08}
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-accent/60"
              id="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              type="text"
              value={name}
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-accent/60"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              className="mt-2 min-h-40 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-accent/60"
              id="message"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Share context, goals, timeline, or links."
              required
              value={message}
            />
          </div>
          <button
            className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_14px_28px_rgba(15,118,110,0.15)] transition hover:bg-[#0d6d64] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Sending..." : "Send message"}
          </button>
        </form>
        {status !== "idle" ? (
          <div
            className={`mt-5 rounded-2xl border p-4 text-sm ${
              status === "success"
                ? "border-accent/30 bg-accent-muted text-accent-soft"
                : "border-red-300/30 bg-red-300/10 text-red-100"
            }`}
          >
            {statusMessage}
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
