import { appApi } from "@/lib/appApi";

export const templateApi = appApi.injectEndpoints({
    tagTypes: ["Location"], // Tag for location-related endpoints
    endpoints: (builder) => ({
        getAllTemplates: builder.query({
            query: () => "/templates/get-all",
            // providesTags: (result, error, id) => [{ type: 'Location', id }], // Provides the location data tag with the ID
        }),
        getTemplateById: builder.query({
            query: (id) => `/templates/get/${id}`,
            // providesTags: (result, error, id) => [{ type: 'Location', id }], // Provides the location data tag with the ID
        }),
        deleteTempleteById:builder.mutation({
            query:(id)=>{
                return {
                    url:`/templates/delete/${id}`,
                    method:'DELETE'
                }
            }
        })

    }),
});

export const {
    useGetAllTemplatesQuery,
    useGetTemplateByIdQuery,
    useDeleteTempleteByIdMutation
} = templateApi;
