import styles from "./Avatar.module.scss";
import guest from "../../../../public/guest.jpg";
import { getMediaUrl } from "@/services/getMediaUrl";

interface AvatarProps {
    avatar?: string | null;
}

function Avatar({ avatar }: AvatarProps) {
    return (
        <img
            className={styles.avatar}
            src={avatar ? getMediaUrl(avatar) : guest}
            alt=""
        />
    );
}

export default Avatar;