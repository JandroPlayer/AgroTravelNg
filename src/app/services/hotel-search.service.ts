// hotel-search.service.ts
import { Injectable } from '@angular/core';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class HotelSearchService {
  private placesService: any;

  constructor() {
    const map = new google.maps.Map(document.createElement('div'));
    this.placesService = new google.maps.places.PlacesService(map);
  }

  searchHotels(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.placesService.textSearch({ query }, (results: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  }

  getDetails(placeId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        { placeId, fields: ['name', 'formatted_address', 'geometry', 'rating', 'formatted_phone_number', 'website', 'url', 'place_id'] },
        (place: any, status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            reject(status);
          }
        }
      );
    });
  }
}
