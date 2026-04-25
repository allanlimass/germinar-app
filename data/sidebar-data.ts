import {
  Inbox,
  User,
  Church,
  DollarSign,
  Megaphone,
  ArrowDownUp,
  Landmark,
  Gauge,
  Group,
  Users,
  FileText,
  Award,
  HandHeart,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Organização",
      url: "#",
      icon: Church,
      isActive: false,
      items: [
        {
          title: "Dashboard",
          url: "/organization",
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
          url: "/organization/users",
          icon: Users,
          isActive: false,
        },
        {
          title: "Cargos",
          url: "/organization/positions",
          icon: Award,
          isActive: false,
        },
        {
          title: "Funções",
          url: "/organization/functions",
          icon: HandHeart,
          isActive: false,
        },
        {
          title: "Relatórios",
          url: "/organization/reports",
          icon: FileText,
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
          icon: Gauge,
          isActive: false,
        },
        {
          title: "Membros",
          url: "/people/members",
          icon: Users,
          isActive: false,
        },
        {
          title: "Relatórios",
          url: "#",
          icon: FileText,
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
          url: "/finance",
          icon: Gauge,
          isActive: false,
        },
        {
          title: "Transações",
          url: "/finance/transactions",
          icon: ArrowDownUp,
          isActive: false,
        },
        {
          title: "Fornecedores",
          url: "/finance/suppliers",
          icon: Inbox,
          isActive: false,
        },
        {
          title: "Plano de Contas",
          url: "/finance/chart-of-accounts",
          icon: Inbox,
          isActive: false,
        },
        {
          title: "Centros de Custo",
          url: "/finance/cost-centers",
          icon: Inbox,
          isActive: false,
        },
        {
          title: "Contas",
          url: "/finance/accounts",
          icon: Landmark,
          isActive: false,
        },
        {
          title: "Relatórios",
          url: "/finance/reports",
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
