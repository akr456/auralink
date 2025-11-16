
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { GeminiService } from '../../services/gemini.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [FormsModule, LoaderComponent],
  templateUrl: './create-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent {
  state = inject(StateService);
  geminiService = inject(GeminiService);

  postContent = signal('');
  isEnhancing = this.state.isEnhancing;

  async enhancePost() {
    const enhancedText = await this.geminiService.enhancePost(this.postContent());
    this.postContent.set(enhancedText);
  }

  submitPost() {
    if (this.postContent().trim()) {
      this.state.addPost(this.postContent());
      this.postContent.set('');
    }
  }
}
