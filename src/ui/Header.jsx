import { Link } from "react-router-dom";
import SearchOrder from "../feature/order/SearchOrder";
import Username from "../feature/user/Username";

export default function Header(){

    return (
        <header className="flex items-center justify-between bg-yellow-200 px-4 py-3 border-b border-stone-600 sm:px-6">
         <Link to='/' className="tracking-widest">Fast React Pizza Co.</Link>
         <SearchOrder />
         <Username />
        </header>
    )
}