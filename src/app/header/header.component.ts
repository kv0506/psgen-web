import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
  }
}
