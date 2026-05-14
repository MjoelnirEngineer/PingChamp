import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private currentLang = signal<string>('en');
  readonly lang = this.currentLang.asReadonly();

  private translations: Record<string, Record<string, string>> = {
    en: {
      'header.subtitle': 'Monitor your network in real-time',
      'header.saveConfig': 'Save Config',
      'header.saveConfig.title': 'Save current configuration',
      'header.loadConfig': 'Load Config',
      'header.loadConfig.title': 'Load configuration from .pingchamp file',
      'header.clearAll': 'Clear All',
      'header.clearAll.title': 'Clear all targets and results',
      'header.clearAll.confirm': 'Are you sure you want to clear all targets and results?',
      'header.error.loadFile': 'Error loading file: {0}',

      'targetList.addNew': 'Add New Target',
      'targetList.hostPlaceholder': 'Hostname or IP address (e.g., google.com)',
      'targetList.interval': 'Ping Interval (ms)',
      'targetList.maxTime': 'Max Time (ms)',
      'targetList.addTarget': '➕ Add Target',
      'targetList.activeTargets': 'Active Targets ({0})',
      'targetList.noTargets': 'No targets added yet. Add one above to get started!',
      'targetList.id': 'ID: {0}',
      'targetList.stop': '⏸️ Stop',
      'targetList.start': '▶️ Start',
      'targetList.settings.interval': 'Ping Interval (ms)',
      'targetList.settings.maxTime': 'Max Time in Graph (ms)',
      'targetList.remove': '❌ Remove',
      'targetList.remove.title': 'Remove this target',

      'pingGraph.noTargets': '📊 No targets yet',
      'pingGraph.noTargets.hint': 'Add a target from the left panel to see graphs',
      'pingGraph.pinging': '🟢 Pinging',
      'pingGraph.stopped': '⚪ Stopped',
      'pingGraph.avg': 'Avg',
      'pingGraph.avg.title': 'Average response time',
      'pingGraph.min': 'Min',
      'pingGraph.max': 'Max',
      'pingGraph.success': 'Success',
      'pingGraph.responseTime': 'Response Time (ms)',
      'pingGraph.interval': 'Interval: {0}ms',
      'pingGraph.legend.success': 'Success ({0})',
      'pingGraph.legend.noResponse': 'No Response ({0})',
      'pingGraph.status': 'Status:',
      'pingGraph.status.monitoring': 'Currently monitoring',
      'pingGraph.status.stopped': 'Monitoring stopped',
      'pingGraph.dataPoints': 'Data Points:',
      'pingGraph.maxSuffix': 'max',
      'pingGraph.noResponse': 'No response',
      'pingGraph.resetStats': 'Reset statistics',

      'lang.switch': 'Language',
    },
    de: {
      'header.subtitle': 'Überwachen Sie Ihr Netzwerk in Echtzeit',
      'header.saveConfig': 'Config speichern',
      'header.saveConfig.title': 'Aktuelle Konfiguration speichern',
      'header.loadConfig': 'Config laden',
      'header.loadConfig.title': 'Konfiguration aus .pingchamp-Datei laden',
      'header.clearAll': 'Alles löschen',
      'header.clearAll.title': 'Alle Ziele und Ergebnisse löschen',
      'header.clearAll.confirm': 'Sind Sie sicher, dass Sie alle Ziele und Ergebnisse löschen möchten?',
      'header.error.loadFile': 'Fehler beim Laden der Datei: {0}',

      'targetList.addNew': 'Neues Ziel hinzufügen',
      'targetList.hostPlaceholder': 'Hostname oder IP-Adresse (z.B. google.de)',
      'targetList.interval': 'Ping-Intervall (ms)',
      'targetList.maxTime': 'Max. Zeit (ms)',
      'targetList.addTarget': '➕ Ziel hinzufügen',
      'targetList.activeTargets': 'Aktive Ziele ({0})',
      'targetList.noTargets': 'Noch keine Ziele vorhanden. Fügen Sie oben eines hinzu!',
      'targetList.id': 'ID: {0}',
      'targetList.stop': '⏸️ Stopp',
      'targetList.start': '▶️ Start',
      'targetList.settings.interval': 'Ping-Intervall (ms)',
      'targetList.settings.maxTime': 'Max. Zeit im Diagramm (ms)',
      'targetList.remove': '❌ Entfernen',
      'targetList.remove.title': 'Dieses Ziel entfernen',

      'pingGraph.noTargets': '📊 Keine Ziele',
      'pingGraph.noTargets.hint': 'Fügen Sie ein Ziel aus dem linken Bereich hinzu',
      'pingGraph.pinging': '🟢 Aktiv',
      'pingGraph.stopped': '⚪ Gestoppt',
      'pingGraph.avg': 'Ø',
      'pingGraph.avg.title': 'Durchschnittliche Antwortzeit',
      'pingGraph.min': 'Min',
      'pingGraph.max': 'Max',
      'pingGraph.success': 'Erfolg',
      'pingGraph.responseTime': 'Antwortzeit (ms)',
      'pingGraph.interval': 'Intervall: {0}ms',
      'pingGraph.legend.success': 'Erfolg ({0})',
      'pingGraph.legend.noResponse': 'Keine Antwort ({0})',
      'pingGraph.status': 'Status:',
      'pingGraph.status.monitoring': 'Wird überwacht',
      'pingGraph.status.stopped': 'Überwachung gestoppt',
      'pingGraph.dataPoints': 'Datenpunkte:',
      'pingGraph.maxSuffix': 'max',
      'pingGraph.noResponse': 'Keine Antwort',
      'pingGraph.resetStats': 'Statistiken zurücksetzen',

      'lang.switch': 'Sprache',
    },
  };

  constructor() {
    const browserLang = navigator.language?.split('-')[0];
    this.currentLang.set(['en', 'de'].includes(browserLang) ? browserLang : 'en');
  }

  setLanguage(lang: string): void {
    if (this.translations[lang]) {
      this.currentLang.set(lang);
    }
  }

  t(key: string, ...args: (string | number)[]): string {
    const dict = this.translations[this.currentLang()] || this.translations['en'];
    let text = dict[key] ?? key;
    if (args.length) {
      args.forEach((arg, i) => {
        text = text.replace(`{${i}}`, String(arg));
      });
    }
    return text;
  }
}
