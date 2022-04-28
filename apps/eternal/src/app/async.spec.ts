import { fakeAsync, flushMicrotasks, tick, waitForAsync } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { tap } from 'rxjs/operators';

class Incrementer {
  a = 0;

  increment() {
    window.setTimeout(() => (this.a = this.a + 1));
  }
}

describe('Asynchronity', () => {
  it('should use setTimeout', waitForAsync(() => {
    let a = 1;
    window.setTimeout(() => {
      a += 1;
      expect(a).toBe(2);
    });
  }));

  it('should use a Promise', () => {
    let a = 1;
    Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('should use done callback', (done) => {
    let a = 1;
    Promise.resolve()
      .then(() => {
        a += 1;
        expect(a).toBe(2);
      })
      .finally(done);
  });

  it('should use async/await', async () => {
    let a = 1;
    await Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('should use waitForAsync', waitForAsync(() => {
    let a = 1;
    Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  }));

  it('should test Incrementer', fakeAsync(() => {
    const incrementer = new Incrementer();
    incrementer.increment();
    tick();
    expect(incrementer.a).toBe(1);
  }));

  it('should use fakeAsync', fakeAsync(() => {
    let a = 0;

    window.setTimeout(() => (a = a + 10));
    window.setTimeout(() => (a += 100), 10000);

    Promise.resolve().then(() => (a = a + 1));
    flushMicrotasks();
    expect(a).toBe(1);

    tick();
    expect(a).toBe(11);

    tick(10000);
    expect(a).toBe(111);
  }));

  it('should use Observables', async () => {
    let a = 1;
    await firstValueFrom(of(1).pipe(tap((n) => (a = a + n))));
    expect(a).toBe(2);
  });

  it('should show usage of fakeAsync', async () => {
    let a = 1;
    of(1).subscribe(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });
});
