// src\app\hackathon\[id]\_components\HackathonBanner.tsx

type HackathonBannerProps = {
  bannerImageUrl: string;
  altText: string;
};

// TODO: [lv5] Replace <img> with <Image> from "next/image"
// TODO: {lv1} [UX] Check if the image should be w-full h-auto? The div wrapper should cover the image size, or remove this div?
export default function HackathonBanner({
  bannerImageUrl,
  altText,
}: HackathonBannerProps) {
  return (
    <div className="relative w-full h-[800px] overflow-hidden">
      <img
        src={bannerImageUrl}
        alt={altText}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
