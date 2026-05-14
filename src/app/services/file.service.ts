import { Injectable } from '@angular/core';
import { PingTarget } from './target.service';

export interface PingChampFile {
  version: string;
  targets: PingTarget[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly CURRENT_VERSION = '1.0';

  saveToFile(targets: PingTarget[]): void {
    const data: PingChampFile = {
      version: this.CURRENT_VERSION,
      targets,
      createdAt: new Date().toISOString()
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `pingchamp-${new Date().getTime()}.pingchamp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  loadFromFile(file: File): Promise<PingTarget[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const data: PingChampFile = JSON.parse(content);

          if (data.version !== this.CURRENT_VERSION) {
            console.warn(`File version ${data.version} may not be fully compatible`);
          }

          if (!data.targets || !Array.isArray(data.targets)) {
            throw new Error('Invalid file format: missing targets array');
          }

          resolve(data.targets);
        } catch (error) {
          reject(new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  exportAsJson(targets: PingTarget[]): string {
    const data: PingChampFile = {
      version: this.CURRENT_VERSION,
      targets,
      createdAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }
}
