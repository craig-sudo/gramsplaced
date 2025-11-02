
import React, { useState, useMemo } from 'react';
import { Card } from './common/Card';
import { Icon } from './Icons';
import { User, MemoryItem } from '../types';
import { generateMemoryStory } from '../services/geminiService';

const MOCK_USERS: { [key: string]: User } = {
  stacey: { id: 'stacey', name: 'Stacey', avatar: 'https://picsum.photos/seed/stacey/100/100' },
  craig: { id: 'craig', name: 'Craig', avatar: 'https://picsum.photos/seed/craig/100/100' },
};

const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem1',
    imageUrl: 'https://picsum.photos/seed/cottage/500/700',
    prompt: 'Gram and Dale at the cottage, laughing',
    story: "Here's that unforgettable summer day at the cottage. Gram's laughter was so infectious as she and Dale shared stories on the porch, a perfect moment of simple joy.",
    date: 'Summer 1998',
    uploadedBy: MOCK_USERS.stacey,
  },
  {
    id: 'mem2',
    imageUrl: 'https://picsum.photos/seed/wedding/600/400',
    prompt: "Mom and Dad's wedding day",
    story: "A beautiful snapshot from the wedding day. The look of pure happiness on their faces says it all – the start of a wonderful journey together.",
    date: 'June 1985',
    uploadedBy: MOCK_USERS.craig,
  },
  {
    id: 'mem3',
    imageUrl: 'https://picsum.photos/seed/fishing/500/300',
    prompt: 'First fishing trip',
    story: "Look at that concentration! This was the very first fishing trip, an early morning filled with excitement and a little bit of beginner's luck. A core memory for sure.",
    date: 'July 2002',
    uploadedBy: MOCK_USERS.stacey,
  },
];

const AddMemory: React.FC<{ onAddMemory: (memory: MemoryItem) => void }> = ({ onAddMemory }) => {
  const [prompt, setPrompt] = useState('');
  const [date, setDate] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
          setError('Image is too large. Please choose a file smaller than 4MB.');
          return;
      }
      setImageFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = error => reject(error);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !prompt.trim() || !date.trim()) {
      setError('Please fill out all fields and select an image.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
        const imageBase64 = await fileToBase64(imageFile);
        const story = await generateMemoryStory(imageBase64, imageFile.type, prompt);

        const newMemory: MemoryItem = {
            id: `mem${Date.now()}`,
            imageUrl: previewUrl!,
            prompt,
            story,
            date,
            uploadedBy: MOCK_USERS.craig, // Assuming current user is Craig
        };
        onAddMemory(newMemory);

        // Reset form
        setPrompt('');
        setDate('');
        setImageFile(null);
        setPreviewUrl(null);

    } catch (err) {
        setError('Failed to generate memory. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card title="Add a New Memory" icon={<Icon name="plus" className="w-6 h-6 text-brand-accent" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 font-sans normal-case">Photo</label>
          <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
              ) : (
                <Icon name="upload" className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-primary/80 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 4MB</p>
            </div>
          </div>
        </div>

        <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 font-sans normal-case">Describe the memory</label>
            <input type="text" id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., Gram and Dale at the cottage" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm font-sans" />
        </div>

        <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 font-sans normal-case">Date of memory</label>
            <input type="text" id="date" value={date} onChange={e => setDate(e.target.value)} placeholder="e.g., Summer 1998" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm font-sans" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-105">
            {isLoading ? <Icon name="spinner" /> : 'Create Memory with AI'}
        </button>
      </form>
    </Card>
  );
};

type SortOrder = 'newest' | 'oldest';

export const Memories: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const addMemory = (memory: MemoryItem) => {
      setMemories(prev => [memory, ...prev]);
  }

  const sortedMemories = useMemo(() => {
    const sortableMemories = [...memories];
    if (sortOrder === 'oldest') {
      // Newest items are prepended, so reversing the array gives the oldest first
      return sortableMemories.reverse();
    }
    // 'newest' is the default order as new items are added to the front
    return sortableMemories;
  }, [memories, sortOrder]);


  return (
    <div className="space-y-8">
       <div className="text-center">
            <h2 className="text-3xl text-brand-text">Photo Memories</h2>
            <p className="text-brand-subtle mt-1 font-sans normal-case">A shared album of our favorite moments.</p>
            <div className="mt-4 flex justify-center items-center gap-2 font-sans">
                <span className="text-sm font-medium text-gray-600">Sort by:</span>
                 <button 
                    onClick={() => setSortOrder('newest')}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out hover:scale-105 ${sortOrder === 'newest' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Newest First
                </button>
                 <button 
                    onClick={() => setSortOrder('oldest')}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out hover:scale-105 ${sortOrder === 'oldest' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Oldest First
                </button>
            </div>
        </div>
      <AddMemory onAddMemory={addMemory} />
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {sortedMemories.map(memory => (
            <div 
                key={memory.id} 
                className="break-inside-avoid bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1"
                onClick={() => setSelectedMemory(memory)}
            >
                <img src={memory.imageUrl} alt={memory.prompt} className="w-full h-auto object-cover"/>
                <div className="p-4 font-sans">
                    <p className="text-brand-text leading-relaxed line-clamp-3">"{memory.story}"</p>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src={memory.uploadedBy.avatar} alt={memory.uploadedBy.name} className="w-6 h-6 rounded-full" />
                            <span className="text-xs font-medium text-brand-subtle">Added by {memory.uploadedBy.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-brand-primary">{memory.date}</span>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {selectedMemory && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setSelectedMemory(null)}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden font-sans"
                onClick={e => e.stopPropagation()}
            >
                <div className="md:w-3/5 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <img src={selectedMemory.imageUrl} alt={selectedMemory.prompt} className="w-full h-full object-contain"/>
                </div>
                <div className="p-6 flex flex-col md:w-2/5">
                    <p className="text-brand-text leading-relaxed flex-grow">"{selectedMemory.story}"</p>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src={selectedMemory.uploadedBy.avatar} alt={selectedMemory.uploadedBy.name} className="w-8 h-8 rounded-full" />
                            <span className="text-sm font-medium text-brand-subtle">Added by {selectedMemory.uploadedBy.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-brand-primary">{selectedMemory.date}</span>
                    </div>
                </div>
                <button 
                    onClick={() => setSelectedMemory(null)} 
                    className="absolute top-4 right-4 bg-white/70 rounded-full p-2 text-gray-700 hover:bg-white hover:text-black transition-colors"
                    aria-label="Close memory view"
                >
                    <Icon name="close" className="w-6 h-6" />
                </button>
            </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
