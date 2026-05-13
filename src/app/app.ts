import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { BodyPage } from './body-page/body-page';
import { FooterPage } from './footer-page/footer-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, BodyPage, FooterPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
