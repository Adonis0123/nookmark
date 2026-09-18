import { describe, expect, it } from 'vitest';
import { createBookmarkJobQueue } from '@/lib/bookmarks/job-queue';

describe('createBookmarkJobQueue', () => {
  it('lets the second job observe the first job write', async () => {
    const jobs = createBookmarkJobQueue();
    let snapshot = 0;
    let seenBySecond = -1;

    let unlock = () => {};
    const hold = new Promise<void>((resolve) => {
      unlock = resolve;
    });

    jobs.enqueue(async () => {
      await hold;
      snapshot = 1;
    });
    jobs.enqueue(async () => {
      seenBySecond = snapshot;
    });

    unlock();
    await jobs.idle();
    expect(seenBySecond).toBe(1);
    expect(snapshot).toBe(1);
  });

  it('runs import-ended rebuild after an in-flight rebuild, then clears importing', async () => {
    const jobs = createBookmarkJobQueue();
    let importing = true;
    const order: string[] = [];

    let unlock = () => {};
    const hold = new Promise<void>((resolve) => {
      unlock = resolve;
    });

    jobs.enqueue(async () => {
      await hold;
      order.push('startup-rebuild');
    });
    jobs.enqueue(async () => {
      order.push('import-ended-rebuild');
      importing = false;
    });

    expect(importing).toBe(true);
    unlock();
    await jobs.idle();
    expect(order).toEqual(['startup-rebuild', 'import-ended-rebuild']);
    expect(importing).toBe(false);
  });

  it('does not stall later jobs when one job rejects', async () => {
    const errors: unknown[] = [];
    const jobs = createBookmarkJobQueue((error) => {
      errors.push(error);
    });
    let ran = false;

    jobs.enqueue(async () => {
      throw new Error('boom');
    });
    jobs.enqueue(async () => {
      ran = true;
    });

    await jobs.idle();
    expect(ran).toBe(true);
    expect(errors).toHaveLength(1);
  });
});
