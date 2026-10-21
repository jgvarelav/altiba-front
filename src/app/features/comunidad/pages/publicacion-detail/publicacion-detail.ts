import { Component, computed, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPen, faTrash, faComments } from '@fortawesome/free-solid-svg-icons';
import { PublicacionApi } from '../../services/publicacion-api';
import { ComentarioApi } from '../../services/comentario-api';
import { AuthService } from '../../../../core/services/auth';
import { Publicacion, Comentario } from '../../../../core/models/comunidad.model';
import { buildComentarioTree } from '../../utils/comentario-tree';
import { ComentarioItem } from '../../components/comentario-item/comentario-item';

@Component({
  selector: 'app-publicacion-detail',
  imports: [CommonModule, FormsModule, RouterLink, FaIconComponent, ComentarioItem],
  templateUrl: './publicacion-detail.html',
})
export class PublicacionDetail {
  private readonly publicacionApi = inject(PublicacionApi);
  private readonly comentarioApi = inject(ComentarioApi);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly documentId = input.required<string>();

  readonly currentUser = this.authService.currentUser;
  readonly publicacion = signal<Publicacion | null>(null);
  readonly comentarios = signal<Comentario[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly newCommentText = signal('');

  readonly tree = computed(() => buildComentarioTree(this.comentarios()));

  readonly faArrowLeft = faArrowLeft;
  readonly faPen = faPen;
  readonly faTrash = faTrash;
  readonly faComments = faComments;

  readonly onReply = (parentDocumentId: string, contenido: string): void => {
    this.comentarioApi
      .create({ contenido, publicacion: this.documentId(), parent: parentDocumentId })
      .subscribe({
        next: () => this.loadComentarios(),
        error: () => this.errorMessage.set('No pudimos publicar tu respuesta.'),
      });
  };

  readonly onDelete = (commentDocumentId: string): void => {
    this.comentarioApi.remove(commentDocumentId).subscribe({
      next: () => this.loadComentarios(),
      error: () => this.errorMessage.set('No pudimos eliminar el comentario.'),
    });
  };

  constructor() {
    effect(() => {
      const documentId = this.documentId();
      this.loading.set(true);
      this.publicacionApi.getByDocumentId(documentId).subscribe({
        next: (publicacion) => {
          this.publicacion.set(publicacion);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('No pudimos cargar esta publicación.');
          this.loading.set(false);
        },
      });
      this.loadComentarios();
    });
  }

  loadComentarios(): void {
    this.comentarioApi.listByPublicacion(this.documentId()).subscribe({
      next: (comentarios) => this.comentarios.set(comentarios),
    });
  }

  isOwnerOfPost(): boolean {
    const userId = this.currentUser()?.id;
    return userId !== undefined && this.publicacion()?.owner?.id === userId;
  }

  submitTopLevelComment(): void {
    const text = this.newCommentText().trim();
    if (!text) {
      return;
    }
    this.comentarioApi.create({ contenido: text, publicacion: this.documentId() }).subscribe({
      next: () => {
        this.newCommentText.set('');
        this.loadComentarios();
      },
      error: () => this.errorMessage.set('No pudimos publicar tu comentario.'),
    });
  }

  removePublicacion(): void {
    if (!confirm('¿Eliminar esta publicación y todos sus comentarios?')) {
      return;
    }
    this.publicacionApi.remove(this.documentId()).subscribe({
      next: () => this.router.navigateByUrl('/comunidad'),
      error: () => this.errorMessage.set('No pudimos eliminar la publicación.'),
    });
  }
}
