import axios, { AxiosRequestConfig } from 'axios';

export const UNSPLASH_API_KEY = 'https://api.unsplash.com';
export enum UnsplashOrderBy {
    LATEST = 'latest',
    OLDEST = 'oldest',
    POPULAR = 'popular',
}

export type UnsplashUrls = {
    thumb: string,
    regular: string,
    raw: string,
    full: string,
    small: string,
};

export interface UnsplashResponse {
    id: string,
    urls: UnsplashUrls,
    alt_description: string,
    description: string,

    // other props that nore required.
    [key: string]: string | any
}

export default function fetchImages(
    perPage: number,
    page? : number,
    orderBy : UnsplashOrderBy = UnsplashOrderBy.POPULAR
) {
    const axiosConfig: AxiosRequestConfig = {
        // NOTE: tried to use authentication headers but failed. Error in their end.
        params: { per_page: perPage,
                  page,
                  order_by: orderBy,
                  client_id:  `${process.env.REACT_APP_UNSPLASH_API_ACCESS_KEY}`
         }
    };
    return axios.get<UnsplashResponse[]>(`${UNSPLASH_API_KEY}/photos`, axiosConfig)
                .then(response => response.data);
}
