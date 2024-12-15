import Image from "next/image";

interface ProfileSectionProps {
  firstName: string;
  lastName: string;
  role: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  firstName = "N/A",
  lastName = "N/A",
  role = "N/A",
}) => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return (
    <div className="flex items-center gap-4 bg-white shadow-sm px-12 py-3 border rounded-2xl">
      <Image
        src="/sample_profile.jpg"
        width={96}
        height={96}
        alt="Profile Picture"
        className="rounded-full read-only:cursor-pointer"
      />
      <div className="flex flex-col items-start gap-1">
        <span className="font-semibold text-xl">{fullName}</span>
        <span className="font-normal text-md">{role}</span>
      </div>
    </div>
  );
};

export default ProfileSection;
