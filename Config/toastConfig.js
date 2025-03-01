import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                width: "90%",
                padding: 15,
                borderRadius: 10,
                backgroundColor: "#4c9faf",
            }}
            text1Style={{ fontSize: 14, fontWeight: "bold", color: "#fff" }}
            text2Style={{ fontSize: 14, color: "#fff" }}
        />
    ),

    error: (props) => (
        <ErrorToast
            {...props}
            style={{
                width: "90%",
                padding: 20,
                borderRadius: 10,
                backgroundColor: "#F44336",
            }}
            text1Style={{ fontSize: 14, fontWeight: "bold", color: "#fff" }}
            text2Style={{ fontSize: 14, color: "#fff" }}
        />
    ),
};
