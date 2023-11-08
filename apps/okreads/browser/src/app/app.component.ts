import { Component } from '@angular/core';
import { UndoActionConstant} from '@tmo/shared/models';


@Component({
  selector: 'tmo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
readonly landingConstant = UndoActionConstant;
}
