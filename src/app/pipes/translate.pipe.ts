import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private service = inject(TranslationService);

  transform(key: string, ...args: (string | number)[]): string {
    return this.service.t(key, ...args);
  }
}
