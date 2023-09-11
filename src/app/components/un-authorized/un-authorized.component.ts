import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'un-authorized',
  templateUrl: './un-authorized.component.html',
  styleUrls: ['./un-authorized.component.css']
})
export class UnAuthorizedComponent {
  imageUrl = "./assets/un-author.jpg";
  constructor(private router: Router, private authService: AuthService) {
  }
  goBack() {
    this.router.navigate(['/login']);
  }
}
