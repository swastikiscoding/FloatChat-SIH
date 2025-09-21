import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import ModeSelect from "./ModeSelect"
import {  Shell } from "lucide-react"
import ChatHistory from "./ChatHistory"
import { UserButton } from "@clerk/clerk-react"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-gray-950">
        {/* Logo button */}
        <button className="flex items-center pl-0 pt-2 ml-1 mt-1">
          <Shell className="w-6 h-6 text-cyan-400 hover:scale-115" />
          <span className="text-2xl pl-3 group-data-[collapsible=icon]:hidden"> {/*hides*/}
            FloatChat
          </span>
        </button>

        {/* New Chat button */}

       

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

      <SidebarFooter className="bg-gray-950">
        {/* Clerk UserButton with responsive design */}
        <div className="flex items-center justify-center p-2 mx-2 mb-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors group-data-[collapsible=icon]:mx-1">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-lg border border-cyan-400/30",
                userButtonPopoverCard: "bg-gray-900 border border-gray-700 shadow-lg",
                userButtonPopoverActions: "bg-gray-900",
                userButtonPopoverActionButton: "text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                userButtonPopoverActionButtonText: "text-gray-300",
                userButtonPopoverFooter: "bg-gray-900 border-t border-gray-700",
                userButtonPopoverActionButtonIcon: "text-cyan-400",
              }
            }}
            showName={false}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
