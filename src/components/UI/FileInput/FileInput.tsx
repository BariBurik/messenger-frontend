import styles from "./FileInput.module.scss"

interface FileImputProps {
    setImage: React.Dispatch<React.SetStateAction<string>>   
    setNewAvatar: React.Dispatch<React.SetStateAction<File | null>>   
}

function FileImput({setImage, setNewAvatar}: FileImputProps) {
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];
        setNewAvatar(file);
        setImage(URL.createObjectURL(file));
    };

    return ( 
        <div className={styles.file_input_container}>
            <input type="file" id="fileInput" className={styles.file_input} onChange={handleImageChange}/>
            <label htmlFor="fileInput" className={styles.file_label}>Choose avatar</label>
        </div>

    );
}

export default FileImput;