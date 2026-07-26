import {
  faHouse,
  faBriefcase,
  faCalendarDays,
  faNewspaper,
  faUsers,
  faCircleInfo,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { NavItem } from '../core/models/nav-item.model';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', icon: faHouse, route: '' },
  { label: 'Emprendimientos', icon: faBriefcase, route: 'emprendimientos' },
  { label: 'Eventos', icon: faCalendarDays, route: 'eventos' },
  { label: 'Noticias', icon: faNewspaper, route: 'noticias' },
  { label: 'Comunidad', icon: faUsers, route: 'comunidad' },
  { label: 'Sobre Nosotros', icon: faCircleInfo, route: 'sobre-nosotros' },
  { label: 'Contacto', icon: faPhone, route: 'contacto' },
];
