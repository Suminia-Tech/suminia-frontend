import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const firebaseApi = createApi({
  reducerPath: 'firebaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://firestore.googleapis.com/v1',
  }),
  endpoints: (builder) => ({
    // Firebase Firestore endpoints can be added here
    // This keeps Firebase data separate from Suminia backend data
  }),
});

export const {} = firebaseApi;
