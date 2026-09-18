import type { BookmarkNode } from './bookmarks/types';
import { otherBookmarksFolder } from './bookmarks/tree';
import { isBlockedUrl } from './open-bookmark';

export type SaveCurrentInput = {
  url: string;
  title: string;
  nodes: BookmarkNode[];
  create: (opts: {
    parentId: string;
    title: string;
    url: string;
  }) => Promise<{ id: string }>;
};

export async function saveCurrentPage(
  input: SaveCurrentInput,
): Promise<
  | { ok: true; id: string }
  | {
      ok: false;
      reason: 'already-saved' | 'no-other-folder' | 'invalid-url' | 'blocked';
    }
> {
  const url = input.url.trim();
  if (url.length === 0 || !isAbsoluteUrl(url)) {
    return { ok: false, reason: 'invalid-url' };
  }
  if (isBlockedUrl(url)) return { ok: false, reason: 'blocked' };

  const alreadySaved = input.nodes.some(
    (node) => !node.isFolder && node.url === url,
  );
  if (alreadySaved) return { ok: false, reason: 'already-saved' };

  const folder = otherBookmarksFolder(input.nodes);
  if (folder == null) return { ok: false, reason: 'no-other-folder' };

  const created = await input.create({
    parentId: folder.id,
    title: input.title,
    url,
  });
  return { ok: true, id: created.id };
}

function isAbsoluteUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
