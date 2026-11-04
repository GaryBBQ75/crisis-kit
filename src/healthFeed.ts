export type HealthBulletin = { title: string; time: number; url: string };
export type HealthSnapshot = { received: number; items: HealthBulletin[] };
export const healthURL =
  "https://www.who.int/api/news/diseaseoutbreaknews?" +
  new URLSearchParams({
    $top: "20",
    $orderby: "PublicationDate desc",
    $select: "Title,PublicationDate,ItemDefaultUrl",
  });
export function parseHealth(d: unknown): HealthBulletin[] {
  if (!d || !Array.isArray((d as any).value))
    throw Error("Bulletins invalides");
  return (d as any).value
    .flatMap((v: any) => {
      if (
        typeof v.Title !== "string" ||
        !Number.isFinite(Date.parse(v.PublicationDate)) ||
        typeof v.ItemDefaultUrl !== "string" ||
        !/^\/[a-zA-Z0-9_-]+$/.test(v.ItemDefaultUrl)
      )
        return [];
      return [
        {
          title: v.Title,
          time: Date.parse(v.PublicationDate),
          url:
            "https://www.who.int/emergencies/disease-outbreak-news/item" +
            v.ItemDefaultUrl,
        },
      ];
    })
    .sort((a: HealthBulletin, b: HealthBulletin) => b.time - a.time);
}
