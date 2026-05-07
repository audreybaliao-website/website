import About from "@/components/sections/About";
import Stories from "@/components/sections/Stories";
import Dreams from "@/components/sections/Dreams";
import Travel from "@/components/sections/Travel";
import Rates from "@/components/sections/Rates";
import Connect from "@/components/sections/Connect";

export default function Page() {
  return (
    <>
      <About />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="rule" />
      </div>
      <Stories />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="rule" />
      </div>
      <Dreams />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="rule" />
      </div>
      <Travel />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="rule" />
      </div>
      <Rates />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="rule" />
      </div>
      <Connect />
    </>
  );
}
