import { Route } from "react-router-dom";
import { BuddyProvider } from "./BuddiesContext";
import BuddyFinder from "./BuddyFinder";
import MyBuddies from "./MyBuddies";

export const BuddyRoutes = (
    <>
        <Route
            path="/buddies"
            element={
                <BuddyProvider>
                    <BuddyFinder />
                </BuddyProvider>
            }
        />
        <Route
            path="/my-buddies"
            element={
                <BuddyProvider>
                    <MyBuddies />
                </BuddyProvider>
            }
        />
    </>
)