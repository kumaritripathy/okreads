import { Component } from '@angular/core';
import { BookConstant} from '@tmo/shared/models';


@Component({
  selector: 'tmo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
bookConstant = BookConstant;
}
