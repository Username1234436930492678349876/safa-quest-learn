import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mic, MicOff, Volume2, VolumeX, Settings, MessageCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useConversation } from '@11labs/react';
import { toast } from '@/hooks/use-toast';
import aiMentorOwl from '@/assets/ai-mentor-owl.jpg';

interface AIMentorProps {
  language: 'en' | 'ar';
}

const AIMentor = ({ language }: AIMentorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [agentId, setAgentId] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: language === 'en' ? "AI Mentor Connected" : "تم الاتصال بالمرشد الذكي",
        description: language === 'en' ? "You can now talk to your AI mentor!" : "يمكنك الآن التحدث مع مرشدك الذكي!",
      });
    },
    onDisconnect: () => {
      toast({
        title: language === 'en' ? "AI Mentor Disconnected" : "تم قطع الاتصال بالمرشد الذكي",
        description: language === 'en' ? "Session ended." : "انتهت الجلسة.",
      });
    },
    onError: (error) => {
      toast({
        title: language === 'en' ? "Connection Error" : "خطأ في الاتصال",
        description: error.message,
        variant: "destructive"
      });
    },
    overrides: {
      agent: {
        prompt: {
          prompt: language === 'en' 
            ? "You are SafaQuest AI Mentor, a wise and encouraging educational assistant. Help students with their learning journey, explain concepts clearly, provide study tips, and motivate them. Be friendly, supportive, and speak in a way that's appropriate for students. Keep responses concise but helpful."
            : "أنت مرشد SafaQuest الذكي، مساعد تعليمي حكيم ومشجع. ساعد الطلاب في رحلتهم التعليمية، واشرح المفاهيم بوضوح، وقدم نصائح للدراسة، وحفزهم. كن ودودًا وداعمًا وتحدث بطريقة مناسبة للطلاب. اجعل إجاباتك مختصرة ولكن مفيدة."
        },
        firstMessage: language === 'en' 
          ? "Hello there, young learner! I'm your AI mentor here to help you succeed in your quests. What would you like to learn about today?"
          : "مرحبا أيها المتعلم الصغير! أنا مرشدك الذكي هنا لمساعدتك على النجاح في مهامك. ماذا تريد أن تتعلم اليوم؟",
        language: language === 'en' ? 'en' : 'ar'
      }
    }
  });

  const texts = {
    en: {
      title: 'AI Mentor',
      configure: 'Configure AI Mentor',
      apiKeyLabel: 'ElevenLabs API Key',
      agentIdLabel: 'Agent ID (Optional)',
      save: 'Save Configuration',
      startChat: 'Start Conversation',
      endChat: 'End Conversation',
      settings: 'Settings',
      volume: 'Volume',
      mute: 'Mute',
      unmute: 'Unmute',
      connecting: 'Connecting...',
      speaking: 'AI is speaking...',
      listening: 'Listening...',
      needsConfig: 'Configure your AI mentor first',
      placeholder: 'Enter your ElevenLabs API key to enable voice conversations'
    },
    ar: {
      title: 'المرشد الذكي',
      configure: 'إعداد المرشد الذكي',
      apiKeyLabel: 'مفتاح API الخاص بـ ElevenLabs',
      agentIdLabel: 'معرف الوكيل (اختياري)',
      save: 'حفظ الإعدادات',
      startChat: 'بدء المحادثة',
      endChat: 'إنهاء المحادثة',
      settings: 'الإعدادات',
      volume: 'مستوى الصوت',
      mute: 'كتم الصوت',
      unmute: 'إلغاء كتم الصوت',
      connecting: 'جاري الاتصال...',
      speaking: 'الذكي الاصطناعي يتحدث...',
      listening: 'الاستماع...',
      needsConfig: 'قم بإعداد مرشدك الذكي أولاً',
      placeholder: 'أدخل مفتاح ElevenLabs API لتمكين المحادثات الصوتية'
    }
  };

  const t = texts[language];

  const handleSaveConfig = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Missing API Key",
        description: "Please enter your ElevenLabs API key",
        variant: "destructive"
      });
      return;
    }
    
    setIsConfigured(true);
    setShowSettings(false);
    toast({
      title: language === 'en' ? "Configuration Saved" : "تم حفظ الإعدادات",
      description: language === 'en' ? "AI Mentor is now ready to use!" : "المرشد الذكي جاهز للاستخدام الآن!",
    });
  };

  const handleStartConversation = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // For demo purposes, we'll use a public agent or generate signed URL
      const conversationUrl = agentId 
        ? `https://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`
        : 'demo-url'; // You would generate this with your backend
        
      await conversation.startSession({ 
        agentId: agentId || 'demo-agent' // Fallback to demo
      });
    } catch (error) {
      toast({
        title: language === 'en' ? "Microphone Error" : "خطأ في الميكروفون",
        description: language === 'en' ? "Please allow microphone access to use voice chat." : "يرجى السماح بالوصول إلى الميكروفون لاستخدام الدردشة الصوتية.",
        variant: "destructive"
      });
    }
  };

  const handleEndConversation = async () => {
    await conversation.endSession();
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    conversation.setVolume({ volume: newVolume });
  };

  const getStatusText = () => {
    if (conversation.status === 'connected') {
      if (conversation.isSpeaking) return t.speaking;
      return t.listening;
    }
    if (conversation.status === 'connecting') return t.connecting;
    return '';
  };

  const getStatusColor = () => {
    if (conversation.status === 'connected') {
      return conversation.isSpeaking ? 'bg-primary' : 'bg-success';
    }
    return 'bg-muted';
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Card className="quest-card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-quest">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <Avatar className="mx-auto h-16 w-16">
                <AvatarImage src={aiMentorOwl} alt="AI Mentor" />
                <AvatarFallback>🦉</AvatarFallback>
              </Avatar>
              <Button variant="quest" size="sm" className="w-full">
                {isConfigured ? t.startChat : t.configure}
              </Button>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {t.title}
            </DialogTitle>
          </DialogHeader>

          {!isConfigured || showSettings ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">{t.apiKeyLabel}</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={t.placeholder}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agentId">{t.agentIdLabel}</Label>
                <Input
                  id="agentId"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  placeholder="Your custom agent ID"
                />
              </div>

              <Button onClick={handleSaveConfig} className="w-full">
                {t.save}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={aiMentorOwl} alt="AI Mentor" />
                  <AvatarFallback>🦉</AvatarFallback>
                </Avatar>
              </div>

              {conversation.status === 'connected' && (
                <div className="text-center">
                  <Badge variant="secondary" className={`${getStatusColor()} text-white`}>
                    {getStatusText()}
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Label>{t.volume}</Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex gap-2">
                {conversation.status === 'disconnected' ? (
                  <Button onClick={handleStartConversation} className="flex-1" variant="quest">
                    <Mic className="h-4 w-4 mr-2" />
                    {t.startChat}
                  </Button>
                ) : (
                  <Button onClick={handleEndConversation} variant="destructive" className="flex-1">
                    <MicOff className="h-4 w-4 mr-2" />
                    {t.endChat}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIMentor;