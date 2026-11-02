import type { Icon } from 'react-feather';

/* Una subseccion de una entrada: Mi empresa > Documentos. Sin icono, porque
   cuelga de la de su padre. */
export interface SidebarSubItem {
  label: string;
  href: string;
  permission?: string;
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: Icon;
  /* Esconde la entrada a quien no tiene el permiso: un operador no puede listar
     el equipo, de modo que ofrecersela solo le daria un 403. */
  permission?: string;
  /* Se despliegan debajo mientras se esta dentro de la entrada. La primera
     suele tener el mismo href que la entrada: es su portada. */
  children?: SidebarSubItem[];
}

/* La navegacion va agrupada y no en una lista corrida: con ocho entradas
   seguidas no se distingue lo que es trabajo diario de lo que son ajustes, y el
   titulo del grupo lo resuelve sin gastar un clic. */
export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}
