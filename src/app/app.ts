import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { TargetList } from './target-list/target-list';
import { PingGraph } from './ping-graph/ping-graph';
import { TargetService } from './services/target.service';
import { PingService } from './services/ping.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Header, TargetList, PingGraph],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private targetService = inject(TargetService);
  private pingService = inject(PingService);

  ngOnInit(): void {
    const saved = this.targetService.loadFromStorage();
    if (saved && saved.length > 0) {
      this.targetService.setTargets(saved);
      saved.forEach(t => {
        if (t.isActive) {
          this.pingService.startPinging(t.host, t.intervalMs);
        }
      });
    }
  }
}
