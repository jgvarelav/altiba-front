import { Component, inject, input, signal, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoApi } from '../../services/producto-api';
import { CATEGORIAS } from '../../../../core/models/categorias.const';
import { Categoria, ProductoInput, StrapiMedia } from '../../../../core/models/producto.model';
import { textToBlocks, blocksToText } from '../../../../core/utils/strapi-blocks';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-emprendimiento-form',
  imports: [ReactiveFormsModule],
  templateUrl: './emprendimiento-form.html',
})
export class EmprendimientoForm {
  private readonly fb = inject(FormBuilder);
  private readonly productoApi = inject(ProductoApi);
  private readonly router = inject(Router);

  readonly documentId = input<string>();

  readonly apiUrl = environment.apiUrl;
  readonly categorias = CATEGORIAS;
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  /** Images already saved on the producto (when editing) that the user hasn't removed. */
  readonly existingImages = signal<StrapiMedia[]>([]);
  /** New files picked in this session, not uploaded yet, paired with a preview URL. */
  readonly newFiles = signal<{ file: File; previewUrl: string }[]>([]);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    numero_contacto: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    categoria: ['agro_alimentos' as Categoria, Validators.required],
    ubicacion: [''],
  });

  constructor() {
    effect(() => {
      const documentId = this.documentId();
      if (!documentId) {
        return;
      }

      this.productoApi.getByDocumentId(documentId).subscribe((producto) => {
        this.form.patchValue({
          nombre: producto.nombre,
          descripcion: blocksToText(producto.descripcion),
          numero_contacto: producto.numero_contacto ?? '',
          precio: producto.precio,
          categoria: producto.categoria,
          ubicacion: producto.ubicacion ?? '',
        });
        this.existingImages.set(producto.imagenes ?? []);
      });
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    this.newFiles.update((current) => [...current, ...files]);
    input.value = '';
  }

  removeExistingImage(id: number): void {
    this.existingImages.update((images) => images.filter((img) => img.id !== id));
  }

  removeNewFile(index: number): void {
    this.newFiles.update((files) => {
      URL.revokeObjectURL(files[index].previewUrl);
      return files.filter((_, i) => i !== index);
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    const { descripcion, ...rest } = this.form.getRawValue();

    const save = (newImageIds: number[]): void => {
      const payload: Partial<ProductoInput> = {
        ...rest,
        descripcion: textToBlocks(descripcion),
        imagenes: [...this.existingImages().map((img) => img.id), ...newImageIds],
      };
      const documentId = this.documentId();
      const request = documentId
        ? this.productoApi.update(documentId, payload)
        : this.productoApi.create(payload);

      request.subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigateByUrl('/emprendimientos');
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.error?.message ?? 'No pudimos guardar el producto.');
        },
      });
    };

    const files = this.newFiles();
    if (files.length > 0) {
      this.productoApi.uploadImages(files.map((f) => f.file)).subscribe({
        next: (imageIds) => save(imageIds),
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('No pudimos subir las imágenes.');
        },
      });
    } else {
      save([]);
    }
  }
}
