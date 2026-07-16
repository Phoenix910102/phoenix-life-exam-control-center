import { PhoenixCampaignExperience } from "@/components/campaign/PhoenixCampaignExperience";

type CampaignPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { slug } = await params;
  return <PhoenixCampaignExperience slug={decodeURIComponent(slug)} />;
}
