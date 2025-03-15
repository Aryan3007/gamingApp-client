/* eslint-disable react/prop-types */
"use client"

import { BellIcon, CreditCardIcon, FileTextIcon, HelpCircleIcon, LayoutDashboardIcon, MessageSquareIcon, SettingsIcon } from "lucide-react"
import { LayoutWrapper } from "../../components/layout-wrapper"


const userNavigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        to: "/user/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Activity",
        to: "/user/activity",
        icon: FileTextIcon,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Messages",
        to: "/user/messages",
        icon: MessageSquareIcon,
      },
      {
        title: "Notifications",
        to: "/user/notifications",
        icon: BellIcon,
      },
      {
        title: "Billing",
        to: "/user/billing",
        icon: CreditCardIcon,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help Center",
        to: "/user/help",
        icon: HelpCircleIcon,
      },
      {
        title: "Settings",
        to: "/user/settings",
        icon: SettingsIcon,
      },
    ],
  },
]

export default function UserLayout({ children }) {
  return (
    <LayoutWrapper navigation={userNavigation} userRole="user" portalTitle="User Portal">
      {children}
    </LayoutWrapper>
  )
}

