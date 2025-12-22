import { useNavigate } from "react-router";

import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export const RootHeader: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [value] = useDebounce(searchValue, 500);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/?query=${value}`);
  }, [value]);

  return (
    <Input
      placeholder="Sku, Codigo de Barras o Titulo"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  );
};
