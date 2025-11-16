
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { PostComponent } from '../post/post.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, PostComponent, CreatePostComponent],
  templateUrl: './feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedComponent {
  state = inject(StateService);

  selectedAura = this.state.selectedAura;
  posts = this.state.filteredPosts;
}
