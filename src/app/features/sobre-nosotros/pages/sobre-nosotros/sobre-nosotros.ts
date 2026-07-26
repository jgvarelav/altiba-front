import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHandshake, faVideo, faLaptopCode, faChartLine, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';

interface Pilar {
  icon: IconDefinition;
  title: string;
  description: string;
}

@Component({
  selector: 'app-sobre-nosotros',
  imports: [RouterLink, FaIconComponent, ScrollRevealDirective],
  templateUrl: './sobre-nosotros.html',
})
export class SobreNosotros {
  readonly faBullseye = faBullseye;

  readonly pilares: Pilar[] = [
    {
      icon: faHandshake,
      title: 'Conectamos',
      description: 'Emprendimientos innovadores con consumidores que buscan productos con historia y origen.',
    },
    {
      icon: faVideo,
      title: 'Contenido audiovisual',
      description: 'Visibilizamos los procesos productivos de cada emprendimiento para generar confianza.',
    },
    {
      icon: faLaptopCode,
      title: 'Herramientas tecnológicas',
      description: 'Una plataforma digital de intermediación pensada para el desarrollo rural e innovador.',
    },
    {
      icon: faChartLine,
      title: 'Oportunidades comerciales',
      description: 'Impulsamos el crecimiento de los emprendimientos a nivel regional y nacional.',
    },
  ];
}
