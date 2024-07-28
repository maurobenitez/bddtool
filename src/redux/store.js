
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import diagramReducer from "./diagramSlice"
import modalSlice from "./modalSlice";
import logicModelSlice from "./logicModelSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        diagram: diagramReducer,
        modal: modalSlice,
        logicDiagram: logicModelSlice
    },
    devTools: process.env.NODE_ENV !== 'production',
});