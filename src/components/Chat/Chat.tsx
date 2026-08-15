import { useState } from "react";
import BottomChatsBar from "../BottomChatsBar/BottomChatsBar";
import MessageWindow from "../MessagesWindow/MessageWindow";
import TopChatsBar from "../TopChatsBat/TopChatsBar";
import styles from "./Chat.module.scss";
import { useAppSelector } from "@/hooks/redux";
import { useSendMessageMutation } from "@/store";

interface BottomChatsBarProps {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
}

function Chat({value, setValue}: BottomChatsBarProps) {
    const [isOpen, setIsOpen] = useState(false)

    const chatName = useAppSelector(state => state.currentChat.name)
    const accessToken = useAppSelector(state => state.user.tempToken)
    const [sendMessage, {data, isLoading}] = useSendMessageMutation()

    const handleSendMessage = () => {
        sendMessage({
            accessToken: accessToken,
            text: value,
            chatroomName: chatName
        })
        setValue('')
    }

    return ( 
        <div className={styles.chat}>
            <TopChatsBar chatsName={chatName} isOpen={isOpen} setIsOpen={setIsOpen} />
            <MessageWindow/>
            <BottomChatsBar callback={handleSendMessage} value={value} setValue={setValue} placeholder="Type a message..." />
        </div>
     );
}

export default Chat;