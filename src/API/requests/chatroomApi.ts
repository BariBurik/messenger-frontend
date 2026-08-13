import { createApi } from "@reduxjs/toolkit/query/react"
import { graphqlBaseQuery } from "./apiSetup"
import { IChatroomCreateArgs } from "@/components/CreateChatModal/CreateChatModal"
import { IChatroom, IUsersChatrooms, IChatroomQuery } from "@/types/Chat/APITypes";
import { IUser } from "@/types/User/APITypes";

export const chatAPI = createApi({
    reducerPath: "chatAPI",
    baseQuery: graphqlBaseQuery({ baseUrl: __GRAPHENE_URL__ }),
    tagTypes: ["Chatroom", "User"],
    endpoints: (builder) => ({
        chatroomCreate: builder.mutation<IChatroom, { avatar: File | null, name: string, users: IChatroomCreateArgs}>({
            query: ({ name, users, avatar }) => {
                const formData = new FormData();
                formData.append('operations', JSON.stringify({
                    query: `
                      mutation ChatroomCreate ($avatar: Upload, $name: String!, $users: ChatroomCreateUsersType!) {
                          chatroomCreate(name: $name, users: $users, avatar: $avatar) {
                              name
                              participants {
                                  name
                              }
                          }
                      }
                    `,
                    variables: {
                        name,
                        users,
                        avatar: null  // Указываем `null` по умолчанию
                    }
                }));
                formData.append('map', JSON.stringify({
                    "1": ["variables.avatar"]
                }));
                if (avatar) {
                    formData.append('1', avatar);  // Убедитесь, что `1` соответствует ключу в `map`
                } else {
                    formData.append('map', JSON.stringify({}));
                }
                
                return { body: formData }
            }
        }),
        favoriteCreate: builder.mutation<IChatroom, void>({
            query: () => ({
                body: JSON.stringify({
                    query: `mutation FavoriteCreate {
                        favoriteCreate {
                            name
                        }
                    }`
                }),
            }),
            invalidatesTags: [{ type: 'Chatroom', id: 'LIST' }]
        }),
        chatroomUpdate: builder.mutation<IChatroom, { id: number, name: string, users: IChatroomCreateArgs, avatar: File | null }>({
            query: ({ id, name, users, avatar }) => {
                const formData = new FormData();
                formData.append('operations', JSON.stringify({
                    query: `mutation ChatroomUpdate ($id: Int!, $name: String!, $users: ChatroomCreateUsersType!, $avatar: Upload) {
                        chatroomUpdate(id: $id, name: $name, users: $users, avatar: $avatar) {
                            name
                            participants {
                                name
                            }
                        }
                    }`,
                    variables: {
                        id,
                        name,
                        users,
                        avatar: null
                    }
                }));
                formData.append('map', JSON.stringify({
                    "1": ["variables.avatar"]
                }));
                if (avatar) {
                    formData.append('1', avatar);  
                } else {
                    formData.append('map', JSON.stringify({}));
                }
                
                return { body: formData }
            }
        }),
        chatroomDelete: builder.mutation<IChatroom, { id: number }>({
            query: ({ id }) => ({
                body: JSON.stringify({
                    query: `mutation ChatroomDelete ($id: Int!) {
                        chatroomDelete(id: $id) {
                            name
                            participants {
                                name
                            }
                        }
                    }`,
                    variables: {
                        id
                    }
                })
            })
        }),
        usersWithoutChats: builder.query<IUser[], string>({
            query: (searchQuery) => ({
                body: JSON.stringify({
                    query: `
                        query UsersWithoutChatsWithCurrentUser ($searchQuery: String!) {
                            usersWithoutChatWithThisUser(searchQuery: $searchQuery) {
                                name
                            }
                        }
                    `,
                    variables: {
                        searchQuery
                    }
                }),
                providesTags: (result: IUser[]) => 
                    result
                        ? result.map(({name}) => ({ type: "User", id: name }))
                        : ["User"]
            })          
        }),
        usersChatrooms: builder.query<IUsersChatrooms, void>({
            query: () => ({
                body: JSON.stringify({
                    query: `
                        query UsersChatrooms {
                            userChatrooms {
                                id
                                name
                                avatar
                                participants {
                                    name
                                }
                            }
                        }
                    `
                }),
            })
        }),
        chatroom: builder.query<IChatroom, string>({
            query: (name) => ({
                body: JSON.stringify({
                    query: `
                        query Chatroom ($name: String!) {
                            chatroom(name: $name) {
                                id
                                name
                                avatar
                                participants {
                                    id
                                    name
                                    avatar
                                }
                            }
                        }
                    `,
                    variables: {
                        name
                    }
                })
            })
        }),
        filteredChatrooms: builder.query<IChatroomQuery[], string>({
            query: (searchQuery) => ({
                body: JSON.stringify({
                    query: `
                        query FilteredChatrooms ($searchQuery: String) {
                            filteredChatrooms(searchQuery: $searchQuery) {
                                name
                                avatar
                            }
                        }
                    `,
                    variables: {
                        searchQuery: searchQuery ? searchQuery : ''
                    }
                })
            })
        })
    })
})

export const {
    useChatroomCreateMutation,
    useFavoriteCreateMutation,
    useChatroomUpdateMutation,
    useChatroomDeleteMutation,
    useUsersWithoutChatsQuery,
    useUsersChatroomsQuery,
    useChatroomQuery,
    useFilteredChatroomsQuery
}  = chatAPI