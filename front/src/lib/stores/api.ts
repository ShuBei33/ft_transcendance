import type { Writable, Readable } from "svelte/store";
import { writable, readable, readonly, derived } from "svelte/store";
import axios, { type CreateAxiosDefaults } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

export const axiosConfig = writable<CreateAxiosDefaults<any> | undefined>(
  undefined
);

export const axiosInstance = derived(axiosConfig, ($axiosConfig) =>
  axios.create($axiosConfig)
);
// export const axiosInstance = writable<AxiosInstance>(axios.create());
// export const readonlyAxiosInstance = derived(
//   axiosInstance,
//   ($axiosInstance) => $axiosInstance
// );
