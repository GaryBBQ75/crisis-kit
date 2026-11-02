import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export type Rappelable = { id: string; nom: string; peremption?: string };

/** Les notifications locales n'existent que dans l'app Android ou iOS. */
export const rappelsDisponibles = Capacitor.isNativePlatform();

const AVANTS_JOURS = [30, 7];

function entier(texte: string): number {
  let h = 0;
  for (let i = 0; i < texte.length; i++) h = (h * 31 + texte.charCodeAt(i)) | 0;
  return Math.abs(h) % 2_000_000_000;
}

function dateLocale(iso: string): Date | null {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 9, 0, 0);
}

/**
 * Programme un rappel 30 jours puis 7 jours avant chaque date de péremption.
 * Tout reste sur le téléphone, aucune donnée n'est envoyée.
 */
export async function programmerRappels(items: Rappelable[]): Promise<void> {
  if (!rappelsDisponibles) return;

  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') return;

  const en_attente = await LocalNotifications.getPending();
  if (en_attente.notifications.length > 0) {
    await LocalNotifications.cancel({ notifications: en_attente.notifications.map((n) => ({ id: n.id })) });
  }

  const maintenant = Date.now();
  const notifications = items.flatMap((item) => {
    if (!item.peremption) return [];
    const echeance = dateLocale(item.peremption);
    if (!echeance) return [];
    return AVANTS_JOURS.flatMap((jours) => {
      const at = new Date(echeance.getTime() - jours * 24 * 3600 * 1000);
      if (at.getTime() <= maintenant) return [];
      return [
        {
          id: entier(`${item.id}:${jours}`),
          title: 'À renouveler bientôt',
          body: `${item.nom} périme dans ${jours} jours.`,
          schedule: { at },
        },
      ];
    });
  });

  if (notifications.length > 0) await LocalNotifications.schedule({ notifications });
}
