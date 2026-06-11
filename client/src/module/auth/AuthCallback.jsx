import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileAPI } from "../../api/all.api";

const AuthCallback = () => {
    const navigate = useNavigate()

    const fetchProfile = async (token) => {
        await fetch(getProfileAPI, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")

        if (token) {
            localStorage.setItem("token", token)
            // fetch user profile
            fetchProfile(token)
            // ✅ Clean URL (remove token)
            window.history.replaceState({}, document.title, "/dashboard");
            navigate("/dashboard", { replace: true })
        } else {
            navigate("/auth/login", { replace: true })
        }
    }, [navigate])

    return <p>Signing you in...</p>
}

export default AuthCallback