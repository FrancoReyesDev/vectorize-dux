import { NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { cn } from "~/lib/utils";

const NavigationLink = ({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) => {
  return (
    <NavigationMenuItem>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
            isActive && "bg-accent text-accent-foreground"
          )
        }
      >
        {children}
      </NavLink>
    </NavigationMenuItem>
  );
};

export const RootHeader: React.FC = () => {
  return (
    <div className="border-b">
      <header className="container mx-auto flex w-full gap-2 p-2">
        <NavigationMenu>
          <NavigationMenuList className="flex w-full">
            <NavigationLink to="/">Búsqueda</NavigationLink>
            <NavigationLink to="/database">Base de Datos</NavigationLink>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    </div>
  );
};
