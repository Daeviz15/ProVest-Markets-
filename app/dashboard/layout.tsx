import { LoadingProvider } from '@/app/dashboard/context/LoadingContext';
import { SidebarProvider } from '@/app/dashboard/context/SidebarContext';
import { UserProvider } from '@/app/dashboard/context/UserContext';
import MainContent from '@/app/dashboard/components/MainContent';
import Sidebar from '@/app/dashboard/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <LoadingProvider>
        <SidebarProvider>
        <div className="min-h-screen bg-dash-bg flex font-outfit relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <MainContent>
            {children}
          </MainContent>
        </div>
      </SidebarProvider>
      </LoadingProvider>
    </UserProvider>
  );
}
