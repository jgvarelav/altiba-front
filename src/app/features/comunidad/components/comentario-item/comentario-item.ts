import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faReply, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../core/services/auth';
import { ComentarioNode } from '../../../../core/models/comunidad.model';

@Component({
  selector: 'app-comentario-item',
  imports: [CommonModule, FormsModule, FaIconComponent, ComentarioItem],
  templateUrl: './comentario-item.html',
})
export class ComentarioItem {
  private readonly authService = inject(AuthService);

  readonly node = input.required<ComentarioNode>();
  readonly depth = input(0);
  readonly onReply = input.required<(parentDocumentId: string, contenido: string) => void>();
  readonly onDelete = input.required<(documentId: string) => void>();

  readonly currentUser = this.authService.currentUser;
  readonly replying = signal(false);
  readonly replyText = signal('');

  readonly faReply = faReply;
  readonly faTrash = faTrash;

  readonly indent = () => Math.min(this.depth(), 5) * 20;

  isOwner(): boolean {
    const userId = this.currentUser()?.id;
    return userId !== undefined && this.node().comentario.owner?.id === userId;
  }

  initials(): string {
    return this.node().comentario.owner?.username?.[0]?.toUpperCase() ?? '?';
  }

  toggleReply(): void {
    this.replying.update((value) => !value);
    this.replyText.set('');
  }

  submitReply(): void {
    const text = this.replyText().trim();
    if (!text) {
      return;
    }
    this.onReply()(this.node().comentario.documentId, text);
    this.replying.set(false);
    this.replyText.set('');
  }

  remove(): void {
    if (!confirm('¿Eliminar este comentario?')) {
      return;
    }
    this.onDelete()(this.node().comentario.documentId);
  }
}
