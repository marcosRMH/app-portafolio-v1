import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioConfig } from '../shared/models/portfolio-config.model';

@Component({
  selector: 'app-footer-page',
  imports: [],
  templateUrl: './footer-page.html',
  styleUrl: './footer-page.css',
})
export class FooterPage implements OnInit {
  @Input() lang: string = 'es';
  aboutMe = '';
  skills: string[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    this.loadConfig();
  }

  private loadConfig(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const stored = localStorage.getItem('portfolioConfig');
    if (!stored) return;
    const config: PortfolioConfig = JSON.parse(stored);
    const lang = this.lang as 'es' | 'en';
    const aboutObj = config.aboutMe.find(obj => obj[lang] !== undefined);
    this.aboutMe = aboutObj?.[lang] || '';
    const habObj = config.habilities.find(obj => obj[lang] !== undefined);
    const habRecord = habObj?.[lang];
    if (habRecord) {
      const all = new Set<string>();
      Object.values(habRecord).forEach(arr => arr.forEach(s => all.add(s)));
      this.skills = Array.from(all);
    }
  }
}
