import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  styles: [],
})
export class AppComponent implements OnInit {
  public cfEndpointsDatas: any;
  public cfCurrentRegion: any;
  constructor(private router: Router) { }

  async initData(): Promise<any> {
  }

  ngOnInit(): void {
  }
}
