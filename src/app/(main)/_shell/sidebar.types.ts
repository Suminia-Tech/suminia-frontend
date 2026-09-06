import type { Icon } from 'react-feather';

export interface SidebarItem {
  label: string;
  href: string;
  icon: Icon;
  /* Esconde la entrada a quien no tiene el permiso: un operador no puede listar
     el equipo, de modo que ofrecersela solo le daria un 403. */
  permission?: string;
}

/* La navegacion va agrupada y no en una lista corrida: con ocho entradas
   seguidas no se distingue lo que es trabajo diario de lo que son ajustes, y el
   titulo del grupo lo resuelve sin gastar un clic. */
export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}
