// import { useContext } from 'react'
// import { AuthContext } from '../module/auth/AuthContext'

// export const useAuth = () => {
//     const context = useContext(AuthContext)
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider')
//     }
//     return context
// }

// // import { useReducer, useEffect } from 'react'
// // import { getUserProfileConfig, loginConfig, registerConfig } from '../api/api.config';

// // const initialState = {
// //     user: null,
// //     loading: false,
// //     token: localStorage.getItem("token") || sessionStorage.getItem("token") || null,
// //     error: null
// // }

// // function authReducer(state, action) {
// //     switch (action.type) {
// //         case "REQUEST_START":
// //             return { ...state, loading: true, error: null };
// //         case "LOGIN_SUCCESS":
// //         case "REGISTER_SUCCESS":
// //             return { ...state, loading: false, token: action.payload, error: null };
// //         case "GET_USER_SUCCESS":
// //             return { ...state, loading: false, user: action.payload, error: null };
// //         case "REQUEST_ERROR":
// //             return { ...state, loading: false, error: action.payload };
// //         case "LOGOUT":
// //             return { user: null, token: null, loading: false, error: null };
// //         default:
// //             return state;
// //     }
// // }

// // export function useAuth() {
// //     const [state, dispatch] = useReducer(authReducer, initialState)

// //     // --- Login ---
// //     const login = async (email, password, rememberMe = false) => {
// //         dispatch({ type: "REQUEST_START" });
// //         try {
// //             const data = await loginConfig(email, password);

// //             // ✅ Save token based on rememberMe
// //             if (rememberMe) {
// //                 localStorage.setItem("token", data.token);
// //             } else {
// //                 sessionStorage.setItem("token", data.token);
// //             }

// //             dispatch({ type: "LOGIN_SUCCESS", payload: data.token });
// //         } catch (err) {
// //             dispatch({ type: "REQUEST_ERROR", payload: err.message });
// //         }
// //     };

// //     // --- Register ---
// //     const register = async (name, email, password) => {
// //         dispatch({ type: "REQUEST_START" });
// //         try {
// //             const data = await registerConfig(name, email, password);

// //             // ✅ Save token based on rememberMe
// //             localStorage.setItem("token", data.token);
// //             sessionStorage.setItem("token", data.token);

// //             dispatch({ type: "REGISTER_SUCCESS", payload: data.token });
// //         } catch (err) {
// //             dispatch({ type: "REQUEST_ERROR", payload: err.message });
// //         }
// //     };

// //     // --- Get User ---
// //     const getUser = async () => {
// //         if (!state.token) return;
// //         dispatch({ type: "REQUEST_START" });
// //         try {
// //             const data = await getUserProfileConfig(state.token);
// //             dispatch({ type: "GET_USER_SUCCESS", payload: data });
// //         } catch (err) {
// //             dispatch({ type: "REQUEST_ERROR", payload: err.message });
// //         }
// //     };

// //     // --- Logout ---
// //     const logout = () => {
// //         localStorage.removeItem("token");
// //         sessionStorage.removeItem("token");
// //         dispatch({ type: "LOGOUT" });
// //     };

// //     // Auto fetch user when token exists
// //     useEffect(() => {
// //         if (state.token) getUser();
// //     }, [state.token]);

// //     return { state, login, register, getUser, logout };
// // }