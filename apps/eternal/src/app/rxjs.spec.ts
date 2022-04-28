import { marbles } from 'rxjs-marbles/jest';
import { delay, filter, first, map } from 'rxjs/operators';

it(
  'should test a simple observable',
  marbles((m) => {
    const source$ = m.cold('1s a 1s b', { a: 100, b: 200 });
    const destination$ = source$.pipe(
      delay(100),
      map((n) => n / 2),
      filter((n) => n > 75),
      first()
    );
    m.expect(destination$).toBeObservable('1100ms 1001ms (y|)', { x: 50, y: 100 });
  })
);
