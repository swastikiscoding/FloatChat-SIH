import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import ModeSelect from "./ModeSelect"
import { Plus, Shell } from "lucide-react"
import ChatHistory from "./ChatHistory"
import { NavUser } from "./nav-user"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-gray-950">
        {/* Logo button */}
        <button className="flex items-center px-2 pt-2">
          <Shell className="w-6 h-6 text-cyan-400" />
          <span className="text-2xl pl-3 group-data-[collapsible=icon]:hidden"> {/*hides*/}
            FloatChat
          </span>
        </button>

        {/* New Chat button */}
        <button
          className="flex items-center px-2 p-2 mt-9 mb-2 rounded-lg text-gray-200 text-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 hover:border-white/70"
          >
          <Plus className="w-5 h-5 text-cyan-400" />
          <span className="pl-1 group-data-[collapsible=icon]:hidden"> {/*hides*/}
            New chat
          </span>
        </button>

        {/* Mode Select stays visible, but only show Star icon when collapsed */}
        <ModeSelect />

        {/* Chats heading should completely hide on collapse */}
        <span className="text-sm ml-3 mt-8 mb-1 text-cyan-400 group-data-[collapsible=icon]:hidden">
          Chats
        </span>
      </SidebarHeader>

      <SidebarContent>
        {/* Hide chat history completely when collapsed */}
        <SidebarGroup className="p-0 m-0 group-data-[collapsible=icon]:hidden">
          <ChatHistory />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Show only avatar on collapse */}
        <NavUser
          user={{
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
