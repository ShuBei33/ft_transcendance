import type { Writable, Readable } from "svelte/store";
import { writable, readable, readonly, derived } from "svelte/store";
import axios, { type CreateAxiosDefaults } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
// # Api Instances and config
// ## Main Server
export const axiosConfig = writable<CreateAxiosDefaults<any> | undefined>(undefined);

export const axiosInstance = derived(axiosConfig, ($axiosConfig) => axios.create($axiosConfig));
// ## FileService
export const axiosFsConfig = writable<CreateAxiosDefaults<any> | undefined>(undefined);

export const axiosFsInstance = derived(axiosFsConfig, ($axiosFsConfig) =>
  axios.create($axiosFsConfig)
);
