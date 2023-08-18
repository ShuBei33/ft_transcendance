import type { Writable, Readable } from "svelte/store";
import { writable, readable, readonly } from "svelte/store";
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

export const axiosInstance = writable<AxiosInstance>(axios.create());
export const apiInstance = readonly(axiosInstance);
