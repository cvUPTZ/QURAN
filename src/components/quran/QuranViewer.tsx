import React from "react";
import EnhancedQuranViewer from "./EnhancedQuranViewer";

Playing,
    reciters,
    changeReciter,
    togglePlayback,
  ]);

  // Render notes management dialog
  const renderNotesDialog = useCallback(() => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          >
            <Pen className="h-4 w-4 mr-1" />
            الملاحظات
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إدارة الملاحظات</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-72 mt-4">
            {notes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center p-4">
                لا توجد ملاحظات بعد
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative"
                    style={{
                      backgroundColor: `${note.color}10`,
                      borderLeftWidth: "4px",
                      borderLeftColor: note.color,
                    }}
                  >
                    <div className="flex justify-between">
                      <Badge variant="outline" className="mb-2">
                        صفحة {note.pageNumber} - آية {note.ayahNumber}
                      </Badge>
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setEditingNote(note)}
                        >
                          <Pen className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-600"
                          onClick={() => deleteNote(note.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{note.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(note.timestamp).toLocaleDateString()}
                    </p>
                    {note.pageNumber !== currentPage && (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs p-0 h-6 mt-2"
                        onClick={() => {
                          handlePageChange(note.pageNumber);
                          document.body
                            .querySelector('[role="dialog"]')
                            ?.parentElement?.click();
                        }}
                      >
                        الذهاب إلى الصفحة {note.pageNumber}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {editingNote && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">تعديل الملاحظة</h4>
              <div className="space-y-2">
                <Input
                  value={editingNote.text}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, text: e.target.value })
                  }
                  className="text-sm"
                />
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingNote(null)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => updateNote(editingNote)}
                  >
                    حفظ
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }, [
    notes,
    currentPage,
    editingNote,
    deleteNote,
    handlePageChange,
    updateNote,
  ]);

  // Main render
  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full flex flex-col",
        "bg-slate-100 dark:bg-gray-900 transition-colors",
        darkMode ? "dark" : "",
      )}
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 flex flex-wrap items-center justify-between gap-2 w-full">
        <div className="flex items-center space-x-2 rtl:space-x-reverse flex-wrap gap-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>الصفحة السابقة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
            صفحة {currentPage} من 604
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === 604}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>الصفحة التالية</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={showGotoDialog} onOpenChange={setShowGotoDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                إنتقال إلى
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>الإنتقال إلى</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="page">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="page">الصفحة</TabsTrigger>
                  <TabsTrigger value="surah">السورة</TabsTrigger>
                  <TabsTrigger value="juz">الجزء</TabsTrigger>
                </TabsList>

                <TabsContent value="page" className="mt-2">
                  <div className="space-y-2">
                    <Label>اختر الصفحة</Label>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Input
                        type="number"
                        min={1}
                        max={604}
                        value={currentPage}
                        onChange={(e) =>
                          handlePageChange(parseInt(e.target.value) || 1)
                        }
                        className="text-center"
                      />
                      <Button onClick={() => setShowGotoDialog(false)}>
                        إنتقال
                      </Button>
                    </div>

                    {lastVisitedPages.length > 0 && (
                      <div className="mt-4">
                        <Label className="mb-2 block text-sm">
                          آخر الصفحات المزارة
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {lastVisitedPages.map((page) => (
                            <Button
                              key={page}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handlePageChange(page);
                                setShowGotoDialog(false);
                              }}
                              className="text-xs"
                            >
                              صفحة {page}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="surah" className="mt-2">
                  <div className="space-y-2">
                    <Label>اختر السورة</Label>
                    <Select
                      value={selectedSurah?.toString()}
                      onValueChange={(value) => goToSurah(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر السورة" />
                      </SelectTrigger>
                      <SelectContent>
                        {surahs.map((surah) => (
                          <SelectItem
                            key={surah.number}
                            value={surah.number.toString()}
                          >
                            {surah.number}. {surah.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="juz" className="mt-2">
                  <div className="space-y-2">
                    <Label>اختر الجزء</Label>
                    <Select
                      value={selectedJuz?.toString()}
                      onValueChange={(value) => goToJuz(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الجزء" />
                      </SelectTrigger>
                      <SelectContent>
                        {juzs.map((juz) => (
                          <SelectItem
                            key={juz.number}
                            value={juz.number.toString()}
                          >
                            {juz.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-1 rtl:space-x-reverse flex-wrap gap-y-2">
          <div className="relative">
            <Input
              ref={searchInputRef}
              placeholder="بحث في القرآن"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performSearch()}
              className="h-8 w-40 md:w-60 pl-8 rtl:pl-2 rtl:pr-8 text-sm"
            />
            <Search
              className="h-4 w-4 absolute left-2 rtl:left-auto rtl:right-2 top-2 text-gray-400"
              onClick={performSearch}
            />

            {searchResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-72 bg-white dark:bg-gray-900 rounded-md shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700 text-xs font-medium">
                  تم العثور على {searchResults.length} نتيجة
                </div>
                <ScrollArea className="h-60">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => {
                        handlePageChange(result.pageNumber);
                        setSearchResults([]);
                      }}
                    >
                      <p className="text-xs font-medium">
                        صفحة {result.pageNumber} - آية {result.ayahNumber}
                      </p>
                      <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                        {result.text}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmarkToggle}
                  className={isBookmarked ? "text-amber-500" : ""}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked ? "إزالة الإشارة" : "إضافة إشارة"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={togglePlayback}>
                  <Volume2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تشغيل التلاوة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRecording}
                  className={isRecording ? "text-red-500" : ""}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {renderNotesDialog()}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={printCurrentPage}>
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>طباعة الصفحة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={shareCurrentPage}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>مشاركة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">الإعدادات</h4>

                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-dark-mode" className="text-sm">
                    الوضع الليلي
                  </Label>
                  <Switch
                    id="toggle-dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-translation" className="text-sm">
                    إظهار الترجمة
                  </Label>
                  <Switch
                    id="toggle-translation"
                    checked={showTranslation}
                    onCheckedChange={setShowTranslation}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="translation-select" className="text-sm">
                    لغة الترجمة
                  </Label>
                  <Select
                    value={currentTranslation}
                    onValueChange={setCurrentTranslation}
                    disabled={!showTranslation}
                  >
                    <SelectTrigger id="translation-select">
                      <SelectValue placeholder="اختر اللغة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="urdu">اردو</SelectItem>
                      <SelectItem value="french">Français</SelectItem>
                      <SelectItem value="german">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm">حجم الصفحة</Label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <ZoomOut className="h-4 w-4 text-gray-500" />
                    <Slider
                      value={[zoomLevel]}
                      min={50}
                      max={150}
                      step={10}
                      onValueChange={handleZoomChange}
                      className="flex-1"
                    />
                    <ZoomIn className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-center text-xs text-gray-500">
                    {zoomLevel}%
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={toggleFullScreen}
                  >
                    {isFullScreen ? (
                      <>
                        <Minimize2 className="h-3 w-3 mr-1" /> إنهاء ملء الشاشة
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-3 w-3 mr-1" /> ملء الشاشة
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {darkMode ? "الوضع النهاري" : "الوضع الليلي"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content */}
      <Card className="flex-1 overflow-hidden border-0 shadow-none bg-transparent">
        <CardContent className="flex items-center justify-center p-0 h-full relative">
          {/* Page metadata display */}
          <div className="absolute top-2 right-2 z-20 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-md py-1 px-2 text-xs shadow-sm">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              >
                {currentPageData.surahName}
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                الجزء {currentPageData.juzNumber}
              </Badge>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              >
                الحزب {currentPageData.hizbNumber}
              </Badge>
            </div>
          </div>

          {/* Recording controls */}
          {renderRecordingControls()}

          {/* Main Quran page */}
          <div
            className="relative rounded-md overflow-hidden"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transition: "transform 0.2s",
            }}
          >
            {/* Interactive ayah grid */}
            <div className="absolute inset-0 z-10 pointer-events-auto">
              {renderAyahGrid()}
            </div>

            {/* Highlights and notes */}
            <div className="absolute inset-0">{renderHighlightsAndNotes()}</div>

            {/* Actual Quran page image with fallback */}
            <img
              src={currentPageData.imageUrl}
              alt={`صفحة ${currentPage} من المصحف الشريف`}
              className="max-h-full max-w-full object-contain"
              style={{
                filter: darkMode ? "invert(0.85) hue-rotate(180deg)" : "none",
              }}
              onError={(e) => {
                // If image fails to load, we already have fallback content rendered
                console.log(`Failed to load image for page ${currentPage}`);
                // Hide the broken image
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Translation overlay */}
          {renderTranslation()}

          {/* Audio player */}
          {renderAudioPlayer()}
        </CardContent>
      </Card>
    </div>
  );
};

// Default export with memo for performance optimization
export default React.memo(QuranViewer);
