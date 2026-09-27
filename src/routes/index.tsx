import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "../game/GameApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THE SIGNAL FILES — CASE 01: THE VIRAL LIE" },
      { name: "description", content: "Διερεύνησε μια viral ψευδή ιστορία και μάθε να ξεχωρίζεις τη διάδοση από τον συντονισμό." },
      { property: "og:title", content: "THE SIGNAL FILES — CASE 01: THE VIRAL LIE" },
      { property: "og:description", content: "Ένα διαδραστικό παιχνίδι έρευνας για την πειθαρχία τεκμηρίων και την παραπληροφόρηση." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <GameApp />;
}
