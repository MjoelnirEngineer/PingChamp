import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetService } from '../services/target.service';
import { FileService } from '../services/file.service';
import { PingService } from '../services/ping.service';
import { TranslationService } from '../services/translation.service';
import { ThemeService } from '../services/theme.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-header',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private targetService = inject(TargetService);
  private fileService = inject(FileService);
  private pingService = inject(PingService);
  protected tService = inject(TranslationService);
  protected themeService = inject(ThemeService);

  onSaveConfig(): void {
    const targets = this.targetService.getTargets();
    this.fileService.saveToFile(targets);
  }

  onLoadConfig(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pingchamp,.json';

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const targets = await this.fileService.loadFromFile(file);
          this.pingService.stopAllPinging();
          this.pingService.clearAllResults();
          this.targetService.setTargets(targets);
          targets.forEach(t => {
            if (t.isActive) {
              this.pingService.startPinging(t.host, t.intervalMs);
            }
          });
        } catch (error) {
          alert(this.tService.t('header.error.loadFile', error instanceof Error ? error.message : 'Unknown error'));
        }
      }
    };

    input.click();
  }

  onClearAll(): void {
    if (confirm(this.tService.t('header.clearAll.confirm'))) {
      this.pingService.stopAllPinging();
      this.targetService.clear();
      this.pingService.clearAllResults();
    }
  }

  onLanguageChange(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value;
    this.tService.setLanguage(lang);
  }
}
