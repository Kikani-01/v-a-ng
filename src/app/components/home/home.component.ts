import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PAGES } from 'src/app/constants/pages';

@Component({
  templateUrl: './home.component.html',
})
export class HomePageComponent implements OnInit {
  images: any[];

  public pages: MenuItem[] = PAGES;

  constructor() {}

  ngOnInit(): void {
    console.log('home component initialized');

    this.images = [
      {
        previewImageSrc: '../assets/images/home-slide1.jpg',
      },
      {
        previewImageSrc: '../assets/images/home-slide2.jpg',
      },
      {
        previewImageSrc: '../assets/images/home-slide3.jpg',
      },
      {
        previewImageSrc: '../assets/images/home-slide4.jpg',
      },
    ];
  }
}
