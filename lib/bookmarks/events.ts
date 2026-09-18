import {
  flattenCreatedNode,
  placementFromParent,
  snapshotWithNodes,
} from './snapshot';
import type { BookmarkTreeNodeInput } from './tree';
import type { BookmarkNode, BookmarkSnapshot, OpenRecord } from './types';

export function applyCreated(
  snapshot: BookmarkSnapshot,
  node: BookmarkTreeNodeInput,
  records: OpenRecord[],
): BookmarkSnapshot {
  if (snapshot.nodes.some((item) => item.id === node.id)) return snapshot;
  const parent =
    node.parentId == null
      ? null
      : (snapshot.nodes.find((item) => item.id === node.parentId) ?? null);
  const added = flattenCreatedNode(node, parent);
  return snapshotWithNodes(snapshot, [...snapshot.nodes, ...added], records);
}

export function applyChanged(
  snapshot: BookmarkSnapshot,
  id: string,
  change: { title?: string; url?: string },
  records: OpenRecord[],
): BookmarkSnapshot {
  const node = snapshot.nodes.find((item) => item.id === id);
  if (node == null) return snapshot;

  const nextNode: BookmarkNode = { ...node };
  if (change.title != null) nextNode.title = change.title;
  if (change.url != null) nextNode.url = change.url;

  let nodes = snapshot.nodes.map((item) => (item.id === id ? nextNode : item));
  if (node.isFolder && change.title != null && change.title !== node.title) {
    nodes = cascadePlacement(nodes, id);
  }
  return snapshotWithNodes(snapshot, nodes, records);
}

export function applyMoved(
  snapshot: BookmarkSnapshot,
  id: string,
  move: { parentId: string; index?: number },
): BookmarkSnapshot {
  const node = snapshot.nodes.find((item) => item.id === id);
  const parent = snapshot.nodes.find((item) => item.id === move.parentId);
  if (node == null || parent == null) return snapshot;

  const placement = placementFromParent(parent);
  let nodes = snapshot.nodes.map((item) =>
    item.id === id
      ? {
          ...item,
          parentId: move.parentId,
          path: placement.path,
          ancestorIds: placement.ancestorIds,
        }
      : item,
  );
  // Chrome onMoved notifies only the moved node.
  if (node.isFolder) nodes = cascadePlacement(nodes, id);
  return snapshotWithNodes(snapshot, nodes);
}

export function applyRemoved(
  snapshot: BookmarkSnapshot,
  id: string,
): BookmarkSnapshot {
  // Chrome fires onRemoved once for a folder, not for descendants.
  const drop = new Set(
    snapshot.nodes
      .filter((node) => node.id === id || node.ancestorIds.includes(id))
      .map((node) => node.id),
  );
  if (drop.size === 0) return snapshot;
  return snapshotWithNodes(
    snapshot,
    snapshot.nodes.filter((node) => !drop.has(node.id)),
  );
}

function cascadePlacement(nodes: BookmarkNode[], folderId: string): BookmarkNode[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const descendants = nodes
    .filter((node) => node.ancestorIds.includes(folderId))
    .sort((a, b) => a.ancestorIds.length - b.ancestorIds.length);
  for (const descendant of descendants) {
    const parent =
      descendant.parentId == null ? undefined : byId.get(descendant.parentId);
    if (parent == null) continue;
    const placement = placementFromParent(parent);
    byId.set(descendant.id, {
      ...descendant,
      path: placement.path,
      ancestorIds: placement.ancestorIds,
    });
  }
  return nodes.map((node) => byId.get(node.id) ?? node);
}
