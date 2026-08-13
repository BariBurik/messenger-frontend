import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlBaseQuery } from "./apiSetup";
import { IUserRegister, IUserUpdate, IUser, ReLogin, IGetUsersPerQuery } from "@/types/User/APITypes";




export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: graphqlBaseQuery({ baseUrl: __GRAPHENE_URL__ }),
    tagTypes: ["UserChange", "UserCreate"],
    endpoints: (builder) => ({
      // Мутации
      userRegister: builder.mutation<{ message: string }, IUserRegister>({
        query: (user) => ({
          body: JSON.stringify({
            query: `
              mutation UserRegister($user: UserRegisterType!) {
                userRegister(user: $user) {
                  message
                }
              }
            `,
            variables: { user },
          }),
        }),
        invalidatesTags: (result, error, { id }) => [{type: 'UserCreate', id}],
      }),
      userLogin: builder.mutation<{ message: string }, { email: string; password: string }>({
        query: ({ email, password }) => ({
          body: JSON.stringify({
            query: `
              mutation UserLogin($email: String!, $password: String!) {
                userLogin(email: $email, password: $password) {
                  message
                }
              }
            `,
            variables: { email, password },
          }),
        }),
      }),
      userUpdate: builder.mutation<{ message: string }, IUserUpdate>({
        query: (user) => {
          const formData = new FormData();
          formData.append('operations', JSON.stringify({
            query: `
              mutation UserUpdate($newUser: UserRegisterType!) {
                userUpdate(newUser: $newUser) {
                  message
                }
              }
            `,
            variables: {
              newUser: {
                name: user.name,
                email: user.email,
                password: user.password,
                avatar: null  // avatar will be set in the map
              }
            },
          }));
          formData.append('map', JSON.stringify({
            "1": ["variables.newUser.avatar"]
          }));
          if (user.avatar) {
            formData.append('1', user.avatar);
          } else {
            formData.append('map', JSON.stringify({}));
          }
          return { body: formData };
        },
        invalidatesTags:['UserChange'],
      }),
      // Запросы
      userGetByID: builder.query<IUser, number>({
        query: (id) => ({
          body: JSON.stringify({
            query: `
              query UserGetByID($id: Int!) {
                user(id: $id) {
                  id
                  name
                }
              }
            `,
            variables: { id },
          }),
        }),
      }),
      userReLogin: builder.query<ReLogin, void>({
        query: () => ({
          body: JSON.stringify({
            query: `
              query ReLogin {
                userReLogin {
                  user {
                    id
                    email
                    name
                    avatar
                  }
                  message
                  tempToken
                }
              }
            `,
          }),
        }),
        keepUnusedDataFor: 600,
        providesTags: ["UserChange"],
      }),
      getUsersPerQuery: builder.query<IGetUsersPerQuery, { searchQuery: string; excludes?: number[] }>({
        query: ({ searchQuery, excludes = null }) => ({
          body: JSON.stringify({
            query: `
              query GetUsersPerQuery ($searchQuery: String!, $excludes: [Int!]) {
                getUsersPerQuery(searchQuery: $searchQuery, excludes: $excludes) {
                  id
                  name
                  avatar
                }
              }
            `,
            variables: { searchQuery, excludes },
          }),
        }),
      }),      
    }),
  });
  
  export const {
    useUserRegisterMutation,
    useUserLoginMutation,
    useUserUpdateMutation,
    useUserGetByIDQuery,
    useUserReLoginQuery,
    useGetUsersPerQueryQuery
  } = userAPI