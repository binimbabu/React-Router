import CartOverview from "../feature/cart/CartOverview";
import Header from "./Header";
import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./Loader";

export default function AppLayout(){
    const navigation = useNavigation();
    const loading = navigation.state === "loading";
    return (
        <div className="grid h-screen grid-rows-[auto_1fr_auto] gap-4">
            {loading && <Loader />}
           <Header />
           <div className="overflow-scroll">
                       <main className="mx-auto  bg-red-400">
            <h1>Content</h1>
            <Outlet />
           </main>
            </div> 

           <CartOverview />
        </div>
    )
}