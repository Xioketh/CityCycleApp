import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const getLoginUserInfo = async () => {
            const role = await AsyncStorage.getItem("role");
            const name = await AsyncStorage.getItem("userName");

            if (role && name) {
                setUserRole(role);
                setUserName(name);
            }
        };

        getLoginUserInfo();
    }, []);

    return (
        <UserContext.Provider value={{ userName, setUserName, userRole, setUserRole }}>
            {children}
        </UserContext.Provider>
    );
};
