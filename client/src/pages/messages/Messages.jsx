import React, { useState, useRef, useEffect } from 'react'
import { Search, Send, MoreVertical, Phone, Video, Info, Paperclip, Smile, X } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import { toast } from '../../components/common/Toast'

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState('1')
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [messages, setMessages] = useState({
    '1': [
      {
        id: '1',
        senderId: '1',
        senderName: 'Sarah Johnson',
        content: 'Hey! Ready for our workout session today?',
        timestamp: '10:30 AM',
        isOwn: false
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        content: 'Absolutely! I\'ve been looking forward to it all week.',
        timestamp: '10:32 AM',
        isOwn: true
      },
      {
        id: '3',
        senderId: '1',
        senderName: 'Sarah Johnson',
        content: 'Perfect! I found this new HIIT routine we should try.',
        timestamp: '10:35 AM',
        isOwn: false
      },
      {
        id: '4',
        senderId: 'me',
        senderName: 'You',
        content: 'Sounds challenging! I\'m up for it 💪',
        timestamp: '10:36 AM',
        isOwn: true
      },
      {
        id: '5',
        senderId: '1',
        senderName: 'Sarah Johnson',
        content: 'Great workout today! Same time tomorrow?',
        timestamp: '2:15 PM',
        isOwn: false
      }
    ],
    '2': [
      {
        id: '1',
        senderId: '2',
        senderName: 'Mike Chen',
        content: 'Thanks for the workout tips! 🙏',
        timestamp: '1:00 PM',
        isOwn: false
      }
    ],
    '3': [
      {
        id: '1',
        senderId: '3',
        senderName: 'Emma Davis',
        content: 'See you at the gym at 6 PM 🏋️‍♀️',
        timestamp: '11:00 AM',
        isOwn: false
      }
    ],
    '4': [
      {
        id: '1',
        senderId: '4',
        senderName: 'David Kim',
        content: 'How was your morning run? 🏃‍♂️',
        timestamp: 'Yesterday',
        isOwn: false
      }
    ]
  })

  const messagesEndRef = useRef(null)
  const emojiPickerRef = useRef(null)

  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Great workout today! Same time tomorrow?',
      timestamp: '2 min ago',
      unread: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Thanks for the workout tips! 🙏',
      timestamp: '1 hour ago',
      unread: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'See you at the gym at 6 PM 🏋️‍♀️',
      timestamp: '3 hours ago',
      unread: 1,
      isOnline: true
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'How was your morning run? 🏃‍♂️',
      timestamp: '1 day ago',
      unread: 0,
      isOnline: false
    }
  ])

  // Common emojis for fitness context
  const emojis = [
    '😀', '😃', '😄', '😁', '😊', '😍', '🤗', '😎', '🤔', '😅',
    '💪', '🏋️‍♂️', '🏋️‍♀️', '🏃‍♂️', '🏃‍♀️', '🚴‍♂️', '🚴‍♀️', '🧘‍♂️', '🧘‍♀️', '🤸‍♂️',
    '🔥', '💯', '👍', '👏', '🙌', '✨', '⚡', '💥', '🎯', '🏆',
    '❤️', '💚', '💙', '💜', '🧡', '💛', '🖤', '🤍', '💖', '💕',
    '👋', '🙏', '👊', '✊', '🤝', '💪', '🤞', '✌️', '👌', '👈'
  ]

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedConversation = conversations.find(conv => conv.id === selectedChat)
  const chatMessages = messages[selectedChat] || []

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newMsg = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    }

    // Add message to the current chat
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }))

    // Update conversation last message and timestamp
    setConversations(prev => prev.map(conv => 
      conv.id === selectedChat 
        ? { 
            ...conv, 
            lastMessage: newMessage.trim(),
            timestamp: 'now',
            unread: 0
          }
        : conv
    ))

    setNewMessage('')
    setShowEmojiPicker(false)
    toast.success('Message sent!')
  }

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji)
  }

  const handleCall = () => {
    toast.info(`Calling ${selectedConversation?.name}...`)
  }

  const handleVideoCall = () => {
    toast.info(`Starting video call with ${selectedConversation?.name}...`)
  }

  const formatTimestamp = (timestamp) => {
    if (timestamp === 'now') return 'now'
    return timestamp
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat === conversation.id ? 'bg-primary-50 border-primary-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar src={conversation.avatar} alt={conversation.name} size="md" />
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">{formatTimestamp(conversation.timestamp)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <span className="ml-2 bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar src={selectedConversation.avatar} alt={selectedConversation.name} size="md" />
                    {selectedConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedConversation.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.isOnline ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleCall}>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleVideoCall}>
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                          : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${message.isOwn ? 'text-right' : 'text-left'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                  {!message.isOwn && (
                    <div className="order-1 mr-3">
                      <Avatar src={selectedConversation.avatar} alt={selectedConversation.name} size="sm" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                <Button variant="ghost" size="sm" type="button">
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12 resize-none"
                    rows="1"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                  
                  {/* Emoji Picker Button */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2" ref={emojiPickerRef}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      type="button" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                    
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">Emojis</h3>
                          <button
                            onClick={() => setShowEmojiPicker(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3 grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiClick(emoji)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                              type="button"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 focus:ring-green-500"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}