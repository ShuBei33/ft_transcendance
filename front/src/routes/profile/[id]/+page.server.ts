export const ssr = false;
export const csr = true;

// import { readonlyAxiosInstance } from "$lib/stores/api.js";
import { axiosInstance } from "$lib/stores/api.js";
import { token } from "$lib/stores/session.js";
import axios from "axios";

export function load({ params }) {
  const { id } = params;
  // let _res = undefined;
  // let _token = undefined;
  // token.subscribe((value) => (_token = value));
  //   if (_token) {
  //     const userApiInstance = axios.create({
  //       baseURL: "http://localhost:5500",
  //       withCredentials: true,
  //       timeout: 10000,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${_token}`,
  //       },
  //     });
  //     userApiInstance.get(`/user/${id}`).then((res) => (_res = res));
  //   }
  // axiosInstance.subscribe((_axios) => {
  //   try {
  //     _axios.get(`/user/${id}`).then((res) => {
  //       _res = res;
  //     });
  //   } catch (e) {
  //     // console.log("")
  //   }
  // });
  // apiInstance.subscribe((value) => {
  //   value.get(`/user/${id}`);
  // });
  return {
    id: params.id,
  };
}
