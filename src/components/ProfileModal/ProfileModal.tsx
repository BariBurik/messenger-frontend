import React, { useState } from "react";
import Modal from "../UI/Modal/Modal";
import styles from "./ProfileModal.module.scss";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import { useSelector } from "react-redux";
import { RootState, useUserUpdateMutation } from "@/store";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import FileInput from "../UI/FileInput/FileInput";
import Avatar from "../UI/Avatar/Avatar";

interface ProfileProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean
}

function ProfileModal({setIsOpen, isOpen}: ProfileProps) {
    const dispatch = useAppDispatch()

    const [newUserUpdate, isSuccess] = useUserUpdateMutation()

    const name = useSelector((state: RootState) => state.user.username)
    const email = useSelector((state: RootState) => state.user.email)

    const [newname, setNewname] = useState<string>(name);
    const [newEmail, setNewEmail] = useState<string>(email);
    const [newPassword, setNewPassword] = useState("");
    const [newAvatar, setNewAvatar] = useState<File | null>(null);
    const [image, setImage] = useState<string>(null);

    const handleChange = () => {
        setIsOpen(false)
        try {
            newUserUpdate({ name: newname, email: newEmail, password: newPassword, avatar: newAvatar }).unwrap()
        } catch (error) {
            
        }
    }

    const handleClickToCancelChosedImage = (e: React.MouseEvent) => {
        e.preventDefault()
        setImage(null)
        setNewAvatar(null)
    }

    return ( 
        <div>
            <Modal setIsOpen={setIsOpen} isOpen={isOpen}>
                <div className={styles.profile_modal}>
                    <div className={styles.header}>
                        <h2>Профиль</h2>  
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
            </Modal>
        </div>
    );
}

export default ProfileModal;