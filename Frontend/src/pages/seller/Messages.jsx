import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical,
  Star,
  Archive,
  Trash2,
  User,
  Clock
} from 'lucide-react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      buyer: {
        name: 'Sarah Mitchell',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        online: true
      },
      item: 'Vintage Ceramic Vase',
      lastMessage: 'Is this still available? I\'m very interested!',
      timestamp: '2 hours ago',
      unread: true,
      messages: [
        {
          id: 1,
          sender: 'buyer',
          message: 'Hi! I saw your vintage ceramic vase listing. Is it still available?',
          timestamp: '2024-01-15 10:30 AM',
          read: true
        },
        {
          id: 2,
          sender: 'seller',
          message: 'Hello! Yes, it\'s still available. Are you interested in purchasing it?',
          timestamp: '2024-01-15 10:45 AM',
          read: true
        },
        {
          id: 3,
          sender: 'buyer',
          message: 'Yes, I am! Could you tell me more about its condition? Any chips or cracks?',
          timestamp: '2024-01-15 11:00 AM',
          read: true
        },
        {
          id: 4,
          sender: 'seller',
          message: 'It\'s in excellent condition! No chips or cracks. I can send you more detailed photos if you\'d like.',
          timestamp: '2024-01-15 11:15 AM',
          read: true
        },
        {
          id: 5,
          sender: 'buyer',
          message: 'That would be great! Also, are you flexible on the price at all?',
          timestamp: '2024-01-15 11:30 AM',
          read: false
        }
      ]
    },
    {
      id: 2,
      buyer: {
        name: 'Mike Rodriguez',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        online: false
      },
      item: 'Mid-Century Table Lamp',
      lastMessage: 'Can you provide more photos of the lamp base?',
      timestamp: '5 hours ago',
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'buyer',
          message: 'Hi there! I\'m interested in your mid-century table lamp.',
          timestamp: '2024-01-15 08:00 AM',
          read: true
        },
        {
          id: 2,
          sender: 'seller',
          message: 'Great! It\'s a beautiful piece. What would you like to know about it?',
          timestamp: '2024-01-15 08:15 AM',
          read: true
        },
        {
          id: 3,
          sender: 'buyer',
          message: 'Can you provide more photos of the lamp base? I want to see the details.',
          timestamp: '2024-01-15 08:30 AM',
          read: true
        }
      ]
    },
    {
      id: 3,
      buyer: {
        name: 'Emma Kim',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
        online: true
      },
      item: 'Handwoven Wall Tapestry',
      lastMessage: 'What are the exact dimensions?',
      timestamp: '1 day ago',
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'buyer',
          message: 'Hello! I love your handwoven wall tapestry. What are the exact dimensions?',
          timestamp: '2024-01-14 03:00 PM',
          read: true
        },
        {
          id: 2,
          sender: 'seller',
          message: 'Hi Emma! The tapestry is 36 inches wide by 48 inches tall. Perfect for a feature wall!',
          timestamp: '2024-01-14 03:30 PM',
          read: true
        }
      ]
    },
    {
      id: 4,
      buyer: {
        name: 'David Lee',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        online: false
      },
      item: 'Wooden Plant Stand',
      lastMessage: 'Thanks for the quick response!',
      timestamp: '2 days ago',
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'buyer',
          message: 'Is the wooden plant stand sturdy enough for a large plant?',
          timestamp: '2024-01-13 02:00 PM',
          read: true
        },
        {
          id: 2,
          sender: 'seller',
          message: 'Absolutely! It can easily hold plants up to 50 pounds. Very solid construction.',
          timestamp: '2024-01-13 02:15 PM',
          read: true
        },
        {
          id: 3,
          sender: 'buyer',
          message: 'Thanks for the quick response!',
          timestamp: '2024-01-13 02:30 PM',
          read: true
        }
      ]
    }
  ];

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);
  const filteredConversations = conversations.filter(conv =>
    conv.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Add message logic here
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with potential buyers</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-emerald-50 border-emerald-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={conversation.buyer.avatar}
                          alt={conversation.buyer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.buyer.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{conversation.buyer.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 truncate">Re: {conversation.item}</p>
                        <p className={`text-sm truncate ${
                          conversation.unread ? 'font-medium text-gray-900' : 'text-gray-600'
                        }`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={currentConversation.buyer.avatar}
                            alt={currentConversation.buyer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {currentConversation.buyer.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{currentConversation.buyer.name}</h3>
                          <p className="text-sm text-gray-600">About: {currentConversation.item}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Star className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Archive className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'seller'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <div className={`flex items-center justify-end mt-1 text-xs ${
                            message.sender === 'seller' ? 'text-emerald-100' : 'text-gray-500'
                          }`}>
                            <Clock className="h-3 w-3 mr-1" />
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;