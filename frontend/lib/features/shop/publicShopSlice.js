import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicShopSlice = createApi({
  reducerPath: "publicShop",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/shops",
  }),
  tagTypes: ["Shop", "WebBuilders"],
  endpoints: (builder) => ({
    getShops: builder.query({
      query: () => "/get-all",
      providesTags: ["Shop"],
    }),
    getshop: builder.query({
      query: (shopId) => `get/${shopId}/`,
      providesTags: ["WebBuilders"],
    }),
    getshopMerchant: builder.query({
      query: (merchantId) => `getshopbymerchant/${merchantId}/`,
      providesTags: ["WebBuilders"],
    }),
    getshopCategory: builder.query({
      query: () => `shopCategory/`,
      providesTags: ["WebBuilders"],
    }),

  }),
});

export const {
  useGetShopsQuery,
  useGetshopQuery,
  useGetshopMerchantQuery,
  useGetshopCategoryQuery
} = publicShopSlice;