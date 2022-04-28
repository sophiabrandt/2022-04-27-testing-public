import { HttpClient, HttpParams } from '@angular/common/http';
import { fakeAsync } from '@angular/core/testing';
import { createSpyFromClass } from 'jest-auto-spies';
import { asyncScheduler, firstValueFrom, of, scheduled } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { AddressLookuper } from './address-lookuper.service';
import { assertType } from './assert-type';

describe('Address Lookuper', () => {
  for (const { response, isValid } of [
    { response: [true, {}], isValid: true },
    { response: [], isValid: false }
  ]) {
    it(`should return ${isValid} for ${response}`, async () => {
      const httpClientStub = assertType<HttpClient>({
        get: () => scheduled([response], asyncScheduler)
      });

      const lookuper = new AddressLookuper(httpClientStub);
      expect(await firstValueFrom(lookuper.lookup('Domgasse 5'))).toBe(isValid);
    });
  }

  it('should use the HttpClient with the right parameters', fakeAsync(() => {
    const httpClientMock = createSpyFromClass(HttpClient);
    httpClientMock.get.mockReturnValue(of([]));

    // const httpClientMock = {
    //   get: jest.fn<Observable<string[]>, [string, { params: HttpParams }]>()
    // };

    const lookuper = new AddressLookuper(httpClientMock);
    lookuper.lookup('Domgasse 5');

    expect(httpClientMock.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
      }
    );
  }));

  it('should throw an error if no street number is given', () => {
    const lookuper = new AddressLookuper(assertType<HttpClient>());

    expect(() => lookuper.lookup('Domgasse')).toThrowError(
      'Could not parse address. Invalid format.'
    );
  });

  it(
    'should use rxjs-marbles',
    marbles((m) => {
      const httpClientStub = assertType<HttpClient>({
        get: () => m.cold('750ms a', { a: [true] })
      });

      const lookuper = new AddressLookuper(httpClientStub);
      m.expect(lookuper.lookup('Domgasse 5')).toBeObservable('750ms b', { b: true });
    })
  );
});
