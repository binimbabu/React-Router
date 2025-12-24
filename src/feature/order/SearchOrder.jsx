import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function SearchOrder(){
    const [query, setQuery] = useState("");
     var navigate = useNavigate();
    function handleSubmit(e){
        e.preventDefault();
        if(!query) return;
        navigate(`/order/${query}`);
        setQuery("")
    }
    return <form onSubmit={handleSubmit}>
        <input placeholder="Search Order ID" value={query} onChange={(e)=> setQuery(e.target.value)} />
    </form>
}