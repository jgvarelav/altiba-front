import { Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-coming-soon',
  imports: [FaIconComponent],
  templateUrl: './coming-soon.html',
})
export class ComingSoon {
  readonly title = input.required<string>();
  readonly icon = input.required<IconDefinition>();
}
