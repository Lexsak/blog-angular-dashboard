import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userEmail: string = '';
  isLoggedIn$: Observable<boolean> = of(false);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');

    if (userString !== null) {
      const user = JSON.parse(userString);
      this.userEmail = user.email;
    } else {
      console.log('User is not available in localStorage');
    }

    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  onLogOut() {
    this.authService.logOut();
  }
}
