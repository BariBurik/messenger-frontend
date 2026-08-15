import React, { useEffect, useState } from "react";
import Modal from "../UI/Modal/Modal";
import styles from "./CreateChatModal.module.scss";
import Button from "../UI/Button/Button";
import Search from "../UI/Search/Search";
import Avatar from "../UI/Avatar/Avatar";
import FileInput from "../UI/FileInput/FileInput";
import Input from "../UI/Input/Input";
import SelectedUser from "../UI/SelectedUser/SelectedUser";
import { useChatroomCreateMutation } from "@/store";

interface CreateChatModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IChatroomCreateArgs {
    [key: string]: number;
    user2?: number;
    user3?: number;
    user4?: number;
    user5?: number;
    user6?: number;
    user7?: number;
    user8?: number;
  }

export interface ISelectedItem {
    id: number
    name: string
}

function CreateChatModal({isOpen, setIsOpen}: CreateChatModalProps) {

    const [createChatroom, {isSuccess}] = useChatroomCreateMutation()

    const [chatName, setChatName] = useState<string>('');
    const [participants, setParticipants] = useState<string>('');
    const [newAvatar, setNewAvatar] = useState<File | null>(null);
    const [image, setImage] = useState<string>(null);
    const [selected, setSelected] = useState<ISelectedItem[]>([]);
    const [wrongVisibale, setWrongVisibale] = useState<boolean>(false);

    const handleCreate = () => {
        let participants: Partial<IChatroomCreateArgs> = {};
        for (let i = 0; i < selected.length; i++) {
            participants[`user${i + 2}`] = Number(selected[i].id);
        }

        if (participants) {
            setIsOpen(false)
            createChatroom({
                name: chatName, 
                users: participants,
                avatar: newAvatar
            })
        }
    }

    const handleClickToCancelChosedImage = (e: React.MouseEvent) => {
        e.preventDefault()
        setImage(null)
        setNewAvatar(null)
    }

    const deleteUserFromSelected = (id: number) => {
        setSelected(selected.filter(user => user.id !== id))
    }

    useEffect(() => {
        if (selected.length < 7) {
            setWrongVisibale(false)
        }   
    }, [selected])

    return ( 
        <div>
            <Modal setIsOpen={setIsOpen} isOpen={isOpen}>
                <div className={styles.chat_modal}>
                    <div className={styles.header}>
                        <h2>Chat create</h2>
                    </div>
                    <div className={styles.body}>
                        <Input value={chatName} onChange={(e) => setChatName(e.target.value)} placeholder="Chat name"/>
                        <Search setWrongVisible={setWrongVisibale} selected={selected} setSelected={setSelected} searchResultSize="small" query={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="Username"/>
                        <div className={styles.selected_users}>
                            {selected.map((user, index) => (
                                <SelectedUser key={index} id={user.id} username={user.name} callback={deleteUserFromSelected} />
                            ))}
                        </div>
                        {wrongVisibale && <p className={styles.warning}>A chat may have up to 8 participants</p>}
                        {!image && <FileInput setNewAvatar={setNewAvatar} setImage={setImage}/>}
                        <div className={styles.avatar_container}>
                                {image && <Avatar avatar={image} />}
                                <button className={`${styles.close_button} ${!image && styles.hidden}`} onClick={handleClickToCancelChosedImage}>&times;</button>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <Button onClick={handleCreate}>Create</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default CreateChatModal;