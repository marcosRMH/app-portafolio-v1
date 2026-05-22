import { Component, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { isPlatformBrowser } from '@angular/common';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements AfterViewInit, OnChanges {
  private menuOpen = false;

  @Input() lang: string = 'es';
  navLabels = ['Inicio', 'Proyectos', 'Contacto'];

  @ViewChild('navbarEl') navbarEl!: ElementRef<HTMLElement>;
  @ViewChild('navLinksEl') navLinksEl!: ElementRef<HTMLElement>;
  @ViewChild('menuToggleEl') menuToggleEl!: ElementRef<HTMLElement>;
  @ViewChild('navOverlayEl') navOverlayEl!: ElementRef<HTMLElement>;
  @ViewChild('langSelectEl') langSelectEl!: ElementRef<HTMLSelectElement>;
  @ViewChild('langSelectMobileEl') langSelectMobileEl!: ElementRef<HTMLSelectElement>;
  @ViewChildren('navLinkEl') navLinkEls!: QueryList<ElementRef<HTMLAnchorElement>>;

  @Output() langChange = new EventEmitter<string>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.animateEntrance();
    this.setupScrollEffect();
    this.setupHoverEffects();
    this.setupLinkScroll();
    this.setupMobileMenu();
    this.setupLangSelect();
  }

  private animateEntrance(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.nav-logo', {
      y: -30,
      opacity: 0,
      duration: 0.6,
    })
    .from('.nav-link', {
      y: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
    }, '-=0.3')
  }

  private setupScrollEffect(): void {
    gsap.to(this.navbarEl.nativeElement, {
      scrollTrigger: {
        trigger: document.body,
        start: '80px top',
        toggleActions: 'play none none reverse',
        onEnter: () => this.navbarEl.nativeElement.classList.add('scrolled'),
        onLeaveBack: () => this.navbarEl.nativeElement.classList.remove('scrolled'),
      },
      duration: 0.3,
    });
  }

  private setupHoverEffects(): void {
    this.navLinkEls.forEach((link: ElementRef<HTMLAnchorElement>) => {
      const el = link.nativeElement;
      el.addEventListener('mouseenter', () => {
        gsap.to(el.querySelector('::after'), {
          width: '100%',
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el.querySelector('::after'), {
          width: '0%',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });
  }

  private setupLinkScroll(): void {
    this.navLinkEls.forEach((link: ElementRef<HTMLAnchorElement>) => {
      const el = link.nativeElement;
      el.addEventListener('click', (e: Event) => {
        const href = el.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        const target = document.querySelector(href) as HTMLElement | null;
        if (!target) return;
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power3.inOut',
        });
        this.closeMobileMenu();
      });
    });
  }

  private setupMobileMenu(): void {
    this.menuToggleEl.nativeElement.addEventListener('click', () => {
      this.menuOpen = !this.menuOpen;

      this.menuToggleEl.nativeElement.classList.toggle('active');
      this.navLinksEl.nativeElement.classList.toggle('open');
      this.navOverlayEl.nativeElement.classList.toggle('show');

      if (this.menuOpen) {
        gsap.fromTo(this.navOverlayEl.nativeElement, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(
          this.navLinkEls.map((l) => l.nativeElement),
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
        );
      }

      document.body.style.overflow = this.menuOpen ? 'hidden' : '';
    });

    this.navOverlayEl.nativeElement.addEventListener('click', () => this.closeMobileMenu());
    this.navLinkEls.forEach((link) => {
      link.nativeElement.addEventListener('click', () => this.closeMobileMenu());
    });
  }

  private closeMobileMenu(): void {
    if (!this.menuOpen) return;
    this.menuOpen = false;
    this.menuToggleEl.nativeElement.classList.remove('active');
    this.navLinksEl.nativeElement.classList.remove('open');
    this.navOverlayEl.nativeElement.classList.remove('show');
    document.body.style.overflow = '';
  }

  private setupLangSelect(): void {
    const syncSelects = (source: HTMLSelectElement, target: HTMLSelectElement) => {
      target.value = source.value;
      this.langChange.emit(source.value);
    };

    const desktop = this.langSelectEl.nativeElement;
    const mobile = this.langSelectMobileEl.nativeElement;

    mobile.value = desktop.value;

    desktop.addEventListener('change', () => syncSelects(desktop, mobile));
    mobile.addEventListener('change', () => syncSelects(mobile, desktop));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lang']) {
      this.updateNavLabels();
    }
  }

  private updateNavLabels(): void {
    try {
      const stored = localStorage.getItem('portfolioConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem('portfolioConfig');
          return;
        }
        const config = parsed.data ?? parsed;
        const titles = config.titles;
        if (titles?.[0]?.[this.lang]?.length >= 3) {
          this.navLabels = [titles[0][this.lang][0], titles[0][this.lang][1], titles[0][this.lang][2]];
        }
      }
    } catch {
      // fallback to defaults
    }
  }
}
