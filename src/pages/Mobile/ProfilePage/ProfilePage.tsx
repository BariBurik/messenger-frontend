import { useState } from "react";
import styles from "./ProfilePage.module.scss";
import Input from "@/components/UI/Input/Input";
import Button from "@/components/UI/Button/Button";
import { useAppDispatch } from "@/hooks/redux";
import { RootState, useUserUpdateMutation } from "@/store";
import { useSelector } from "react-redux";
import FileInput from "@/components/UI/FileInput/FileInput";
import Avatar from "@/components/UI/Avatar/Avatar";
import Back from '../../../../public/back.svg'
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    
    const [newUserUpdate] = useUserUpdateMutation()

    const name = useSelector((state: RootState) => state.user.username)
    const email = useSelector((state: RootState) => state.user.email)

    const [newname, setNewname] = useState<string>(name);
    const [newEmail, setNewEmail] = useState<string>(email);
    const [newPassword, setNewPassword] = useState("");
    const [newAvatar, setNewAvatar] = useState<File | null>(null);
    const [image, setImage] = useState<string>(null);

    const navigate = useNavigate()

    const handleChange = () => {
        try {
            newUserUpdate({ name: newname, email: newEmail, password: newPassword, avatar: newAvatar }).unwrap().finally(() => navigate("/"))
        } catch (error) {
            
        }
    }


    const handleClickToCancelChosedImage = (e: React.MouseEvent) => {
        e.preventDefault()
        setImage(null)
    }

    const handleClickToBack = (e: React.MouseEvent) => {
        e.preventDefault()
        navigate("/")
    }

    return ( 
        <>
        <button onClick={handleClickToBack} className={styles.back_button}><Back/></button>
        <div className={styles.constainer}>
            <div className={styles.profile}>
                <div className={styles.header}>
                    <h2>Profile</h2>
                </div>
                <div className={styles.body}>
                    <Input value={newname} onChange={(e) => setNewname(e.target.value)} placeholder="Username"/>
                    <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email"/>
                    <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Password"/>
                    {!image && <FileInput setNewAvatar={setNewAvatar} setImage={setImage}/>}
                    <div className={styles.avatar_container}>
                            {image && <Avatar avatar={image} />}
                            <button className={`${styles.close_button} ${!image && styles.hidden}`} onClick={handleClickToCancelChosedImage}>&times;</button>
                    </div>
                </div>
                <div className={styles.footer}>
                    <Button onClick={handleChange}>Save changes</Button>
                </div>
            </div>
        </div>
        </>
    );
}

export default ProfilePage;