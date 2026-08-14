import { useAppSelector } from "@/hooks/redux";
import { useEffect, memo } from "react";
import { useGetMessagesQuery } from "@/store";
import ChatLink from "./ChatLink/ChatLink";
import { MESSAGE_SUBSCRIPTION } from "@/API/requests/subscriptionsAPI";
import { useSubscription } from "@apollo/client";

interface IChatItem {
    id: number;
    name: string;
    avatar?: string;
    participants: Array<{ name: string }>;
    onTimeUpdate: (time: string | null) => void;
    doRefetch: boolean;
    setDoRefetch: (doRefetch: boolean) => void;
}

const ChatItem = memo(({ chatItem }: { chatItem: IChatItem }) => {

    useSubscription(
        MESSAGE_SUBSCRIPTION,
        {
            variables: {
                chatroomNames: [chatItem.name] // Подписываемся только на один чат
            },
            onSubscriptionData: ({ subscriptionData }) => {
                console.log('Новое сообщение в чате:', chatItem.name, subscriptionData);
                if (subscriptionData?.data?.chatroomMessage) {
                    // Обновляем время
                    chatItem.onTimeUpdate(subscriptionData.data.chatroomMessage.createdAt);
                    // Обновляем последнее сообщение
                    refetch();
                }
            }
        }
    );

    const formatMessageTime = (createdAt: string) => {
        const messageDate = new Date(createdAt);
        const today = new Date();
        
        // Сбрасываем время до начала дня для корректного сравнения дат
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const messageDayStart = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
        
        // Если сообщение от сегодня, показываем только время
        if (todayStart.getTime() === messageDayStart.getTime()) {
            return `${messageDate.getHours()}:${String(messageDate.getMinutes()).padStart(2, '0')}`;
        }

        // Массив дней недели
        const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        return weekDays[messageDate.getDay()];
    }

    const {data: lastMsg, refetch} = useGetMessagesQuery(
        {chatroomName: chatItem.name, limit: 1}
    );

    useEffect(() => {
        if (chatItem.doRefetch) {
            refetch()
            chatItem.setDoRefetch(false)
        }
    }, [chatItem.doRefetch])

    useEffect(() => {
        chatItem.onTimeUpdate(lastMsg?.getMessages[0]?.createdAt || null);
    }, [lastMsg?.getMessages[0]?.createdAt]);

    return (
        <ChatLink 
            key={chatItem.id} 
            avatar={chatItem.avatar}
            name={chatItem.name} 
            lastMessage={lastMsg?.getMessages[0]?.text || ''} 
            time={lastMsg?.getMessages[0]?.createdAt ? 
                formatMessageTime(lastMsg?.getMessages[0]?.createdAt) 
                : null} 
        />
    );
});

export default ChatItem;