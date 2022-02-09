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

  /**
   * This shows the submenu for the menu elements the user is currently hovering over.
   *
   * @param {HTMLUListElement} element - The menu element which should get opened
   */
  showSublevel(element: HTMLUListElement) {
    element.classList.toggle('show');
  }
}
