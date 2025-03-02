import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Save, X, Edit, Trash2, Plus, MessageCircle } from "lucide-react";

interface Note {
  id: string;
  studentId: string;
  pageNumber: number;
  ayahNumber: number;
  wordPosition: number;
  text: string;
  type: "pronunciation" | "tajweed" | "memorization" | "other";
  timestamp: Date;
}

interface RecitationNotesProps {
  studentId?: string;
  studentName?: string;
  pageNumber?: number;
  notes?: Note[];
  onAddNote?: (note: Omit<Note, "id" | "timestamp">) => void;
  onEditNote?: (noteId: string, text: string, type: Note["type"]) => void;
  onDeleteNote?: (noteId: string) => void;
}

const RecitationNotes = ({
  studentId = "",
  studentName = "أحمد محمد",
  pageNumber = 1,
  notes = [],
  onAddNote = () => {},
  onEditNote = () => {},
  onDeleteNote = () => {},
}: RecitationNotesProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    ayahNumber: 1,
    wordPosition: 1,
    text: "",
    type: "pronunciation" as Note["type"],
  });
  const [editNote, setEditNote] = useState({
    text: "",
    type: "pronunciation" as Note["type"],
  });

  // Default notes if none provided
  const defaultNotes: Note[] = [
    {
      id: "1",
      studentId,
      pageNumber,
      ayahNumber: 1,
      wordPosition: 3,
      text: "خطأ في نطق حرف الضاد",
      type: "pronunciation",
      timestamp: new Date(),
    },
    {
      id: "2",
      studentId,
      pageNumber,
      ayahNumber: 2,
      wordPosition: 5,
      text: "عدم تطبيق حكم الإدغام",
      type: "tajweed",
      timestamp: new Date(),
    },
    {
      id: "3",
      studentId,
      pageNumber,
      ayahNumber: 3,
      wordPosition: 2,
      text: "نسيان كلمة في منتصف الآية",
      type: "memorization",
      timestamp: new Date(),
    },
  ];

  const displayNotes = notes.length > 0 ? notes : defaultNotes;

  const handleAddNote = () => {
    onAddNote({
      studentId,
      pageNumber,
      ayahNumber: newNote.ayahNumber,
      wordPosition: newNote.wordPosition,
      text: newNote.text,
      type: newNote.type,
    });
    setNewNote({
      ayahNumber: 1,
      wordPosition: 1,
      text: "",
      type: "pronunciation",
    });
    setIsAddingNote(false);
  };

  const handleEditNote = (noteId: string) => {
    onEditNote(noteId, editNote.text, editNote.type);
    setEditingNoteId(null);
  };

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditNote({
      text: note.text,
      type: note.type,
    });
  };

  const getNoteBadgeColor = (type: Note["type"]) => {
    switch (type) {
      case "pronunciation":
        return "bg-red-100 text-red-800 border-red-200";
      case "tajweed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "memorization":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "other":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeInArabic = (type: Note["type"]) => {
    switch (type) {
      case "pronunciation":
        return "نطق";
      case "tajweed":
        return "تجويد";
      case "memorization":
        return "حفظ";
      case "other":
        return "أخرى";
      default:
        return type;
    }
  };

  return (
    <Card className="w-full h-full bg-white border-2 border-amber-100 shadow-md overflow-auto">
      <CardHeader className="bg-amber-50 border-b border-amber-100 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-amber-800 font-amiri">
            ملاحظات التلاوة
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-amber-700 border-amber-200 hover:bg-amber-100"
            onClick={() => setIsAddingNote(true)}
          >
            <Plus className="h-4 w-4 ml-1" />
            إضافة ملاحظة
          </Button>
        </div>
        <div className="text-sm text-amber-700">
          <p>
            الطالب: <span className="font-semibold">{studentName}</span>
          </p>
          <p>
            الصفحة: <span className="font-semibold">{pageNumber}</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {isAddingNote && (
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-amber-800 font-amiri">
                إضافة ملاحظة جديدة
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                onClick={() => setIsAddingNote(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  رقم الآية
                </label>
                <Input
                  type="number"
                  min={1}
                  value={newNote.ayahNumber}
                  onChange={(e) =>
                    setNewNote({
                      ...newNote,
                      ayahNumber: parseInt(e.target.value) || 1,
                    })
                  }
                  className="text-right"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  موضع الكلمة
                </label>
                <Input
                  type="number"
                  min={1}
                  value={newNote.wordPosition}
                  onChange={(e) =>
                    setNewNote({
                      ...newNote,
                      wordPosition: parseInt(e.target.value) || 1,
                    })
                  }
                  className="text-right"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">
                نوع الملاحظة
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "pronunciation", label: "نطق" },
                  { value: "tajweed", label: "تجويد" },
                  { value: "memorization", label: "حفظ" },
                  { value: "other", label: "أخرى" },
                ].map((type) => (
                  <Badge
                    key={type.value}
                    variant="outline"
                    className={`cursor-pointer ${newNote.type === type.value ? getNoteBadgeColor(type.value as Note["type"]) : ""}`}
                    onClick={() =>
                      setNewNote({
                        ...newNote,
                        type: type.value as Note["type"],
                      })
                    }
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">
                نص الملاحظة
              </label>
              <Textarea
                value={newNote.text}
                onChange={(e) =>
                  setNewNote({ ...newNote, text: e.target.value })
                }
                placeholder="أدخل ملاحظتك هنا..."
                className="text-right min-h-[80px]"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="default"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleAddNote}
                disabled={!newNote.text.trim()}
              >
                <Save className="h-4 w-4 ml-1" />
                حفظ الملاحظة
              </Button>
            </div>
          </div>
        )}

        {displayNotes.length > 0 ? (
          <div className="space-y-3">
            {displayNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-md border ${editingNoteId === note.id ? "bg-amber-50 border-amber-200" : "border-gray-200 hover:border-amber-200"}`}
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="outline"
                        className={`${getNoteBadgeColor(note.type)}`}
                      >
                        الآية {note.ayahNumber} - الكلمة {note.wordPosition}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                          onClick={() => setEditingNoteId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "pronunciation", label: "نطق" },
                        { value: "tajweed", label: "تجويد" },
                        { value: "memorization", label: "حفظ" },
                        { value: "other", label: "أخرى" },
                      ].map((type) => (
                        <Badge
                          key={type.value}
                          variant="outline"
                          className={`cursor-pointer ${editNote.type === type.value ? getNoteBadgeColor(type.value as Note["type"]) : ""}`}
                          onClick={() =>
                            setEditNote({
                              ...editNote,
                              type: type.value as Note["type"],
                            })
                          }
                        >
                          {type.label}
                        </Badge>
                      ))}
                    </div>

                    <Textarea
                      value={editNote.text}
                      onChange={(e) =>
                        setEditNote({ ...editNote, text: e.target.value })
                      }
                      className="text-right min-h-[80px]"
                    />

                    <div className="flex justify-end">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={() => handleEditNote(note.id)}
                        disabled={!editNote.text.trim()}
                      >
                        <Save className="h-4 w-4 ml-1" />
                        حفظ التغييرات
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${getNoteBadgeColor(note.type)}`}
                        >
                          {getTypeInArabic(note.type)}
                        </Badge>
                        <Badge variant="outline">
                          الآية {note.ayahNumber} - الكلمة {note.wordPosition}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-amber-600"
                                onClick={() => startEditingNote(note)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>تعديل</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                                onClick={() => onDeleteNote(note.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>حذف</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <p className="text-gray-700 text-right">{note.text}</p>
                    <div className="text-xs text-gray-500 mt-2 text-left">
                      {note.timestamp.toLocaleString("ar-SA")}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-700 mb-1 font-amiri">
              لا توجد ملاحظات بعد
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              قم بإضافة ملاحظات على تلاوة الطالب لتصحيح النطق أو التجويد أو
              الحفظ
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecitationNotes;
