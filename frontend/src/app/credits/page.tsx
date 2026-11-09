import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { imageCredits } from "@/data/images";

export const metadata: Metadata = {
  title: "Image credits",
  robots: { index: false, follow: true },
  alternates: { canonical: "/credits" },
};

export default function CreditsPage() {
  const credits = imageCredits();
  return (
    <ProsePage title="Image credits">
      <p>Pictures on this site that are not the studio&apos;s own, with their authors and licences.</p>
      <ul>
        {credits.map((c) => (
          <li key={c.id}>
            “{c.title}” by {c.by}, {c.licence}.{" "}
            <a href={c.page} target="_blank" rel="noopener noreferrer">
              Source
            </a>
            {c.licenceUrl && (
              <>
                {", "}
                <a href={c.licenceUrl} target="_blank" rel="noopener noreferrer">
                  licence
                </a>
              </>
            )}
            .
          </li>
        ))}
      </ul>
    </ProsePage>
  );
}
