export type BookmarkJobQueue = {
  enqueue: (work: () => Promise<void>) => void;
  idle: () => Promise<void>;
};

export function createBookmarkJobQueue(
  onError: (error: unknown) => void = (error) => {
    console.error(error);
  },
): BookmarkJobQueue {
  let queue = Promise.resolve();

  function enqueue(work: () => Promise<void>): void {
    queue = queue.then(work).catch(onError);
  }

  function idle(): Promise<void> {
    return queue;
  }

  return { enqueue, idle };
}
