import styles from "./Message.module.scss";
import guest from '../../../public/guest.jpg'

type Direction = "for u" | "from u";

interface MessageProps {   
    children?: string
    direction?: Direction,
    time: string
    avatar?: string
}

function Message({children, direction, time, avatar}: MessageProps) {

    console.log(avatar)

    if (direction === "for u") {
        return ( 
            <div className={styles.container}>
                <div className={styles.message_container}> 
                    <div className={styles.message_tail}></div>
                    <div className={styles.message_time}>{time}</div>
                    <p>{children}</p>
                </div>
                <img src={`${avatar ? `${__BACKEND_URL__}/media/${avatar}` : guest}`} className={styles.users_avatar}/>
            </div>
        );
    } else {
        return ( 
            <div className={styles.reverse_container}>
                <div className={styles.message_reverse_container}> 
                    <div className={styles.message_reverse_tail}>
                    </div>
                    <div className={styles.message_reverse_time}>{time}</div>
                    <p>{children}</p>
                </div>
                <img src={`${avatar ? `${__BACKEND_URL__}/media/${avatar}` : guest}`} className={styles.users_avatar}/>
            </div>
        );
    }
}

export default Message;