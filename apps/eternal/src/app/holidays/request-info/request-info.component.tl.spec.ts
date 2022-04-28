import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { provideMock } from '@testing-library/angular/jest-utils';
import userEvent from '@testing-library/user-event';
import { asyncScheduler, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentModule } from './request-info.component.module';

describe('Request Info with Testing Library', () => {
  describe('Component Test', () => {
    const setup = async () =>
      render(RequestInfoComponent, {
        imports: [RequestInfoComponentModule],
        providers: [provideMock(AddressLookuper)],
        excludeComponentDeclaration: true
      });

    it('should instantiate', async () => {
      const renderResult = await setup();
      expect(renderResult.fixture.componentInstance).toBeInstanceOf(RequestInfoComponent);
    });

    it.each([
      { input: 'Domgasse 5', message: 'Brochure sent' },
      { input: 'Domgasse 15', message: 'Address not found' }
    ])('should show $message for $input', async ({ input, message }) => {
      const renderResult = await setup();
      const lookuper = TestBed.inject(AddressLookuper);
      jest
        .spyOn(lookuper, 'lookup')
        .mockImplementation((query) => scheduled([query === 'Domgasse 5'], asyncScheduler));

      userEvent.type(screen.getByTestId('address'), input);
      userEvent.click(screen.getByTestId('btn-search'));
      screen.logTestingPlaygroundURL();
      expect(await screen.findByText(message)).toBeTruthy();
    });
  });

  describe('Integration Test', () => {
    const setup = async () =>
      render(RequestInfoComponent, {
        imports: [RequestInfoComponentModule, HttpClientTestingModule],
        excludeComponentDeclaration: true
      });

    it('should instantiate', async () => {
      const renderResult = await setup();
      expect(renderResult.fixture.componentInstance).toBeInstanceOf(RequestInfoComponent);
    });

    it.each([
      { input: 'Domgasse 5', message: 'Brochure sent', response: [true] },
      { input: 'Domgasse 15', message: 'Address not found', response: [] }
    ])('should show $message for $input', async ({ input, message, response }) => {
      await setup();

      userEvent.type(screen.getByTestId('address'), input);
      userEvent.click(screen.getByTestId('btn-search'));

      TestBed.inject(HttpTestingController)
        .expectOne((req) => !!req.url.match(/nominatim/))
        .flush(response);

      expect(await screen.findByText(message)).toBeTruthy();
    });
  });
});
