// https://api.setlist.fm/docs/1.0/syntax_json.html

export interface Artist {
  mbid: string;
  tmid: number;
  name: string;
  sortName: string;
  disambiguation: string;
  url: string;
}

export interface Artists {
  artist: Artist[];
  total: number;
  page: number;
  itemsPerPage: number;
}

export interface Cities {
  cities: City[];
  total: number;
  page: number;
  itemsPerPage: number;
}

export interface City {
  id: string;
  name: string;
  stateCode: string;
  state: string;
  coords: Coords;
  country: Country;
}

export interface Coords {
  long: number;
  late: number;
}

export interface Countries {
  country: Country[];
  total: number;
  page: number;
  itemsPerPage: number;
}

export interface Country {
  code: string;
  name: string;
}

export interface Error {
  code: number;
  status: string;
  message: string;
  timestamp: string;
}

export interface Set {
  name: string;
  encore: number;
  song: Song[];
}

export interface Setlist {
  artist: Artist;
  venue: Venue;
  tour: Tour;
  set: Set[];
  info: string;
  url: string;
  id: string;
  versionId: string;
  lastFmEventId?: number;
  eventDate: string;
  lastUpdated: string;
}

export interface Setlists {
  setlist: Setlist[];
  total: number;
  page: number;
  itemsPerPage: number;
}

export interface Song {
  name: string;
  with: Artist;
  cover: Artist;
  info: string;
  tape: boolean;
}

export interface Tour {
  name: string;
}

export interface User {
  userId: string;
  fullname?: string;
  lastFm?: string;
  mySpace?: string;
  twitter?: string;
  flicker?: string;
  website?: string;
  about?: string;
  url: string;
}

export interface Venue {
  city: City;
  url: string;
  id: string;
  name: string;
}

export interface Venues {
  venue: Venue[];
  total: number;
  page: number;
  itemsPerPage: number;
}
