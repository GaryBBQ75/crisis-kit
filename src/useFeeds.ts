import { useEffect, useRef, useState, useCallback } from "react";
import { get, set } from "idb-keyval";
import { sources, type Feed } from "./feeds";
export function useFeeds(paused: boolean) {
  const [feeds, update] = useState<Record<string, Feed>>({});
  const [errors, fail] = useState<Record<string, string>>({});
  const [loading, busy] = useState(false);
  const [online, network] = useState(navigator.onLine);
  const lock = useRef(false);
  const loaded = useRef(false);
  const refresh = useCallback(async () => {
    if (lock.current || !navigator.onLine) return;
    lock.current = true;
    busy(true);
    await Promise.all(
      sources.map(async (s) => {
        try {
          const r = await fetch(s.url, {
            signal: AbortSignal.timeout(18000),
            cache: "no-store",
          });
          if (!r.ok) throw Error();
          const f = { received: Date.now(), events: s.parse(await r.json()) };
          update((prev) => ({ ...prev, [s.id]: f }));
          await set("feed-v2-" + s.id, f);
          fail((prev) => ({ ...prev, [s.id]: "" }));
        } catch {
          fail((prev) => ({
            ...prev,
            [s.id]:
              "Actualisation ou sauvegarde impossible. Dernier relevé conservé.",
          }));
        }
      }),
    );
    lock.current = false;
    busy(false);
  }, []);
  useEffect(() => {
    let active = true;
    (async () => {
      const saved: Record<string, Feed> = {};
      for (const s of sources) {
        try {
          const f = await get<Feed>("feed-v2-" + s.id);
          if (f?.events && Array.isArray(f.events)) saved[s.id] = f;
        } catch {}
      }
      if (!active) return;
      update(saved);
      loaded.current = true;
      if (!paused) void refresh();
    })();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const change = () => network(navigator.onLine);
    window.addEventListener("online", change);
    window.addEventListener("offline", change);
    return () => {
      window.removeEventListener("online", change);
      window.removeEventListener("offline", change);
    };
  }, []);
  useEffect(() => {
    if (paused) return;
    const run = () => {
      if (
        loaded.current &&
        navigator.onLine &&
        document.visibilityState === "visible"
      )
        void refresh();
    };
    const t = setInterval(run, 300000);
    window.addEventListener("online", run);
    document.addEventListener("visibilitychange", run);
    return () => {
      clearInterval(t);
      window.removeEventListener("online", run);
      document.removeEventListener("visibilitychange", run);
    };
  }, [paused, refresh]);
  return {
    feeds,
    errors,
    loading,
    online,
    refresh,
    events: Object.values(feeds)
      .flatMap((f) => f.events)
      .sort((a, b) => b.time - a.time),
  };
}
export type FeedState = ReturnType<typeof useFeeds>;
