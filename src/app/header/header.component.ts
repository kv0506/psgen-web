import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
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
