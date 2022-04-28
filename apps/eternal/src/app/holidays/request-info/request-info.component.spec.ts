import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { asyncScheduler, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentModule } from './request-info.component.module';

describe('Request Info Component', () => {
  it.each([
    { query: 'Domgasse 5', message: 'Brochure sent' },
    { query: 'Domgasse 15', message: 'Address not found' }
  ])('should return $message for $query', ({ query, message }) =>
    fakeAsync(async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, RequestInfoComponentModule],
        providers: [
          {
            provide: AddressLookuper,
            useValue: {
              lookup: (query: string) => scheduled([query === 'Domgasse 5'], asyncScheduler)
            }
          }
        ]
      }).createComponent(RequestInfoComponent);

      const loader = await TestbedHarnessEnvironment.loader(fixture);

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('[data-testid=btn-search]'))
        .nativeElement as HTMLButtonElement;

      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '[data-testid=address]' })
      );
      await input.setValue(query);

      button.click();

      tick();
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('[data-testid=lookup-result]'))
        .nativeElement as HTMLParagraphElement;

      expect(messageElement.textContent).toBe(message);
    })()
  );
});
