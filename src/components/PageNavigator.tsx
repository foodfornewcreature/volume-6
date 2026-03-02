import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChapter } from '@/lib/book-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PageOption {
  chapterId: string;
  value: string;
  id?: string;
}

export function PageNavigator() {
  const [tamilPages, setTamilPages] = useState<PageOption[]>([]);
  const [englishPages, setEnglishPages] = useState<PageOption[]>([]);
  const [selectedTamilPage, setSelectedTamilPage] = useState<string>('');
  const [selectedEnglishPage, setSelectedEnglishPage] = useState<string>('');
  const [tamilPageInput, setTamilPageInput] = useState<string>('');
  const [englishPageInput, setEnglishPageInput] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPages = async () => {
      setLoading(true);
      const tamilPagesArray: PageOption[] = [];
      const englishPagesArray: PageOption[] = [];

      // Fetch data from all chapters (17 chapters)
      for (let i = 1; i <= 17; i++) {
        const chapterId = i.toString().padStart(2, '0');
        const chapterData = await getChapter(chapterId);
        
        if (chapterData) {
          // Extract Tamil pages (type: "page")
          const tamilPageItems = chapterData.filter(item => item.type === 'page');
          tamilPageItems.forEach(item => {
            tamilPagesArray.push({
              chapterId,
              value: item.value,
              id: item.id
            });
          });

          // Extract English pages (type: "eng_page")
          chapterData.forEach(item => {
            if (item.type === 'paragraph') {
              const engPageItems = item.content.filter(content => content.type === 'eng_page');
              engPageItems.forEach(engPage => {
                englishPagesArray.push({
                  chapterId,
                  value: engPage.value
                });
              });
            }
          });
        }
      }

      setTamilPages(tamilPagesArray);
      setEnglishPages(englishPagesArray);
      setLoading(false);
    };

    fetchAllPages();
  }, []);

  const handleGoToPage = () => {
    // Handle typed Tamil page input
    if (tamilPageInput.trim()) {
      const pageValue = tamilPageInput.trim().padStart(3, '0');
      // Find which chapter contains this page
      const foundPage = tamilPages.find(p => {
        const pageNum = p.value.replace(/^Page\s+/i, '').trim();
        return pageNum === pageValue;
      });
      if (foundPage) {
        navigate(`/chapter/${foundPage.chapterId}?page=${pageValue}`);
      } else {
        // If not found, default to chapter 1
        navigate(`/chapter/01?page=${pageValue}`);
      }
      return;
    }

    // Handle typed English page input
    if (englishPageInput.trim()) {
      const pageValue = englishPageInput.trim();
      // Find which chapter contains this English page
      const foundPage = englishPages.find(p => p.value === pageValue || p.value === `[${pageValue}]` || p.value === `[Page ${pageValue}]`);
      if (foundPage) {
        navigate(`/chapter/${foundPage.chapterId}?page=${foundPage.value}`);
      } else {
        // If not found, default to chapter 1 with the typed value
        navigate(`/chapter/01?page=${pageValue}`);
      }
      return;
    }

    // Handle dropdown selection
    if (selectedTamilPage) {
      const [chapterId, rawPageValue] = selectedTamilPage.split('|');
      // Normalize the page value to match the ID format in ChapterContent.tsx (e.g., "002" from "Page 002")
      const pageValue = rawPageValue.replace(/^Page\s+/i, '').trim();
      navigate(`/chapter/${chapterId}?page=${pageValue}`);
    } else if (selectedEnglishPage) {
      const [chapterId, pageValue] = selectedEnglishPage.split('|');
      // For English pages, we need to use the full value including brackets
      // as the ID in ChapterContent.tsx is formatted as `page-${contentPart.value}`
      navigate(`/chapter/${chapterId}?page=${pageValue}`);
    }
  };

  // Handle Tamil dropdown change - clear input when dropdown is used
  const handleTamilDropdownChange = (value: string) => {
    setSelectedTamilPage(value);
    setTamilPageInput('');
    setSelectedEnglishPage('');
    setEnglishPageInput('');
  };

  // Handle English dropdown change - clear input when dropdown is used
  const handleEnglishDropdownChange = (value: string) => {
    setSelectedEnglishPage(value);
    setEnglishPageInput('');
    setSelectedTamilPage('');
    setTamilPageInput('');
  };

  // Handle Tamil input change - clear dropdown when input is used
  const handleTamilInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTamilPageInput(e.target.value);
    setSelectedTamilPage('');
    setSelectedEnglishPage('');
    setEnglishPageInput('');
  };

  // Handle English input change - clear dropdown when input is used
  const handleEnglishInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnglishPageInput(e.target.value);
    setSelectedEnglishPage('');
    setSelectedTamilPage('');
    setTamilPageInput('');
  };

  return (
    <div className="flex flex-row gap-2 p-3 md:p-4 rounded-lg border bg-card">
      <div className="flex-1">
        <label htmlFor="tamil-page" className="block text-xs font-medium mb-1">Tamil Page</label>
        <Select
          value={selectedTamilPage}
          onValueChange={handleTamilDropdownChange}
          disabled={loading}
        >
          <SelectTrigger id="tamil-page" className="w-full">
            <SelectValue placeholder="Select Tamil page" />
          </SelectTrigger>
          <SelectContent>
            {tamilPages.map((page, index) => (
              <SelectItem key={`${page.chapterId}-${page.value}-${index}`} value={`${page.chapterId}|${page.value}`}>
                {page.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id="tamil-page-input"
          type="text"
          inputMode="numeric"
          placeholder="Or type page number..."
          value={tamilPageInput}
          onChange={handleTamilInputChange}
          disabled={loading}
          className="mt-2 w-full"
        />
      </div>

      <div className="flex-1">
        <label htmlFor="english-page" className="block text-xs font-medium mb-1">English Page</label>
        <Select
          value={selectedEnglishPage}
          onValueChange={handleEnglishDropdownChange}
          disabled={loading}
        >
          <SelectTrigger id="english-page" className="w-full">
            <SelectValue placeholder="Select English page" />
          </SelectTrigger>
          <SelectContent>
            {englishPages.map((page, index) => (
              <SelectItem key={`${page.chapterId}-${page.value}-${index}`} value={`${page.chapterId}|${page.value}`}>
                {page.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id="english-page-input"
          type="text"
          inputMode="numeric"
          placeholder="Or type page number..."
          value={englishPageInput}
          onChange={handleEnglishInputChange}
          disabled={loading}
          className="mt-2 w-full"
        />
      </div>

      <div className="flex items-end">
        <Button
          onClick={handleGoToPage}
          disabled={loading || (!selectedTamilPage && !selectedEnglishPage && !tamilPageInput.trim() && !englishPageInput.trim())}
          className="w-full mt-auto"
        >
          Go
        </Button>
      </div>
    </div>
  );
}