import { Comentario, ComentarioNode } from '../../../core/models/comunidad.model';

export function buildComentarioTree(comentarios: Comentario[]): ComentarioNode[] {
  const nodesByDocumentId = new Map<string, ComentarioNode>();
  comentarios.forEach((comentario) => {
    nodesByDocumentId.set(comentario.documentId, { comentario, children: [] });
  });

  const roots: ComentarioNode[] = [];
  nodesByDocumentId.forEach((node) => {
    const parentDocumentId = node.comentario.parent?.documentId;
    const parentNode = parentDocumentId ? nodesByDocumentId.get(parentDocumentId) : undefined;
    if (parentNode) {
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
