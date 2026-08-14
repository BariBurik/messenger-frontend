import { useUserReLoginQuery } from "@/store";
import AppRouter from "../AppRouter";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setUserAuth } from "@/store/ActionCreators/User";
import { checkAndSetCSRFToken } from "@/services/checkAndSetCookie";

export const App = () => {

    const dispatch = useAppDispatch()
    const initialLoad = useRef(true)
    const [csrfReady, setCsrfReady] = useState(false);
    const {
        data: userData,
        isLoading: isLoadingUser
    } = useUserReLoginQuery(undefined, {
        skip: !csrfReady
    });

    useEffect(() => {
        checkAndSetCSRFToken()
            .then(() => {
                setCsrfReady(true);
            })
            .catch((error) => {
                console.error(
                    'Failed to initialize CSRF:',
                    error
                );
            });
    }, []);
    

    useEffect(() => {
        if (userData) {
            const user = userData.userReLogin.user;

            setUserAuth(
                dispatch,
                user,
                userData.userReLogin.tempToken
            );
        }
    }, [userData]);

    if (!csrfReady) {
        return null;
    }

    return ( 
        <AppRouter isLoading={isLoadingUser}/>
    );
}

export default App;