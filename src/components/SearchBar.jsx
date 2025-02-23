import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex bg-gray-800 p-2 rounded-md">
      <input 
        type="text" 
        placeholder="Search videos..." 
        className="bg-transparent outline-none text-white px-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="ml-2">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
