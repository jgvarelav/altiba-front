import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faLeaf,
  faHand,
  faMountain,
  faLightbulb,
  faUsers,
  faTag,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Maps the free-text "icono" value an admin types in Strapi to a FontAwesome
 * icon. Add an entry here whenever a new icon name is introduced in the
 * Strapi admin — anything unrecognized falls back to a generic tag icon
 * instead of breaking the page.
 */
const CATEGORIA_ICONS: Record<string, IconDefinition> = {
  leaf: faLeaf,
  hand: faHand,
  mountain: faMountain,
  lightbulb: faLightbulb,
  users: faUsers,
};

export function resolveCategoriaIcon(icono: string): IconDefinition {
  return CATEGORIA_ICONS[icono] ?? faTag;
}
