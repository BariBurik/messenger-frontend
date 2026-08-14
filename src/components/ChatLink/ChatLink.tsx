import { Link, useNavigate } from "react-router-dom";
import Avatar from "../UI/Avatar/Avatar";
import styles from "./ChatLink.module.scss";
import { useParams } from "react-router-dom";
import { memo, useEffect, useRef } from "react";

interface ChatProps {
    avatar?: string
    name: string
    lastMessage?: string
    time?: string, 
}

function Chat({avatar, name, lastMessage, time}: ChatProps) {
    const userAgent = navigator.userAgent || ''; 
    const isMobile = /android|ios|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    const linkRef = useRef<HTMLAnchorElement>(null)
    
    const {name: chatName} = useParams()

    useEffect(() => {
        if (chatName == name) {
            linkRef.current?.classList.add(styles.active)
        } else {
            linkRef.current?.classList.remove(styles.active)
        }
    }, [chatName, name])

    if (isMobile) {
        return ( 
            <Link to={`/chat/${name}`} ref={linkRef} className={styles.mobile_chat}>
                <Avatar avatar={avatar}/>
                <div className={styles.mobile_text}>
                    <div className={styles.mobile_top_row}>
                        <div className={styles.mobile_username}>{name}</div>
                        {time && <div className={styles.mobile_time}>{time && time}</div>}
                    </div>
                    <div className={styles.mobile_bottom_row}>
                        {lastMessage && <div className={styles.mobile_last_message}>{lastMessage}</div>}
                    </div>
                </div>
            </Link>
        );
    } else {
        return ( 
            <Link to={`/chat/${name}`} ref={linkRef} className={styles.chat}>
                <Avatar avatar={avatar !== undefined ? avatar : ""}/>
                <div className={styles.text}>
                    <div className={styles.top_row}>
                        <div className={styles.username}>{name}</div>
                        {time && <div className={styles.time}>{time}</div>}
                    </div>
                    <div className={styles.bottom_row}>
                        {lastMessage && <div className={styles.last_message}>{lastMessage}</div>}
                    </div>
                </div>
            </Link>
        );
    }
}

export default memo(Chat);