'use client';

import { useState, useRef, useEffect } from 'react';
import { HotelLayout } from '@/components/layout';
import { 
  ChatIcon,
  MessageIcon,
  SendIcon,
  PhoneIcon,
  VideoIcon,
  AttachmentIcon,
  EmojiIcon,
  DotsIcon,
  SearchIcon,
  PlusIcon,
  XIcon,
  CheckIcon
} from '@/components/icons/HotelIcons';

// Mock data cho demo
const mockChats = [
  {
    id: '1',
    guestName: 'Nguyễn Văn An',
    guestEmail: 'an.nguyen@email.com',
    roomNumber: '101',
    avatar: null,
    lastMessage: 'Xin chào, tôi muốn hỏi về dịch vụ spa của khách sạn',
    timestamp: '14:30',
    unreadCount: 3,
    isOnline: true,
    status: 'active' // active, resolved, waiting
  },
  {
    id: '2', 
    guestName: 'Trần Thị Bình',
    guestEmail: 'binh.tran@email.com',
    roomNumber: '205',
    avatar: null,
    lastMessage: 'Cảm ơn bạn đã hỗ trợ. Tôi đã nhận được thông tin.',
    timestamp: '12:45',
    unreadCount: 0,
    isOnline: false,
    status: 'resolved'
  },
  {
    id: '3',
    guestName: 'Lê Hoàng Cường', 
    guestEmail: 'cuong.le@email.com',
    roomNumber: '308',
    avatar: null,
    lastMessage: 'Phòng của tôi có vấn đề với wifi. Bạn có thể kiểm tra không?',
    timestamp: '11:20',
    unreadCount: 1,
    isOnline: true,
    status: 'waiting'
  },
  {
    id: '4',
    guestName: 'Phạm Minh Đức',
    guestEmail: 'duc.pham@email.com', 
    roomNumber: '412',
    avatar: null,
    lastMessage: 'Tôi muốn đặt bàn tại nhà hàng cho tối nay',
    timestamp: 'Hôm qua',
    unreadCount: 0,
    isOnline: false,
    status: 'resolved'
  },
  {
    id: '5',
    guestName: 'Hoàng Thị Ế',
    guestEmail: 'e.hoang@email.com',
    roomNumber: '203',
    avatar: null,
    lastMessage: 'Xin chào, checkout time là mấy giờ ạ?',
    timestamp: 'Hôm qua',
    unreadCount: 0,
    isOnline: true,
    status: 'active'
  }
];

const mockMessages = [
  {
    id: '1',
    chatId: '1',
    senderId: 'guest-1',
    senderName: 'Nguyễn Văn An',
    message: 'Xin chào, tôi đang ở phòng 101',
    timestamp: '14:25',
    type: 'text',
    isFromGuest: true
  },
  {
    id: '2',
    chatId: '1',
    senderId: 'staff-1',
    senderName: 'Nhân viên hỗ trợ',
    message: 'Xin chào anh An! Tôi có thể giúp gì cho anh?',
    timestamp: '14:26',
    type: 'text',
    isFromGuest: false
  },
  {
    id: '3', 
    chatId: '1',
    senderId: 'guest-1',
    senderName: 'Nguyễn Văn An',
    message: 'Tôi muốn hỏi về dịch vụ spa của khách sạn. Có những gói dịch vụ nào?',
    timestamp: '14:28',
    type: 'text',
    isFromGuest: true
  },
  {
    id: '4',
    chatId: '1',
    senderId: 'staff-1', 
    senderName: 'Nhân viên hỗ trợ',
    message: 'Chúng tôi có các gói spa sau:\n\n🌸 Gói thư giãn cơ bản (60 phút) - 800.000 VND\n🌸 Gói massage toàn thân (90 phút) - 1.200.000 VND\n🌸 Gói chăm sóc da mặt (45 phút) - 600.000 VND\n🌸 Gói VIP couple (120 phút) - 2.000.000 VND\n\nAnh có muốn đặt lịch không ạ?',
    timestamp: '14:30',
    type: 'text',
    isFromGuest: false
  }
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  resolved: 'bg-gray-100 text-gray-800',
  waiting: 'bg-yellow-100 text-yellow-800'
};

const statusLabels: Record<string, string> = {
  active: 'Đang xử lý',
  resolved: 'Đã giải quyết', 
  waiting: 'Chờ phản hồi'
};

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.roomNumber.includes(searchTerm) ||
                         chat.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || chat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedChatMessages = messages.filter(msg => msg.chatId === selectedChat.id);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      chatId: selectedChat.id,
      senderId: 'staff-current',
      senderName: 'Bạn',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isFromGuest: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getChatStats = () => {
    const totalUnread = mockChats.reduce((sum, chat) => sum + chat.unreadCount, 0);
    const activeChats = mockChats.filter(chat => chat.status === 'active').length;
    const waitingChats = mockChats.filter(chat => chat.status === 'waiting').length;
    
    return { totalUnread, activeChats, waitingChats };
  };

  const stats = getChatStats();

  return (
    <HotelLayout>
      <div className="flex h-[calc(100vh-80px)] bg-gray-50">
        {/* Left Sidebar - Chat List */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ChatIcon className="w-6 h-6 text-blue-600" />
                Chat khách hàng
              </h1>
              <button
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Tạo cuộc trò chuyện mới"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{stats.totalUnread}</div>
                <div className="text-xs text-gray-600">Chưa đọc</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{stats.activeChats}</div>
                <div className="text-xs text-gray-600">Đang xử lý</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">{stats.waitingChats}</div>
                <div className="text-xs text-gray-600">Chờ phản hồi</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              title="Lọc theo trạng thái"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang xử lý</option>
              <option value="waiting">Chờ phản hồi</option>
              <option value="resolved">Đã giải quyết</option>
            </select>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto dialog-scroll">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(chat.guestName)}
                    </div>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{chat.guestName}</h3>
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-600">Phòng {chat.roomNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[chat.status]}`}>
                        {statusLabels[chat.status]}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 truncate mb-1">{chat.lastMessage}</p>
                    
                    {chat.unreadCount > 0 && (
                      <div className="flex justify-end">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(selectedChat.guestName)}
                  </div>
                  {selectedChat.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedChat.guestName}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Phòng {selectedChat.roomNumber}</span>
                    <span>•</span>
                    <span>{selectedChat.isOnline ? 'Đang online' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Gọi điện"
                >
                  <PhoneIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Gọi video"
                >
                  <VideoIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Tùy chọn khác"
                >
                  <DotsIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dialog-scroll">
            {selectedChatMessages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isFromGuest ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isFromGuest
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'bg-blue-600 text-white'
                }`}>
                  {message.isFromGuest && (
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      {message.senderName}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">
                    {message.message}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.isFromGuest ? 'text-gray-500' : 'text-blue-100'
                  }`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end gap-3">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Đính kèm file"
              >
                <AttachmentIcon className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  rows={1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm min-h-[44px] max-h-[120px]"
                />
                <button
                  className="absolute right-2 top-2 p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                  title="Emoji"
                >
                  <EmojiIcon className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Gửi tin nhắn"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setNewMessage('Xin chào! Tôi có thể giúp gì cho bạn?')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Chào hỏi
              </button>
              <button
                onClick={() => setNewMessage('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ xử lý ngay.')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Cảm ơn
              </button>
              <button
                onClick={() => setNewMessage('Vấn đề của bạn đã được giải quyết. Có gì khác tôi có thể hỗ trợ không?')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      </div>
    </HotelLayout>
  );
}
