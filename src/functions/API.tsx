import axios from "axios";
let API = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  console.log("Development");
  API = "http://localhost:8080/api";
} else {
  console.log("Prod");
  API = "/api";
}

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
  return res.data.data.result;
};

export const CalculateDirections = async (
  destination: string,
  origin: string,
  waypoints?: string[]
): Promise<google.maps.DirectionsResult> => {
  const res = await axios.post(API + `/directions`, {
    destination,
    origin,
    waypoints,
  });
  const result: any = res.data.data;
  let newRequest: any = result;
  newRequest["request"] = { travelMode: "DRIVING" };
  let bounds = new google.maps.LatLngBounds(
    result.routes[0].bounds.southwest,
    result.routes[0].bounds.northeast
  );

  newRequest.routes[0].bounds = bounds;
  newRequest.routes[0].overview_polyline =
    newRequest.routes[0].overview_polyline.points;

  return newRequest;
};

export const NearbySearch = async ({
  location,
  radius,
  type,
  keyword,
}: {
  location: { lat: any; lng: any };
  radius: number;
  type?: string;
  keyword?: string;
}) => {
  const res = await axios.post(API + `/nearbysearch`, {
    location,
    radius,
    type,
    keyword,
  });
  return res.data.data;
};
