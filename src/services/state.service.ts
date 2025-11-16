import { Injectable, signal, computed } from '@angular/core';

export interface Aura {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
}

export interface User {
    name: string;
    avatarUrl: string;
}

export interface Post {
  id: string;
  auraId: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

const MOCK_AURAS: Aura[] = [
  { id: '1', name: 'Angular Signals', description: 'The future of reactivity in Angular.', icon: '⚡️' },
  { id: '2', name: 'WebRTC Pioneers', description: 'Real-time communication on the web.', icon: '📹' },
  { id: '3', name: 'AI in Frontend', description: 'Integrating ML models into UIs.', icon: '🤖' },
  { id: '4', name: 'Rust Lang', description: 'Discussions about performance and safety.', icon: '🦀' },
];

const MOCK_POSTS: Post[] = [
    { id: 'p1', auraId: '1', author: { name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/id/1005/100/100' }, content: 'Just tried the new signal inputs. Game changer for component design!', timestamp: new Date(Date.now() - 3600000), likes: 125, comments: 14 },
    { id: 'p2', auraId: '1', author: { name: 'Sarah Chen', avatarUrl: 'https://picsum.photos/id/1011/100/100' }, content: '`computed()` is so powerful for deriving state. My code has never been cleaner.', timestamp: new Date(Date.now() - 7200000), likes: 210, comments: 32 },
    { id: 'p3', auraId: '2', author: { name: 'Mike Davis', avatarUrl: 'https://picsum.photos/id/1025/100/100' }, content: 'Struggling with TURN server configuration. Any advice for deploying WebRTC at scale?', timestamp: new Date(Date.now() - 10800000), likes: 78, comments: 22 },
    { id: 'p4', auraId: '3', author: { name: 'Emily White', avatarUrl: 'https://picsum.photos/id/1027/100/100' }, content: 'Using Gemini to generate dynamic UI elements based on user prompts. The possibilities are endless!', timestamp: new Date(Date.now() - 86400000), likes: 450, comments: 68 },
    { id: 'p5', auraId: '4', author: { name: 'David Green', avatarUrl: 'https://picsum.photos/id/103/100/100' }, content: 'The borrow checker in Rust saved me from so many potential bugs today. It feels strict but fair.', timestamp: new Date(Date.now() - 172800000), likes: 315, comments: 45 },
];


@Injectable({ providedIn: 'root' })
export class StateService {
  // App State
  readonly auras = signal<Aura[]>(MOCK_AURAS);
  readonly posts = signal<Post[]>(MOCK_POSTS);
  readonly selectedAura = signal<Aura | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isEnhancing = signal<boolean>(false);
  
  // User & Auth State
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  // UI State
  readonly theme = signal<'light' | 'dark'>('dark');

  // Computed State
  readonly filteredPosts = computed(() => {
    const selected = this.selectedAura();
    if (!selected) return [];
    return this.posts().filter(p => p.auraId === selected.id).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  // Actions
  selectAura(aura: Aura | null) {
    this.selectedAura.set(aura);
  }

  addPost(content: string) {
    const currentAura = this.selectedAura();
    const currentUser = this.currentUser();
    if (!currentAura || !currentUser) return;

    const newPost: Post = {
      id: `p${Date.now()}`,
      auraId: currentAura.id,
      author: {
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
      },
      content,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
    };

    this.posts.update(posts => [newPost, ...posts]);
  }
  
  addAuras(newAuraNames: string[]) {
    const newAuras: Aura[] = newAuraNames.map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description: 'AI-suggested topic.',
        icon: '💡'
    }));
    
    this.auras.update(auras => [...auras, ...newAuras.filter(na => !auras.find(a => a.id === na.id))]);
  }

  // Auth Actions
  login(username: string) {
    if (!username.trim()) return;
    this.currentUser.set({
        name: username,
        avatarUrl: `https://picsum.photos/seed/${username}/100/100`
    });
  }

  logout() {
    this.currentUser.set(null);
    this.selectedAura.set(null);
  }

  // UI Actions
  toggleTheme() {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }
}