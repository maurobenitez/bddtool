import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openDialog: "",
    coordinate: {
        x: 0,
        y: 0
    },
    elementEditOrDelete: "",
    elementEdit: "",
    editOrDeleteOpen: false
};


export const dialogSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openDialog: (state, action) => {
            const { dialogType, element } = action.payload;
            state.openDialog = dialogType;
            if (element !== undefined) {
                state.elementEdit = element;
            }
        },
        closeDialog: (state) => {
            state.openDialog = "";
            state.elementEdit = "";
        },
        setPosition: (state, action) => {
            const { x, y } = action.payload;
            state.coordinate.x = x;
            state.coordinate.y = y;
        },
        setElement: (state, action) => {
            const { element } = action.payload;
            state.element = element;
        },
        setData: (state, action) => {
            var { data } = action.payload;
            Object.keys(data).forEach(key => {
                state[key] = data[key];
            });
        },

        openEditOrDelete: (state, action) => {
            const { element } = action.payload;
            state.editOrDeleteOpen = true;
            state.elementEditOrDelete = element;
        },

        closeEditOrDelete: (state) => {
            state.editOrDeleteOpen = false;
            state.elementEditOrDelete = "";
        },
    }
})

export const { openDialog, closeDialog, setPosition, setElement, setData, openEditOrDelete, closeEditOrDelete } = dialogSlice.actions;
export default dialogSlice.reducer;