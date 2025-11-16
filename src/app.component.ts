import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FeedComponent } from './components/feed/feed.component';
import { StateService } from './services/state.service';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarComponent, FeedComponent, LoginComponent],
})
export class AppComponent {
  state = inject(StateService);
  isAuthenticated = this.state.isAuthenticated;
  theme = this.state.theme;
}