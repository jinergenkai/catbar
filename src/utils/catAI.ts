// Simple behavior logic cho mèo
export function getCatMood(hunger: number): string {
  if (hunger > 5) return 'hungry';
  if (hunger > 2) return 'neutral';
  return 'happy';
}