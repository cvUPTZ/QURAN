import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Bell,
  Users,
  Send,
  ChevronLeft,
  Search,
  Filter,
  PlusCircle,
  Paperclip,
  Download,
  FileText,
  Image as ImageIcon,
  Mic,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
} from "lucide-react";

interface CommunicationHubProps {
  onNavigateBack?: () => void;
}

const CommunicationHub = ({
  onNavigateBack = () => {},
}: CommunicationHubProps) => {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for chats
  const chats = [
    {
      id: "1",
      name: "محمد أحمد",
      role: "معلم القرآن",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1",
      lastMessage: "شكراً جزيلاً، سنعمل على ذلك.",
      time: "10:45 ص",
      unread: 2,
      online: true,
      messages: [
        {
          id: "m1",
          sender: "them",
          text: "السلام عليكم، أود إبلاغكم بأن أحمد أظهر تقدماً ملحوظاً في حفظ سورة البقرة هذا الأسبوع.",
          time: "10:30 ص",
        },
        {
          id: "m2",
          sender: "me",
          text: "وعليكم السلام، شكراً جزيلاً على المتابعة. هل هناك تمارين إضافية يمكننا العمل عليها في المنزل؟",
          time: "10:35 ص",
        },
        {
          id: "m3",
          sender: "them",
          text: "نعم، أنصح بمراجعة الآيات 1-10 من سورة البقرة يومياً، والتركيز على مخارج الحروف خاصة في الآيات 6-7.",
          time: "10:40 ص",
        },
        {
          id: "m4",
          sender: "them",
          text: "كما أرفقت لكم تسجيلاً صوتياً للآيات لتساعدوه في المراجعة.",
          time: "10:42 ص",
          attachment: { name: "تسجيل_سورة_البقرة.mp3", type: "audio" },
        },
        {
          id: "m5",
          sender: "me",
          text: "شكراً جزيلاً، سنعمل على ذلك. هل يمكنكم إرسال جدول المراجعة للأسبوع القادم؟",
          time: "10:45 ص",
        },
      ],
    },
    {
      id: "2",
      name: "خالد محمود",
      role: "مشرف الحلقة",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2",
      lastMessage: "موعد الاجتماع غداً الساعة 5 مساءً",
      time: "أمس",
      unread: 0,
      online: false,
      messages: [
        {
          id: "m6",
          sender: "them",
          text: "السلام عليكم، أود تذكيركم بموعد اجتماع أولياء الأمور غداً.",
          time: "أمس، 4:30 م",
        },
        {
          id: "m7",
          sender: "me",
          text: "وعليكم السلام، شكراً للتذكير. سأكون حاضراً إن شاء الله.",
          time: "أمس، 4:35 م",
        },
        {
          id: "m8",
          sender: "them",
          text: "موعد الاجتماع غداً الساعة 5 مساءً في قاعة الاجتماعات الرئيسية.",
          time: "أمس، 4:40 م",
        },
      ],
    },
    {
      id: "3",
      name: "إدارة المدرسة",
      role: "إشعارات وتنبيهات",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      lastMessage: "تم تغيير موعد الاختبار الشهري إلى يوم الأربعاء",
      time: "2 يونيو",
      unread: 1,
      online: true,
      messages: [
        {
          id: "m9",
          sender: "them",
          text: "تنبيه: تم تغيير موعد الاختبار الشهري إلى يوم الأربعاء القادم بدلاً من الثلاثاء.",
          time: "2 يونيو، 9:00 ص",
        },
        {
          id: "m10",
          sender: "them",
          text: "نرجو الاطلاع على جدول الاختبارات المرفق.",
          time: "2 يونيو، 9:05 ص",
          attachment: { name: "جدول_الاختبارات.pdf", type: "document" },
        },
      ],
    },
  ];

  // Mock data for announcements
  const announcements = [
    {
      id: "a1",
      title: "موعد الاختبار النهائي للفصل الدراسي",
      content:
        "نود إعلامكم بأن الاختبارات النهائية للفصل الدراسي الحالي ستبدأ يوم الأحد الموافق 15 يونيو وتستمر حتى يوم الخميس 19 يونيو. نرجو من جميع الطلاب الاستعداد الجيد والالتزام بمواعيد الاختبارات.",
      date: "5 يونيو 2023",
      sender: "إدارة المدرسة",
      important: true,
    },
    {
      id: "a2",
      title: "دعوة لحضور حفل ختم القرآن السنوي",
      content:
        "يسرنا دعوتكم لحضور حفل ختم القرآن السنوي الذي سيقام يوم السبت الموافق 20 يونيو في قاعة الاحتفالات الكبرى بالمدرسة في تمام الساعة 7 مساءً. سيتم تكريم الطلاب المتميزين في حفظ وتلاوة القرآن الكريم.",
      date: "3 يونيو 2023",
      sender: "لجنة الأنشطة الطلابية",
      important: false,
    },
    {
      id: "a3",
      title: "تغيير في مواعيد الحصص خلال شهر رمضان",
      content:
        "نود إعلامكم بأنه سيتم تعديل مواعيد الحصص الدراسية خلال شهر رمضان المبارك لتكون من الساعة 10 صباحاً وحتى 2 ظهراً. كما سيتم تخصيص فترة مسائية اختيارية للمراجعة من الساعة 9 مساءً وحتى 11 مساءً.",
      date: "28 مايو 2023",
      sender: "إدارة المدرسة",
      important: true,
    },
  ];

  // Mock data for events
  const events = [
    {
      id: "e1",
      title: "مسابقة حفظ القرآن الكريم",
      date: "15 يونيو 2023",
      time: "10:00 صباحاً",
      location: "قاعة الاحتفالات الكبرى",
      description:
        "مسابقة سنوية لحفظ القرآن الكريم للطلاب المتميزين، مع جوائز قيمة للفائزين.",
      status: "upcoming",
    },
    {
      id: "e2",
      title: "اجتماع أولياء الأمور الدوري",
      date: "10 يونيو 2023",
      time: "5:00 مساءً",
      location: "قاعة الاجتماعات",
      description:
        "اجتماع دوري لمناقشة مستوى الطلاب وخطط التحسين للفترة القادمة.",
      status: "upcoming",
    },
    {
      id: "e3",
      title: "ورشة عمل: كيفية تحفيز الأبناء على حفظ القرآن",
      date: "5 يونيو 2023",
      time: "6:30 مساءً",
      location: "قاعة التدريب",
      description:
        "ورشة عمل تفاعلية للآباء والأمهات حول أفضل الطرق لتحفيز الأبناء على حفظ القرآن الكريم.",
      status: "completed",
    },
  ];

  const selectedChatData = chats[selectedChat];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    // In a real app, you would send this message to the server
    console.log("Sending message:", messageText);

    // Clear the input field
    setMessageText("");
  };

  const renderAttachment = (attachment: { name: string; type: string }) => {
    let icon = <FileText className="h-4 w-4" />;
    let bgColor = "bg-blue-100";
    let textColor = "text-blue-700";

    if (attachment.type === "image") {
      icon = <ImageIcon className="h-4 w-4" />;
      bgColor = "bg-purple-100";
      textColor = "text-purple-700";
    } else if (attachment.type === "audio") {
      icon = <Mic className="h-4 w-4" />;
      bgColor = "bg-emerald-100";
      textColor = "text-emerald-700";
    }

    return (
      <div className="mt-2 bg-white p-2 rounded border flex items-center gap-2">
        <div className={`${bgColor} p-1 rounded`}>{icon}</div>
        <span className="text-xs">{attachment.name}</span>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 ml-auto">
          <Download className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const renderEventStatus = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            قادم
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            منتهي
          </Badge>
        );
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-[#f8f7f2] islamic-pattern p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold text-gray-800 font-amiri">
              مركز التواصل
            </h1>
            <p className="text-gray-600">
              تواصل مع المعلمين والإدارة ومتابعة الإعلانات والفعاليات
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onNavigateBack}
          >
            <ChevronLeft className="h-4 w-4" />
            العودة
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>الرسائل</span>
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              <span>الإعلانات</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>الفعاليات</span>
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
                  {/* Contacts List */}
                  <div className="border-r">
                    <div className="p-3 border-b bg-gray-50">
                      <div className="relative">
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="بحث عن محادثة..."
                          className="pr-9 text-right"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[550px]">
                      <div className="divide-y">
                        {chats.map((chat, index) => (
                          <div
                            key={chat.id}
                            className={`p-3 cursor-pointer transition-colors ${selectedChat === index ? "bg-emerald-50 border-r-4 border-emerald-500" : "hover:bg-gray-50"}`}
                            onClick={() => setSelectedChat(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar>
                                  <AvatarImage
                                    src={chat.avatar}
                                    alt={chat.name}
                                  />
                                  <AvatarFallback>
                                    {chat.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {chat.online && (
                                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium truncate">
                                    {chat.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {chat.time}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {chat.role}
                                </p>
                                <p className="text-sm truncate mt-1">
                                  {chat.lastMessage}
                                </p>
                              </div>
                              {chat.unread > 0 && (
                                <Badge className="bg-emerald-500 text-white">
                                  {chat.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Chat Area */}
                  <div className="md:col-span-2 flex flex-col h-full">
                    {/* Chat Header */}
                    <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={selectedChatData.avatar}
                            alt={selectedChatData.name}
                          />
                          <AvatarFallback>
                            {selectedChatData.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedChatData.name}</p>
                          <p className="text-xs text-gray-500">
                            {selectedChatData.online
                              ? "متصل الآن"
                              : "آخر ظهور: منذ ساعة"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {selectedChatData.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`rounded-lg p-3 max-w-[80%] ${message.sender === "me" ? "bg-emerald-100" : "bg-gray-100"}`}
                            >
                              <p className="text-sm">{message.text}</p>
                              {message.attachment &&
                                renderAttachment(message.attachment)}
                              <p className="text-xs text-gray-500 mt-1 text-left">
                                {message.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-3 border-t bg-white">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="اكتب رسالتك هنا..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>الإعلانات والتنبيهات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border ${announcement.important ? "border-amber-300 bg-amber-50" : "border-gray-200 bg-white"}`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">
                          {announcement.title}
                        </h3>
                        {announcement.important && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            هام
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        بواسطة: {announcement.sender} - {announcement.date}
                      </p>
                      <Separator className="my-3" />
                      <p className="text-gray-700">{announcement.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>الفعاليات والمناسبات</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  <span>عرض التقويم</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      الفعاليات القادمة
                    </h3>
                    <div className="space-y-4">
                      {events
                        .filter((e) => e.status === "upcoming")
                        .map((event) => (
                          <div
                            key={event.id}
                            className="p-4 rounded-lg border border-blue-200 bg-blue-50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-blue-600" />
                                  <h4 className="font-medium">{event.title}</h4>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span>
                                      {event.date} - {event.time}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Info className="h-4 w-4 text-blue-600" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                              </div>
                              {renderEventStatus(event.status)}
                            </div>
                            <p className="text-sm mt-3">{event.description}</p>
                            <div className="mt-3 flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                تفاصيل أكثر
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs bg-blue-600 hover:bg-blue-700"
                              >
                                تأكيد الحضور
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      الفعاليات السابقة
                    </h3>
                    <div className="space-y-4">
                      {events
                        .filter((e) => e.status === "completed")
                        .map((event) => (
                          <div
                            key={event.id}
                            className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-gray-600" />
                                  <h4 className="font-medium">{event.title}</h4>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-gray-600" />
                                    <span>
                                      {event.date} - {event.time}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Info className="h-4 w-4 text-gray-600" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                              </div>
                              {renderEventStatus(event.status)}
                            </div>
                            <p className="text-sm mt-3">{event.description}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Islamic Pattern Decoration */}
        <div className="mt-8 opacity-10">
          <div className="h-24 w-full bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000')] bg-repeat-x bg-contain" />
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;
