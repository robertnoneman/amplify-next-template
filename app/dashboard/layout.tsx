// import SideNav from '@/app/ui/dashboard/sidenav';
import TopNav from '@/app/ui/dashboard/topnav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-gray-600">
      {/* <div className="flex md:w-64">
        <SideNav />
      </div> */}
      <div className="">
        <TopNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}