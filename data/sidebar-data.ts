import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileSpreadsheetIcon,
  HandCoinsIcon,
  InboxIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  ListIcon,
  SendIcon,
  StoreIcon,
  BuildingIcon,
  UsersIcon,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Organização",
      url: "#",
      icon: BuildingIcon,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/organization",
        },
        {
          title: "Igrejas",
          url: "/organization/churches",
        },
        {
          title: "Cargos",
          url: "/organization/positions",
        },
        {
          title: "Funções",
          url: "/organization/functions",
        },
      ],
    },
    {
      title: "Administração",
      url: "#",
      icon: LayoutDashboardIcon,
      items: [
        {
          title: "Dashboard",
          url: "/administrative",
        },
        {
          title: "Usuários",
          url: "/administrative/users",
        },
      ],
    },
    {
      title: "Pessoas",
      url: "#",
      icon: UsersIcon,
      items: [
        {
          title: "Dashboard",
          url: "/people",
        },
        {
          title: "Membresia",
          url: "/people/membership",
        },
        {
          title: "Relatórios",
          url: "/people/reports",
        },
      ],
    },
    {
      title: "Financeiro",
      url: "#",
      icon: HandCoinsIcon,
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: LayoutDashboardIcon,
        },
        {
          title: "Receitas",
          url: "#",
          icon: ArrowUpIcon,
        },
        {
          title: "Despesas",
          url: "#",
          icon: ArrowDownIcon,
        },
        {
          title: "Planos de Contas",
          url: "#",
          icon: ListIcon,
        },
        {
          title: "Centros de Custos",
          url: "#",
          icon: InboxIcon,
        },
        {
          title: "Contas Bancárias",
          url: "#",
          icon: LandmarkIcon,
        },
        {
          title: "Fornecedores",
          url: "#",
          icon: StoreIcon,
        },
        {
          title: "Relatórios",
          url: "#",
          icon: FileSpreadsheetIcon,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Suporte",
      url: "#",
      icon: LifeBuoyIcon,
    },
    {
      title: "Feedback",
      url: "#",
      icon: SendIcon,
    },
  ],
};
