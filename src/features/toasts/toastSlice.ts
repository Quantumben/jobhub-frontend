import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/*
|--------------------------------------------------------------------------
| Toast Types
|--------------------------------------------------------------------------
*/

export type ToastType = "success" | "error" | "info" | "warning";

/*
|--------------------------------------------------------------------------
| Toast
|--------------------------------------------------------------------------
*/

export interface Toast {
  id: string;

  type: ToastType;

  message: string;

  duration: number;
}

/*
|--------------------------------------------------------------------------
| Data Required When Creating a Toast
|--------------------------------------------------------------------------
|
| Notice that the component does NOT provide the ID.
|
| Our action creator will create it automatically.
|
*/

interface AddToastPayload {
  type: ToastType;

  message: string;

  duration?: number;
}

/*
|--------------------------------------------------------------------------
| Toast State
|--------------------------------------------------------------------------
*/

interface ToastState {
  items: Toast[];
}

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState: ToastState = {
  items: [],
};

/*
|--------------------------------------------------------------------------
| Simple ID Counter
|--------------------------------------------------------------------------
|
| We only need a unique ID so React and Redux can identify each toast.
|
*/

let nextToastId = 0;

/*
|--------------------------------------------------------------------------
| Toast Slice
|--------------------------------------------------------------------------
*/

const toastSlice = createSlice({
  name: "toasts",

  initialState,

  reducers: {
    /*
    |--------------------------------------------------------------------------
    | Add Toast
    |--------------------------------------------------------------------------
    */

    addToast: {
      /*
      |--------------------------------------------------------------------------
      | Reducer
      |--------------------------------------------------------------------------
      */

      reducer: (state, action: PayloadAction<Toast>) => {
        state.items.push(action.payload);
      },

      /*
      |--------------------------------------------------------------------------
      | Prepare
      |--------------------------------------------------------------------------
      |
      | Allows us to transform:
      |
      | addToast({
      |   type: 'success',
      |   message: 'Saved'
      | })
      |
      | into a complete Toast with an ID and default duration.
      |
      */

      prepare: (toast: AddToastPayload) => {
        nextToastId += 1;

        return {
          payload: {
            id: `toast-${Date.now()}-${nextToastId}`,

            type: toast.type,

            message: toast.message,

            duration: toast.duration ?? 4000,
          },
        };
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Remove One Toast
    |--------------------------------------------------------------------------
    */

    removeToast: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload);
    },

    /*
    |--------------------------------------------------------------------------
    | Remove Everything
    |--------------------------------------------------------------------------
    */

    clearToasts: (state) => {
      state.items = [];
    },
  },
});

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const { addToast, removeToast, clearToasts } = toastSlice.actions;

/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default toastSlice.reducer;
