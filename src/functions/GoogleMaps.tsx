import axios from "axios";
const API = "http://localhost:8080/api";

export const GoogleMapsAutoComplete = async (query: string): Promise<any[]> => {
  const res = await axios.get(API + `/autocomplete?query=${query}`);
  return res.data;
};
