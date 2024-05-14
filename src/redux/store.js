
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import diagramReducer from "./diagramSlice"
import modalSlice from "./modalSlice";
export const store = configureStore({
    reducer: {
        user: userReducer,
        diagram: diagramReducer,
        modal: modalSlice,
    },
    devTools: process.env.NODE_ENV !== 'production',
});