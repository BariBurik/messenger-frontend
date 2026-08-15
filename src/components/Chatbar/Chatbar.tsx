import styles from "./Chatbar.module.scss";
import Search from "../UI/Search/Search";
import { useState, useMemo, useCallback, useEffect } from "react";
import CreateChatModal from "../CreateChatModal/CreateChatModal";
import { useUsersChatroomsQuery } from "@/store";
import Loader from "../UI/Loader/Loader";
import { memo } from "react";
import ChatItem from "../ChatItem";
import { useSubscription } from "@apollo/client";
import { CHATROOM_DELETE_SUBSCRIPTION, CHATROOM_UPDATE_SUBSCRIPTION, MESSAGE_SUBSCRIPTION, NEW_CHATROOM_SUBSCRIPTION } from "@/API/requests/subscriptionsAPI";
import { useAppSelector } from "@/hooks/redux";

// Основной компонент Chatbar
function Chatbar() {
    const userAgent = navigator.userAgent || '';  
    const isMobile = /android|ios|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    const [isOpen, setIsOpen] = useState(false)
    const [chatTimes, setChatTimes] = useState<Record<string, number>>({});
    const [doRefetch, setDoRefetch] = useState(false);
    const {data: userChatrooms, isLoading, refetch} = useUsersChatroomsQuery()
    const tempToken = useAppSelector(state => state.user.tempToken)

    const updateChatTime = useCallback((chatName: string, time: string | null) => {
        setChatTimes(prev => ({
            ...prev, 
            [chatName]: time ? new Date(time).getTime() : 0
        }));
    }, []); 

    const handleSubscriptionData = (data: any) => {
        if (data) {
            refetch();
            setDoRefetch(true);
        }
    };

    useSubscription(
        NEW_CHATROOM_SUBSCRIPTION,
        {
            skip: !tempToken, // Пропускаем подписку если нет токена
            variables: {
                accessToken: tempToken
            },
            onSubscriptionData: ({ subscriptionData }) => {
                handleSubscriptionData(subscriptionData?.data?.newChatroom);
            },
            onError: (error) => {
                console.error('New chat subsription error:', error);
            }
        }
    );

    useSubscription(
        CHATROOM_UPDATE_SUBSCRIPTION,
        {
            skip: !tempToken,
            variables: {
                accessToken: tempToken
            },
            onSubscriptionData: ({ subscriptionData }) => {
                handleSubscriptionData(subscriptionData?.data?.updatedChatroom);
            },
            onError: (error) => {
                console.error('Chat update subsription error:', error);
            }
        }
    );

    useSubscription(
        CHATROOM_DELETE_SUBSCRIPTION,
        {
            skip: !tempToken,
            variables: {
                accessToken: tempToken
            },
            onSubscriptionData: ({ subscriptionData }) => {
                handleSubscriptionData(subscriptionData?.data?.deletedChatroom);
            },
            onError: (error) => {
                console.error('Chat deletion subsription error:', error);
            }
        }
    );

    const sortedChats = useMemo(() => {
        if (!userChatrooms?.userChatrooms) return [];
        return [...userChatrooms.userChatrooms]
            .sort((a, b) => {
                const timeA = chatTimes[a.name] || 0;
                const timeB = chatTimes[b.name] || 0;
                return timeB - timeA;
            });
    }, [userChatrooms, chatTimes]);

    return ( 
        <div className={`${isMobile ? styles.mobile_chatbar_and_search : styles.chatbar_and_search}`}>
            
            <div className={`${isMobile ? styles.mobile_chatbar : styles.chatbar}`}>
                {isLoading ? <Loader/> : 
                    sortedChats.map((chatItem) => (
                        <ChatItem 
                            key={`${chatItem.id}-${chatTimes[chatItem.name] || 0}`}
                            chatItem={{
                                id: Number(chatItem.id),
                                name: chatItem.name,
                                avatar: chatItem.avatar,
                                participants: chatItem.participants,
                                onTimeUpdate: (time: string | null) => updateChatTime(chatItem.name, time),
                                doRefetch: doRefetch,
                                setDoRefetch: setDoRefetch
                            }}
                        />
                    ))
                }
            </div>
            <button onClick={() => setIsOpen(true)} className={`${isMobile ? styles.mobile_button : styles.button}`}>
                Create chat
            </button>
            <CreateChatModal isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
    );
}

export default memo(Chatbar);