type HeaderProps = {
    onSearch: (query: string) => void;
  };
  
  const Header = ({ onSearch }: HeaderProps) => {
    return (
      <header className="flex items-center justify-between bg-blue-500 text-white p-4">
        {/* Search Bar */}
        <div className="flex flex-1">
          <input
            type="text"
            placeholder="Search movies..."
            className="p-2 rounded text-black w-full max-w-xs"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
  
        {/* Theater Title */}
        <h1 className="flex-1 text-center text-lg font-bold">Theater System</h1>
  
        {/* Empty placeholder to balance layout */}
        <div className="flex flex-1 justify-end"></div>
      </header>
    );
  };
  
  export default Header;
  