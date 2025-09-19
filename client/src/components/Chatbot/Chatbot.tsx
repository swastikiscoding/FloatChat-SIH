import { SidebarProvider} from "@/components/ui/sidebar"
import RightSection from "./RightSection/RightSection"
import { AppSidebar } from "./Sidebar/app-sidebar"
// import "./Chatbot.css"

export default function Chatbot() {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <RightSection/>
    </SidebarProvider>
  )
}