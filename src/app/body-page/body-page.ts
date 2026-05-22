import { Component, AfterViewInit, Inject, PLATFORM_ID, NgZone, OnInit, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '../core/http/http.service';
import { PortfolioConfig, AboutMe, Title, CarrouselItem, Experience, ProjectItem, ProjectEntry } from '../shared/models/portfolio-config.model';

interface ContactData {
  email: string;
  phone?: string;
  message: string;
}

@Component({
  selector: 'app-body-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './body-page.html',
  styleUrl: './body-page.css',
})
export class BodyPage implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  @Input() lang: string = 'es';
  contactData: ContactData = { email: '', phone: '', message: '' };
  loading = false;
  success = false;
  error = false;
  config: PortfolioConfig | undefined;
  private successTimeoutId: any;
  recaptchaSiteKey = '';
  aboutMe = "";
  habilitiesCategories: { name: string; skills: string[] }[] = [];
  titleAboutMe = "";
  titleExperience = "";
  titleProjects = "";
  titleSkills = "";
  titleContact = "";
  placeHolderCorreo = "";
  placeHolderPhone = "";
  placeholderText = "";
  txtBtnSend = "";

  experienceEntries: { role: string; text: string; time: string }[] = [];
  projectEntries: ProjectEntry[] = [];
  carouselImages: { src: string; alt: string; description: string }[] = [];
  currentIndex = 0;
  private autoSlideInterval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {
  }

  ngOnInit(): void {
     if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('portfolioConfig');
      if (stored) {
        this.config = JSON.parse(stored) as PortfolioConfig;
      }
    }
    this.startAutoSlide();
    // this.useConfigInLive('es');
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['lang']) {
      const lang = this.lang;
      console.log("Idioma seleccionado:", lang);
      await this.useConfigInLive(lang);
      //this.showInfoPersonal(lang);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    this.resetAutoSlide();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoSlide();
  }

  private startAutoSlide(): void {
    if (!isPlatformBrowser(this.platformId) || this.carouselImages.length === 0) return;
    this.autoSlideInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    }, 4000);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  private resetAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  private httpService = new HttpService();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const tl = gsap.timeline({ delay: 0.08 });

    tl.set('.processor', { scale: 0, opacity: 0 });
    tl.set('.main-line-v, .main-line-h', { opacity: 0 });
    tl.set('.branch-l, .branch-r, .branch-up, .branch-down', { opacity: 0 });
    tl.set('.dot', { scale: 0, opacity: 0 });
    tl.set('.core, .core-line-h, .core-line-v', { scale: 0, opacity: 0 });
    tl.set('.logo-title', { y: 30, opacity: 0 });
    tl.set('.about-card', { y: 30, opacity: 0 });
    tl.set('.carousel-container', { y: 30, opacity: 0 });
    tl.set('.project-card', { y: 30, opacity: 0 });
    tl.set('.skill-category', { y: 30, opacity: 0 });
    tl.set('.timeline-item', { x: -20, opacity: 0 });

    tl.to('.processor', {
      scale: 1,
      opacity: 1,
      duration: 0.35,
      ease: 'back.out(1.5)',
    });

    tl.to('.main-line-v, .main-line-h', {
      opacity: 1,
      duration: 0.25,
      stagger: 0.06,
      ease: 'power2.out',
    }, '-=0.15');

    tl.to('.branch-l, .branch-r, .branch-up, .branch-down', {
      opacity: 1,
      duration: 0.2,
      stagger: 0.03,
      ease: 'power2.out',
    }, '-=0.1');

    tl.to('.dot', {
      scale: 1,
      opacity: 1,
      duration: 0.15,
      stagger: 0.015,
      ease: 'back.out(1.5)',
    }, '-=0.08');

    tl.to('.core', {
      scale: 1,
      opacity: 1,
      duration: 0.2,
      ease: 'back.out(1.3)',
    }, '-=0.1');

    tl.to('.core-line-h, .core-line-v', {
      scale: 1,
      opacity: 1,
      duration: 0.15,
      stagger: 0.06,
      ease: 'power2.out',
    }, '-=0.08');

    tl.to('.logo-title', {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.15');

    tl.to('.about-card', {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.15');

    tl.to('.carousel-container', {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.15');

    tl.to('.project-card', {
      y: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.08,
      ease: 'power2.out',
    }, '-=0.2');

    tl.to('.skill-category', {
      y: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.08,
      ease: 'power2.out',
    }, '-=0.3');

    tl.to('.timeline-item', {
      x: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.1,
      ease: 'power2.out',
    }, '-=0.3');

    this.createInfiniteAnimations();
  }

  createInfiniteAnimations(): void {
    gsap.to('.processor', {
      boxShadow: '0 0 40px rgba(0, 217, 255, 0.6), 0 0 80px rgba(0, 217, 255, 0.2)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.core', {
      borderColor: 'rgba(0, 255, 255, 0.9)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.core-line-h, .core-line-v', {
      backgroundColor: 'rgba(0, 255, 255, 1)',
      duration: 1,
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
      ease: 'sine.inOut',
    });

    gsap.to('.main-line-v, .main-line-h', {
      opacity: 0.5,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      ease: 'sine.inOut',
    });

    gsap.to('.branch-l, .branch-r, .branch-up, .branch-down', {
      opacity: 0.4,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      stagger: 0.1,
      ease: 'sine.inOut',
    });

    const allDots = document.querySelectorAll('.dot');
    allDots.forEach((dot, i) => {
      gsap.to(dot, {
        scale: 1.6,
        boxShadow: '0 0 15px rgba(0, 255, 255, 1)',
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        delay: i * 0.05,
        ease: 'sine.inOut',
      });
    });

    gsap.to('.logo-title', {
      textShadow: '0 0 15px rgba(0, 217, 255, 0.8), 0 0 30px rgba(0, 217, 255, 0.4)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.clearSuccessTimeout();
    this.loading = true;
    this.success = false;
    this.error = false;

    this.getRecaptchaToken().then((token) => {
      const body = {
        ...this.contactData,
        recaptchaToken: token,
      };

      this.httpService.post<void>('/portfolio/send-message', body, { "x-name-portal": 'PORTFOLIO_MRMH'}).subscribe({
        next: () => {
          this.success = true;
          this.contactData = { email: form.value.email, phone: form.value.phone, message: form.value.message };
          form.resetForm();
          this.ngZone.runOutsideAngular(() => {
            this.successTimeoutId = setTimeout(() => {
              this.ngZone.run(() => { this.success = false; });
            }, 4000);
          });
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    }).catch(() => {
      this.error = true;
      this.loading = false;
    });
  }

  private clearSuccessTimeout(): void {
    if (this.successTimeoutId) {
      clearTimeout(this.successTimeoutId);
      this.successTimeoutId = null;
    }
  }

  private getRecaptchaToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        reject('reCAPTCHA no disponible');
        return;
      }

      const waitForGrecaptcha = (retries: number) => {
        if ((window as any).grecaptcha) {
          (window as any).grecaptcha.ready(() => {
            (window as any).grecaptcha.execute(this.recaptchaSiteKey, { action: 'contact' }).then((token: string) => {
              resolve(token);
            }).catch((err: Error) => reject(err));
          });
        } else if (retries > 0) {
          setTimeout(() => waitForGrecaptcha(retries - 1), 500);
        } else {
          reject('reCAPTCHA no disponible después de esperar');
        }
      };
      waitForGrecaptcha(10);
    });
  }

  private async getConfigPortfolio(typeLanguage: string): Promise<PortfolioConfig> {
    const configPortal = await firstValueFrom(this.httpService.get(`/portfolio/multilanguage/${typeLanguage}`, { "x-name-portal": 'PORTFOLIO_MRMH' })) as any;
    const configMap : PortfolioConfig = {
      aboutMe: configPortal.data.aboutMe,
      configRecapcha: configPortal.data.configRecapcha,
      habilities: configPortal.data.habilities,
      carrousel: configPortal.data.carrousel,
      experience: configPortal.data.experience,
      titles: configPortal.data.titles,
      projects: configPortal.data.projects
    }
    localStorage.setItem('portfolioConfig', JSON.stringify(configMap));
    return configMap;
  }

  getSkillCategories(): string[] {
    return this.config?.habilities?.[0]?.es ? Object.keys(this.config.habilities[0].es) : [];
  }

  private async useConfigInLive(type: string): Promise<void> {
    try {
      const stored = localStorage.getItem('portfolioConfig');
      if (stored) {
        this.config = JSON.parse(stored) as PortfolioConfig;
      } else {
        this.config = await this.getConfigPortfolio(type);
      }
      this.recaptchaSiteKey = this.config.configRecapcha.tokenRECAPCHAclient;
      this.loadRecaptchaScript();
      this.showInfoPersonal(type)
    } catch {
      console.error('Error al cargar configuración');
    }
  }

  private loadRecaptchaScript(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if ((window as any).grecaptcha || !this.recaptchaSiteKey) return;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  private showInfoPersonal(type: string){
    this.configLetterAboutMe(type);
    this.configLetterHabilities(type);
    this.configLetterTitles(type);
    this.configCarrousel(type);
    this.configLetterExperience(type);
    this.configLetterProjects(type);

  }

  private configLetterAboutMe(type:string){
    const aboutObject = this.config?.aboutMe.find(obj => obj[type as keyof typeof obj]);
    this.aboutMe = aboutObject?.[type as keyof AboutMe] || '';
  }
  private configLetterHabilities(type:string){
    const habilitiesObject = this.config?.habilities.find(obj => obj[type as keyof typeof obj]);
    const habilitiesRecord = habilitiesObject?.[type as keyof AboutMe] ?? {};
    this.habilitiesCategories = Object.entries(habilitiesRecord).map(([name, skills]) => ({ name, skills }));
    
  }
  private configLetterTitles(type:string){
    const textTitle = this.config?.titles.find(obj => obj[type as keyof typeof obj]);
    const arrTitles = textTitle?.[type as keyof Title] || '';
    this.titleAboutMe = arrTitles[4];
    this.titleExperience = arrTitles[3];
    this.titleContact = arrTitles[7];
    this.titleProjects = arrTitles[6];
    this.titleSkills = arrTitles[5];
    this.placeHolderCorreo = arrTitles[8];
    this.placeHolderPhone = arrTitles[9];
    this.placeholderText = arrTitles[10];
    this.txtBtnSend = arrTitles[11];
  }
  private configCarrousel(type:string){
    const carrouselObject = this.config?.carrousel.find(obj => obj[type as keyof typeof obj]);
    const carrouselImgObj = carrouselObject?.[type as keyof CarrouselItem] ?? {};
    const carrouselDesc = carrouselObject?.descImg || (carrouselImgObj as any)?.descImg || [];
    const carrouselImgs = (carrouselImgObj as any)?.img || [];
    const arrToHtml: { src: string; alt: string; description: string }[] = [];
    for (let i = 0; i < carrouselDesc.length; i++) {
        arrToHtml.push({
            src: carrouselImgs[i] || '',
            alt: `Imagen destacada ${i + 1}`,
            description: carrouselDesc[i]
        });
    }
    this.carouselImages = arrToHtml;
  }

  private configLetterExperience(type:string){
    const experienceObject = this.config?.experience.find(obj => obj[type as keyof typeof obj]);
    const experienceRecord = experienceObject?.[type as keyof Experience] ?? [];
    const flatEntries: { role: string; text: string; time: string }[] = [];
    for (const entry of experienceRecord) {
      for (const [role, detail] of Object.entries(entry)) {
        flatEntries.push({ role, text: detail.text, time: detail.time });
      }
    }

     this.experienceEntries = flatEntries.sort((a, b) => {
      const yearA = parseInt(a.time.match(/\d{4}/)?.[0] || '0', 10);
      const yearB = parseInt(b.time.match(/\d{4}/)?.[0] || '0', 10);
      return yearB - yearA;
    });

  }

  private configLetterProjects(type:string){
    const projectsObject = this.config?.projects.find(obj => obj[type as keyof typeof obj]);
    this.projectEntries = projectsObject?.[type as keyof ProjectItem] ?? [];
  }
}
