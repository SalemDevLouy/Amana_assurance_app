export default function UserAvatar({ username }: { username: string }) {
    const firstLetter = username?.charAt(0)?.toUpperCase() || '?';
  
    return (
      <div className="w-10 h-10 text-[24px] bg-blue-500 text-gray-500 flex items-center justify-center rounded-full font-bold">
        {firstLetter}
      </div>
    );
  }
  