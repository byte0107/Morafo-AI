
import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { Send, User, Bot, Loader2, Image as ImageIcon, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
    language: Language;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial Greeting based on language
  useEffect(() => {
    // Only set initial greeting if chat is empty
    if (messages.length === 0) {
      const greeting = language === 'st' 
        ? "Khotso Ntate/M'e! Ke 'na MorafoAI. Nka u thusa joang ka polasi ea hau kajeno? Re ka bua ka bophelo ba likhoho, lijo tsa tlhaho, kapa litheko tsa 'maraka."
        : "Khotso Ntate/M'e! I am MorafoAI. How can I help you with your farm today? We can talk about livestock health, organic feed, or market prices.";
        
      setMessages([{
        id: 'init',
        role: 'model',
        text: greeting,
        timestamp: new Date()
      }]);
    }
  }, [language]); // Only react to language if it changes significantly? Ideally chat persists history regardless of lang switch, but a new greeting is fine.

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const tempImage = selectedImage; // Store to send
    setSelectedImage(null); // Clear UI
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text, tempImage || undefined, language);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorText = language === 'st' 
        ? "Tšoarelo, ke na le bothata ba khokahano. Ke kopa u leke hape."
        : "Sorry, I'm having trouble connecting. Please try again.";
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: errorText,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-green-600 p-4 text-white flex items-center gap-3 shadow-sm">
         <div className="bg-white/20 p-2 rounded-full">
            <Bot size={20} />
         </div>
         <div>
            <h3 className="font-bold">{language === 'st' ? "Morafo Mothusi oa Polasi" : "Morafo Farm Assistant"}</h3>
            <p className="text-xs text-green-100">{language === 'st' ? "E fumaneha ka nako eohle (24/7)" : "Always available (24/7)"}</p>
         </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm
                ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-white border border-green-200 text-green-700'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div className={`p-3 md:p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-gray-800 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'}
                ${msg.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}
              `}>
                {msg.image && (
                    <img src={msg.image} alt="User upload" className="mb-3 rounded-lg max-h-48 object-cover border border-white/20" />
                )}
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-green'}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-2 animate-pulse">
             <div className="w-8 h-8 rounded-full bg-white border border-green-200 flex items-center justify-center mt-1">
                <Bot size={16} className="text-green-700" />
             </div>
             <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">{language === 'st' ? "MorafoAI oa nahana..." : "MorafoAI is thinking..."}</span>
                <Loader2 className="w-3 h-3 animate-spin text-green-600" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3 md:p-4">
        {selectedImage && (
            <div className="mb-2 flex items-center gap-2 bg-gray-100 p-2 rounded-lg w-fit border border-gray-200">
                <img src={selectedImage} alt="Preview" className="w-10 h-10 object-cover rounded" />
                <span className="text-xs text-gray-600 font-medium">{language === 'st' ? "Setšoantšo se kentsoe" : "Image attached"}</span>
                <button onClick={() => setSelectedImage(null)} className="text-gray-500 hover:text-red-500 bg-white rounded-full p-1 shadow-sm">
                    <X size={14} />
                </button>
            </div>
        )}
        <div className="flex gap-2 items-center">
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="p-3 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors border border-transparent hover:border-green-100"
           >
             <ImageIcon size={22} />
             <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
           </button>
           <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             placeholder={language === 'st' ? "Botsa ka mafu, lijo, kapa litheko..." : "Ask about diseases, feed, or prices..."}
             className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none text-gray-800 placeholder-gray-500"
           />
           <button 
             onClick={handleSend}
             disabled={isLoading || (!input && !selectedImage)}
             className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-sm
               ${isLoading || (!input && !selectedImage) 
                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                 : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95'}
             `}
           >
             {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
