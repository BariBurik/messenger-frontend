import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Message from "../Message/Message";
import styles from "./MessageWindow.module.scss";
import { useParams } from "react-router-dom";
import { useSubscription } from "@apollo/client";
import { MESSAGE_SUBSCRIPTION } from "@/API/requests/subscriptionsAPI";
import { addMessagesToChat, addMessageToChat } from "@/store/ActionCreators/CurrentChat";
import { useEffect, useRef, useState } from "react";
import { useGetMessagesQuery } from "@/API/requests/messagesApi";
import Loader from "../UI/Loader/Loader";
import { IMessage } from "@/types/Message/SliceTypes";
interface MessageGroup {
    date: Date;
    messages: IMessage[];
}

interface MessageGroups {
    [key: string]: MessageGroup;
}

function MessageWindow() {
    const observerTarget = useRef<HTMLDivElement | null>(null);
    const messageWindowRef = useRef<HTMLDivElement | null>(null);
    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messages = useAppSelector(state => state.currentChat.messages)
    const user = useAppSelector(state => state.user)
    const [moreMessages, setMoreMessages] = useState(false)
    const dispatch = useAppDispatch()
    const { name: chatroomName } = useParams()
    const { data: lastMessages } = useGetMessagesQuery({
        chatroomName: chatroomName,
        limit: 100,
        beforeId: Number(messages[messages.length - 1]?.id)
    }, { skip: !moreMessages })


    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (loadingTimeoutRef.current) {
                    clearTimeout(loadingTimeoutRef.current);
                }

                // Устанавливаем новый таймер
                loadingTimeoutRef.current = setTimeout(() => {
                    setMoreMessages(true);
                }, 500); // задержка в 500мс
            }
        });
    }

    useEffect(() => {
        const scrollContainer = messageWindowRef.current
        const oldScrollHeight = scrollContainer?.scrollHeight || 0
        const oldScrollTop = scrollContainer?.scrollTop || 0;

        if (lastMessages?.getMessages) {
            addMessagesToChat(dispatch, lastMessages.getMessages.map(message => ({
                ...message,
                id: Number(message.id),
                createdAt: message.createdAt,
                text: message.text,
                user: {
                    id: Number(message.user.id),
                    name: message.user.name,
                    avatar: message.user.avatar
                }
            })))
        }

        requestAnimationFrame(() => {
            if (scrollContainer) {
                const newScrollHeight = scrollContainer.scrollHeight;
                const scrollDiff = newScrollHeight - oldScrollHeight;
                scrollContainer.scrollTop = oldScrollTop + scrollDiff;
            }
        })

        setMoreMessages(false);
    }, [lastMessages?.getMessages])

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            root: document.querySelector(`.${styles.message_window}`),
            rootMargin: '0px',
            threshold: 0.1
        });

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        }
    }, [handleIntersection]);

    useSubscription(
        MESSAGE_SUBSCRIPTION,
        {
            variables: { chatroomNames: [chatroomName] },
            onSubscriptionData: ({ subscriptionData }) => {
                if (subscriptionData?.data?.chatroomMessage) {
                    const newMessage = subscriptionData.data.chatroomMessage;
                    const messageExists = messages.some(msg => msg.id === newMessage.id);
                    if (!messageExists) {
                        addMessageToChat(dispatch, newMessage);
                    }
                }
            }
        }
    );

    const formatTime = (date: Date) => {
        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    const formatDate = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long'
        });
    }

    const groupedMessages = () => {
        const groups: MessageGroups = messages.reduce<MessageGroups>((acc, message) => {
            console.log(message.user)
            const date = new Date(message.createdAt);
            const dateString = date.toDateString();
            
            if (!acc[dateString]) {
                acc[dateString] = {
                    date: date,
                    messages: []
                };
            }
            
            acc[dateString].messages.push(message);
            return acc;
        }, {});

        Object.values(groups).forEach(group => {
            group.messages.reverse();
        });

        return Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    return ( 
        <div ref={messageWindowRef} className={styles.message_window}>
            {groupedMessages().map(group => (
                <div key={group.date.toISOString()} className={styles.message_group}>
                    <div className={styles.date_divider}>
                        <span>{formatDate(group.date)}</span>
                    </div>
                    {group.messages.map(message => (
                        <div key={message.id} className={message.user.id == user.id ? styles.message_from : styles.message_to}>
                            <Message 
                                time={message.createdAt ? formatTime(new Date(message.createdAt)) : null}
                                direction={message.user.id == user.id ? "from u" : "for u"}
                                avatar={message.user.avatar}
                            >
                                {message.text}
                            </Message>
                        </div>
                    ))}
                </div>
            ))}
            <div ref={observerTarget} className={styles.observer_target}></div>
        </div>
    );
}

export default MessageWindow;