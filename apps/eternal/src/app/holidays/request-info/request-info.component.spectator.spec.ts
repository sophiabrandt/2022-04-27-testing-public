import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { byTestId, createComponentFactory } from '@ngneat/spectator/jest';
import { asyncScheduler, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentModule } from './request-info.component.module';

describe('Request Info Spectator', () => {
  const inputSelector = '[data-testid=address]';
  const buttonSelector = '[data-testid=btn-search]';
  const lookupSelector = byTestId('lookup-result');

  describe('Component Test', () => {
    const createComponent = createComponentFactory({
      component: RequestInfoComponent,
      imports: [RequestInfoComponentModule],
      mocks: [AddressLookuper],
      declareComponent: false
    });

    const setup = () => {
      const spectator = createComponent();
      const lookuperMock = spectator.inject(AddressLookuper);
      return { spectator, lookuperMock };
    };

    it('should instantiate', () => {
      const { spectator } = setup();
      expect(spectator.component).toBeInstanceOf(RequestInfoComponent);
    });

    it.each([
      { input: 'Domgasse 5', message: 'Brochure sent' },
      { input: 'Domgasse 15', message: 'Address not found' }
    ])('should show $message for $input', ({ input, message }) =>
      fakeAsync(() => {
        const { spectator, lookuperMock } = setup();

        lookuperMock.lookup.mockImplementation((query) =>
          scheduled([query === 'Domgasse 5'], asyncScheduler)
        );

        spectator.typeInElement(input, inputSelector);
        spectator.click(buttonSelector);
        spectator.tick();
        const messageBox = spectator.query(lookupSelector);
        expect(messageBox).toHaveText(message);
      })()
    );
  });

  describe('Integration Test', () => {
    const createComponent = createComponentFactory({
      component: RequestInfoComponent,
      imports: [RequestInfoComponentModule, HttpClientTestingModule],
      declareComponent: false
    });

    it('should instantiate', () => {
      const spectator = createComponent();
      expect(spectator.component).toBeInstanceOf(RequestInfoComponent);
    });

    it.each([
      { input: 'Domgasse 5', message: 'Brochure sent', response: [true] },
      { input: 'Domgasse 15', message: 'Address not found', response: [] }
    ])('should show $message for $input', ({ input, message, response }) =>
      fakeAsync(() => {
        const spectator = createComponent();
        spectator.typeInElement(input, inputSelector);
        spectator.click(buttonSelector);

        spectator
          .inject(HttpTestingController)
          .expectOne((req) => !!req.url.match(/nominatim/))
          .flush(response);

        spectator.detectChanges();
        expect(spectator.query(lookupSelector)).toHaveText(message);
      })()
    );
  });
});
