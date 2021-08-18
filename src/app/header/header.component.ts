import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  dropdown = false;

  constructor() {}

  ngOnInit(): void {}

  showSublevel(element: HTMLUListElement) {
    element.classList.toggle('show');
  }
}
