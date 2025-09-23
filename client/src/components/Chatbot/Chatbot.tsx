import { SidebarProvider} from "@/components/ui/sidebar"
import RightSection from "./RightSection/RightSection"
import { AppSidebar } from "./Sidebar/app-sidebar"
import ContextProvider from "./context/Context"

export default function Chatbot() {
  return (
    <ContextProvider>
      <div className="flex h-screen w-full bg-gray-900 overflow-hidden">
        <SidebarProvider>
          <AppSidebar/>
          <RightSection/>
        </SidebarProvider>
      </div>
    </ContextProvider>
  )
}