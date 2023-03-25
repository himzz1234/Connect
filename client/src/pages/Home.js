import Feed from "../components/Feed";
import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Home() {
  return (
    <div>
      <Topbar />
      <section className="mt-24 scrollbar scrollbar-w-0 flex items-start text-white space-x-8 max-w-[1480px] mx-auto">
        <Profile />
        <Feed />
        <Sidebar />
      </section>
    </div>
  );
}

export default Home;
