
import dynamic from "next/dynamic";
const BoltInstallerCourse = dynamic(() => import("../../components/BoltInstallerCourse"), { ssr: false });

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <BoltInstallerCourse logoUrl="/bolt-logo.svg" brandColor="#0b1e3a" />
    </main>
  );
}
