import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass'],
  standalone: true,
    imports: [RouterLink, NgIf]
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
  }

  logout() {
    this.loggedIn = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
