import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "../game/GameApp";
import { strings } from "../game/strings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: strings.meta.title },
      { name: "description", content: strings.meta.description },
      { property: "og:title", content: strings.meta.title },
      { property: "og:description", content: strings.meta.ogDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <GameApp />;
}
