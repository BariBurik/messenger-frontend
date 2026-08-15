import React, { useEffect, useState } from "react";
import Modal from "../UI/Modal/Modal";
import styles from "./ChangeChatModal.module.scss";
import Button from "../UI/Button/Button";
import Search from "../UI/Search/Search";
import Avatar from "../UI/Avatar/Avatar";
import FileInput from "../UI/FileInput/FileInput";
import Input from "../UI/Input/Input";
import SelectedUser from "../UI/SelectedUser/SelectedUser";
import { useChatroomDeleteMutation, useChatroomQuery, useChatroomUpdateMutation } from "@/store";
import { IChatroomCreateArgs, ISelectedItem } from "../CreateChatModal/CreateChatModal";
import { useAppSelector } from "@/hooks/redux";
import { useNavigate } from "react-router-dom";
import { handleImageChange } from "@/services/handleImageChange";
import { convertUrlToFile } from "@/services/convertUrlToFile";
interface ChangeChatModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ChangeChatModal({isOpen, setIsOpen}: ChangeChatModalProps) {

    const [updateChatroom, {data: updateChatroomData, isSuccess: isSuccessUpdate}] = useChatroomUpdateMutation()
    const [deleteChatroom, {data: deleteChatroomData, isSuccess: isSuccessDelete}] = useChatroomDeleteMutation()

    const navigate = useNavigate()

    const [query, setQuery] = useState<string>('')

    const currentChat = useAppSelector(state => state.currentChat)
    const thisUserId = useAppSelector(state => state.user.id)
    

    const [chatName, setChatName] = useState<string>('');
    const [participants, setParticipants] = useState<string>();
    const [newAvatar, setNewAvatar] = useState<File | null>(null);
    const [image, setImage] = useState<string>('');
    const [selected, setSelected] = useState<ISelectedItem[]>([]);
    const [wrongVisibale, setWrongVisibale] = useState<boolean>(false);
    
    useEffect(() => {
        const avatarConvertedToFile = convertUrlToFile(image).then((file: File) => setNewAvatar(file))
    }, [])
    
    useEffect(() => {
        if (currentChat.participants) {
            setSelected(currentChat.participants.map(participant => ({
                id: participant.id,
                name: participant.name
            })).filter(user => user.id !== thisUserId));
        }
        if (currentChat.name) {
            setChatName(currentChat.name)
        }
        if (currentChat.avatar) {
            setImage(currentChat.avatar)
        }
    }, [currentChat]);

    const handleChange = (e: React.MouseEvent) => {
        e.stopPropagation()
        
        let participants: Partial<IChatroomCreateArgs> = {};

        for (let i = 0; i < selected.length; i++) {
            participants[`user${i + 1}`] = Number(selected[i].id) 
        }

        if (participants && chatName && selected.length > 0 && selected.length < 8) {
            
            updateChatroom({
                id: Number(currentChat.id),
                name: chatName,
                users: participants,
                avatar: newAvatar
            })
        }
        if (updateChatroomData?.name) {
            navigate(`/chat/${updateChatroomData.name}`)
        }

        setIsOpen(false)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(false)
        deleteChatroom({id: Number(currentChat.id)})

        navigate(`/`)
    }

    const handleClickToCancelChosedImage = (e: React.MouseEvent) => {
        e.stopPropagation()
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
                        <h2>Changing chat</h2>
                    </div>
                    <div className={styles.body}>
                        <Input value={chatName} onChange={(e) => setChatName(e.target.value)} placeholder="Chat name"/>
                        <Search setWrongVisible={setWrongVisibale} selected={selected} setSelected={setSelected} searchResultSize="small" query={query} onChange={(e) => setQuery(e.target.value)} placeholder="Username"/>
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
                        <Button onClick={(e: React.MouseEvent) => handleChange(e)}>Save changes</Button>
                        <Button onClick={(e: React.MouseEvent) => handleDelete(e)}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}