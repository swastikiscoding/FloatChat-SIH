import { SidebarProvider} from "@/components/ui/sidebar"
import RightSection from "./RightSection/RightSection"
import { AppSidebar } from "./Sidebar/app-sidebar"
import ContextProvider from "./context/Context"

export default function Chatbot() {
  return (
    <ContextProvider>
      <SidebarProvider>
        <AppSidebar/>
        <RightSection/>
      </SidebarProvider>
    </ContextProvider>
  )
}