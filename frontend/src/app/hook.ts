import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
// Make sure the path below points to your actual store file location
import  { RootState, store } from "../store";

export type AppDispatch = typeof store.dispatch; // Type for dispatch function
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;