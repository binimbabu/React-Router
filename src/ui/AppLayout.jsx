import CartOverview from "../feature/cart/CartOverview";
import Header from "./Header";
import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./Loader";

export default function AppLayout(){
    const navigation = useNavigation();
    const loading = navigation.state === "loading";
    return (
        <div className="layout">
            {loading && <Loader />}
           <Header /> 
           <main>
            <h1>Content</h1>
            <Outlet />
           </main>
           <CartOverview />
        </div>
    )
}