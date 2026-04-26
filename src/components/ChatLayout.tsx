import React from 'react';

const ChatLayout: React.FC = () => {
  const CHAT_DATA: any[] = [];
  return (
    <div className="flex flex-col h-screen w-full bg-white relative">
      
      {/* 1. HEADER */}
      <div className="bg-[#0052cc] flex items-center justify-between px-4 py-3 text-white">
        <div className="flex items-center flex-1 bg-[#2b6ed3] rounded-md px-3 py-1.5 mr-3">
          {/* Dùng icon search có sẵn trong public/icons/ của bạn */}
          <img src="/icons/search.svg" alt="search" className="w-5 h-5 mr-2 brightness-0 invert opacity-70" />
          <input 
            type="text" 
            placeholder="Tìm bạn bè, tin nhắn..." 
            className="bg-transparent border-none outline-none text-white placeholder-blue-200 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-4">
          <img src="/icons/scan-qr.svg" alt="scan" className="w-6 h-6 brightness-0 invert" onError={(e) => e.currentTarget.style.display = 'none'} />
          <img src="/icons/plus-icon.svg" alt="plus" className="w-6 h-6 brightness-0 invert" />
        </div>
      </div>

      {/* 2. DANH SÁCH TIN NHẮN */}
      <div className="flex-1 overflow-y-auto">
        {CHAT_DATA.map((chat) => (
          <div key={chat.id} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
            {/* Avatar */}
            <div className="relative mr-4">
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* Nội dung */}
            <div className="flex-1 min-w-0 border-b border-gray-100 pb-3 pt-1">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <h3 className="text-base font-medium text-gray-900 truncate">{chat.name}</h3>
                  {chat.isOfficial && (
                     <img src="/icons/check-mark-chat.svg" alt="official" className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <p className={`text-sm truncate pr-2 ${chat.badge > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {chat.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. BOTTOM NAVIGATION */}
      <div className="bg-gray-50 border-t border-gray-200 flex justify-between items-center px-6 py-2 pb-safe">
        <div className="flex flex-col items-center cursor-pointer text-[#0052cc]">
          <img src="/icons/new-message.svg" alt="msg" className="w-6 h-6 mb-1" style={{ filter: 'invert(22%) sepia(85%) saturate(3015%) hue-rotate(212deg) brightness(96%) contrast(102%)' }} />
          <span className="text-[10px] font-medium">Tin nhắn</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer text-gray-500">
          <img src="/icons/person.svg" alt="contacts" className="w-6 h-6 mb-1 opacity-60" />
          <span className="text-[10px]">Danh bạ</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer text-gray-500">
          <img src="/icons/ui.svg" alt="explore" className="w-6 h-6 mb-1 opacity-60" />
          <span className="text-[10px]">Khám phá</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer text-gray-500">
          <img src="/icons/dong-ho-icon.svg" alt="timeline" className="w-6 h-6 mb-1 opacity-60" />
          <span className="text-[10px]">Nhật ký</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer text-gray-500">
          <img src="/icons/user.svg" alt="profile" className="w-6 h-6 mb-1 opacity-60" />
          <span className="text-[10px]">Cá nhân</span>
        </div>
      </div>

    </div>
  );
};

export default ChatLayout;