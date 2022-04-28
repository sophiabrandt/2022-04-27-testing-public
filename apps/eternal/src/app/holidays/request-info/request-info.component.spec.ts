import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { asyncScheduler, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentModule } from './request-info.component.module';

it.each([
  { query: 'Domgasse 5', message: 'Brochure sent' },
  { query: 'Domgasse 15', message: 'Address not founded' }
])('should return $message for $query', ({ query, message }) =>
  fakeAsync(() => {
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

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('[data-testid=address]'))
      .nativeElement as HTMLInputElement;
    const button = fixture.debugElement.query(By.css('[data-testid=btn-search]'))
      .nativeElement as HTMLButtonElement;

    input.value = query;
    input.dispatchEvent(new CustomEvent('input'));
    button.click();

    tick();
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('[data-testid=lookup-result]'))
      .nativeElement as HTMLParagraphElement;

    expect(messageElement.textContent).toBe(message);
  })()
);
