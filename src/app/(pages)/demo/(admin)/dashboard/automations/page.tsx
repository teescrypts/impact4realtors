
import AutomationPage from "../components/journey/automation-page";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ journey?: string }>;
}) {
  const { journey: ijourneyd } = await searchParams;

  return (
    <div>
      <AutomationPage ijourneyd={ijourneyd} />
    </div>
  );
}

export default Page;
