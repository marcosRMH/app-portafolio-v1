import { Component, AfterViewInit, Inject, PLATFORM_ID, ElementRef, Output, EventEmitter } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isPlatformBrowser } from '@angular/common';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements AfterViewInit {
  private menuOpen = false;

  @Output() langChange = new EventEmitter<string>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private el: ElementRef
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.animateEntrance();
    this.setupScrollEffect();
    this.setupHoverEffects();
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
    const navbar = this.el.nativeElement.querySelector('#navbar');

    gsap.to(navbar, {
      scrollTrigger: {
        trigger: document.body,
        start: '80px top',
        toggleActions: 'play none none reverse',
        onEnter: () => navbar.classList.add('scrolled'),
        onLeaveBack: () => navbar.classList.remove('scrolled'),
      },
      duration: 0.3,
    });
  }

  private setupHoverEffects(): void {
    const links = this.el.nativeElement.querySelectorAll('.nav-link');

    links.forEach((link: HTMLElement) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link.querySelector('::after'), {
          width: '100%',
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link.querySelector('::after'), {
          width: '0%',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    const btn = this.el.nativeElement.querySelector('.nav-btn');
    if (btn) {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        });
      });
    }
  }

  private setupMobileMenu(): void {
    const toggle = this.el.nativeElement.querySelector('#menuToggle');
    const overlay = this.el.nativeElement.querySelector('#navOverlay');
    const links = this.el.nativeElement.querySelector('#navLinks');

    if (!toggle || !overlay || !links) return;

    toggle.addEventListener('click', () => {
      this.menuOpen = !this.menuOpen;

      toggle.classList.toggle('active');
      links.classList.toggle('open');
      overlay.classList.toggle('show');

      if (this.menuOpen) {
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(
          links.querySelectorAll('.nav-link'),
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
        );
      }

      document.body.style.overflow = this.menuOpen ? 'hidden' : '';
    });

    const closeMenu = () => {
      if (!this.menuOpen) return;
      this.menuOpen = false;
      toggle.classList.remove('active');
      links.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    overlay.addEventListener('click', closeMenu);
    links.querySelectorAll('.nav-link').forEach((link: HTMLElement) => {
      link.addEventListener('click', closeMenu);
    });
  }

  private setupLangSelect(): void {
    const select = this.el.nativeElement.querySelector('#langSelect') as HTMLSelectElement;
    if (!select) return;
    this.langChange.emit(select.value);
    select.addEventListener('change', () => this.langChange.emit(select.value));
  }
}
