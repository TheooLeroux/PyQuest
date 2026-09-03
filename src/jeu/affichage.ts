// Petits formatages d'affichage, réutilisés par plusieurs écrans.

export function formaterDuree(totalSec: number): string {
  const heures = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  if (heures > 0) return `${heures} h ${String(minutes).padStart(2, '0')}`;
  if (minutes > 0) return `${minutes} min`;
  return `${Math.max(0, Math.floor(totalSec))} s`;
}

export function formaterDate(iso: string, langue: 'fr' | 'en'): string {
  try {
    return new Date(iso).toLocaleDateString(langue === 'fr' ? 'fr-FR' : 'en-GB', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return '';
  }
}
