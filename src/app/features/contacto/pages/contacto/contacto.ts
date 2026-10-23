import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebookF, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';
import { SOPORTE } from '../../../../core/models/soporte.const';

interface DatoContacto {
  icon: IconDefinition;
  label: string;
  value: string;
  href: string;
}

interface RedSocial {
  icon: IconDefinition;
  label: string;
  href: string;
}

/**
 * TODO: falta el correo real y los enlaces de redes sociales — reemplazar
 * cuando se tengan.
 */
@Component({
  selector: 'app-contacto',
  imports: [FaIconComponent, ScrollRevealDirective],
  templateUrl: './contacto.html',
})
export class Contacto {
  readonly datos: DatoContacto[] = [
    {
      icon: faEnvelope,
      label: 'Correo',
      value: SOPORTE.email,
      href: `mailto:${SOPORTE.email}`,
    },
    {
      icon: faPhone,
      label: 'Teléfono / WhatsApp',
      value: SOPORTE.telefono,
      href: `tel:+${SOPORTE.telefonoIntl}`,
    },
    {
      icon: faLocationDot,
      label: 'Ubicación',
      value: 'Centro Poblado Nariño, Caldas, Boyacá',
      href: '#',
    },
  ];

  readonly redes: RedSocial[] = [
    { icon: faInstagram, label: 'Instagram', href: '#' },
    { icon: faFacebookF, label: 'Facebook', href: '#' },
    { icon: faYoutube, label: 'YouTube', href: '#' },
    { icon: faTiktok, label: 'TikTok', href: '#' },
  ];
}
