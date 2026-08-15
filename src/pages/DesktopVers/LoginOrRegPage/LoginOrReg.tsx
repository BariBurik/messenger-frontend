import Input from "@/components/UI/Input/Input";
import styles from "./LoginOrReg.module.scss";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/UI/Button/Button";
import { useUserLoginMutation, useUserRegisterMutation } from "@/store";
import PasswordInput from "@/components/UI/PasswordInput/PasswordInput";
import ErrorPopup from "@/components/UI/ErrorPopup/ErrorPopup";

function LoginOrRegPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [isReg, setIsReg] = useState(false);
    const [errorVisibale, setErrorVisibale] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const nameWrongRef = useRef(null);
    const emailWrongRef = useRef(null);
    const passwordWrongRef = useRef(null);
    const checkPasswordWrongRef = useRef(null);

    const [userLogin, userLogData] = useUserLoginMutation();
    const [userRegister, userRegData] = useUserRegisterMutation();

    const handleRegOrLogin = () => {
        if (isReg) {
            if (name && email && password && checkPassword && password === checkPassword) {
                userRegister({name, email, password});
            } else {
                setErrorVisibale(true)
                setErrorMessage("Please fill in all fields")
            }
        } else {
            if (email && password) {
                userLogin({email, password});
            } else {
                setErrorVisibale(true)
                setErrorMessage("Please fill in all fields")
            }
        }
    }


    useEffect(() => {
        if (!name && isReg) {
            nameWrongRef.current.classList.remove(styles.hidden);
        } else {
            nameWrongRef.current.classList.add(styles.hidden);
        }
        if (!email) {
            emailWrongRef.current.classList.remove(styles.hidden);
        } else {
            emailWrongRef.current.classList.add(styles.hidden);
        }
        if (!password) {
            passwordWrongRef.current.classList.remove(styles.hidden);
        } else {
            passwordWrongRef.current.classList.add(styles.hidden);
        }
        if (password !== checkPassword && isReg) {
            checkPasswordWrongRef.current.classList.remove(styles.hidden);
        } else {
            checkPasswordWrongRef.current.classList.add(styles.hidden);
        }
        if (userLogData.isError || userRegData.isError) {
            setErrorVisibale(true)
            setErrorMessage(userLogData.error?.message || userRegData.error?.message)
        }
    }, [name, email, password, checkPassword, userLogData, userRegData])

    useEffect(() => {
        if (userLogData.isSuccess || userRegData.isSuccess) {
            window.location.reload(); 
        }
    }, [userLogData.isSuccess, userRegData.isSuccess]);

    return (
        <div className={styles.container}>
            <div className={styles.login_or_reg}>
                <h1>{isReg ? "Sign up" : "Sign in"}</h1>
                {isReg ? <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your username"/> : <></>}
                <p ref={nameWrongRef} className={`${styles.warning} ${styles.hidden}`}>Enter your username</p>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"/>
                <p ref={emailWrongRef} className={`${styles.warning} ${styles.hidden}`}>Enter your email</p>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"/>
                <p ref={passwordWrongRef} className={`${styles.warning} ${styles.hidden}`}>Enter your password</p>
                <p ref={checkPasswordWrongRef} className={`${styles.warning} ${styles.hidden}`}>Passwords don't match</p>
                {isReg ? <PasswordInput value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} placeholder="Confirm password"/> : <></>}
                <p ref={checkPasswordWrongRef} className={`${styles.warning} ${styles.hidden}`}>Passwords don't match</p>
                {<p className={styles.switch} onClick={() => setIsReg(!isReg)}>{isReg ? "Already have an account?" : "Don't have an account yet?"}</p>}
                <div className={styles.button}><Button onClick={handleRegOrLogin}>{isReg ? "Sign up" : "Sign in"}</Button></div>
                <ErrorPopup visible={errorVisibale} setVisible={setErrorVisibale} message={errorMessage} setMessage={setErrorMessage} />
            </div>
        </div>
    );
}

export default LoginOrRegPage;