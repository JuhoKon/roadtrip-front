import axios from "axios";

const API = "http://localhost:8080/api";

type Type = "route" | "geocode" | "locality" | "political";
type Photo = {
  height: number;
  width: number;
  html_attributions: string;
  photo_reference: string;
};
export type AutoCompleteResult = {
  description: string;
  matched_substring: any[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: any[];
    secondary_text: string;
  };
  terms: string[];
  types: Type[];
};
export type PlaceDetailResult = {
  address_components: any;
  adr_address: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  photos: Photo[];
  place_id: string;
  reference: string;
  types: Type[];
  url?: string;
  utc_offset: number;
  website?: string;
};

export const GoogleMapsAutoComplete = async (
  query: string
): Promise<AutoCompleteResult[]> => {
  const res = await axios.get(API + `/autocomplete?query=${encodeURI(query)}`);
  return res.data.data.predictions as AutoCompleteResult[];
};

export const RetrievePlaceDetails = async (
  place_id: string
): Promise<PlaceDetailResult> => {
  const res = await axios.get(
    API + `/place_details?placeID=${encodeURI(place_id)}`
  );
  console.log(res);
  return res.data.data.result;
};
