import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-body-page',
  imports: [],
  templateUrl: './body-page.html',
  styleUrl: './body-page.css',
})
export class BodyPage implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const tl = gsap.timeline({ delay: 0.3 });

    tl.set('.processor', { scale: 0, opacity: 0 });
    tl.set('.main-line-v, .main-line-h', { opacity: 0 });
    tl.set('.branch-l, .branch-r, .branch-up, .branch-down', { opacity: 0 });
    tl.set('.dot', { scale: 0, opacity: 0 });
    tl.set('.core, .core-line-h, .core-line-v', { scale: 0, opacity: 0 });
    tl.set('.logo-title', { y: 30, opacity: 0 });

    tl.to('.processor', {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.5)',
    });

    tl.to('.main-line-v, .main-line-h', {
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out',
    }, '-=0.2');

    tl.to('.branch-l, .branch-r, .branch-up, .branch-down', {
      opacity: 1,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.out',
    }, '-=0.15');

    tl.to('.dot', {
      scale: 1,
      opacity: 1,
      duration: 0.2,
      stagger: 0.02,
      ease: 'back.out(1.5)',
    }, '-=0.1');

    tl.to('.core', {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'back.out(1.3)',
    }, '-=0.15');

    tl.to('.core-line-h, .core-line-v', {
      scale: 1,
      opacity: 1,
      duration: 0.2,
      stagger: 0.1,
      ease: 'power2.out',
    }, '-=0.1');

    tl.to('.logo-title', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.1');

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
}
