import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateService, Aura } from '../../services/state.service';
import { GeminiService } from '../../services/gemini.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  state = inject(StateService);
  geminiService = inject(GeminiService);

  auras = this.state.auras;
  selectedAura = this.state.selectedAura;
  isLoading = this.state.isLoading;
  currentUser = this.state.currentUser;
  theme = this.state.theme;
  
  selectAura(aura: Aura) {
    this.state.selectAura(aura);
  }

  discoverAuras() {
    this.geminiService.getAuraSuggestions();
  }

  toggleTheme() {
    this.state.toggleTheme();
  }

  logout() {
    this.state.logout();
  }
}