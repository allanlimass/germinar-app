import {
  Inbox,
  User,
  Church,
  DollarSign,
  Megaphone,
  ArrowDown,
  ArrowUp,
  Landmark,
  Gauge,
  Group,
  Users,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Igreja",
      url: "#",
      icon: Church,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: Gauge,
          isActive: false,
        },
        {
          title: "Igrejas",
          url: "/organization/churches",
          icon: Church,
          isActive: false,
        },
        {
          title: "Usuários",
          url: "/administrative/users",
          icon: Users,
          isActive: false,
        },
        {
          title: "Relatórios",
          url: "/churches/reports",
          icon: Inbox,
          isActive: false,
        },
      ],
    },
    {
      title: "Pessoas",
      url: "#",
      icon: User,
      isActive: false,
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: Inbox,
          isActive: false,
        },
        {
          title: "Membros",
          url: "#",
          icon: Inbox,
          isActive: false,
        },
        {
          title: "Relatórios",
          url: "#",
          icon: Inbox,
          isActive: false,
        },
      ],
    },
    {
      title: "Finanças",
      url: "#",
      icon: DollarSign,
      isActive: false,
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: Inbox,
          isActive: false,
        },
        {
          title: "Receitas",
          url: "#",
          icon: ArrowDown,
          isActive: false,
        },
        {
          title: "Despesas",
          url: "#",
          icon: ArrowUp,
          isActive: false,
        },
        {
          title: "Fornecedores",
          url: "#",
          icon: Inbox,
          isActive: false,
        },
        {
          title: "Plano de Contas",
          url: "#",
          icon: Inbox,
          isActive: false,
        },
        {
          title: "Contas",
          url: "#",
          icon: Landmark,
          isActive: false,
        },
        {
          title: "Relatórios",
          url: "#",
          icon: Inbox,
          isActive: false,
        },
      ],
    },
    {
      title: "Comunicação",
      url: "#",
      icon: Megaphone,
      isActive: false,
    },
    {
      title: "Células",
      url: "#",
      icon: Group,
      isActive: false,
    },
  ],
};
