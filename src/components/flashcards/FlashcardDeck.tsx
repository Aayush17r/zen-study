import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import confetti from 'canvas-confetti';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Plus,
  Trash2,
  Brain,
  Check,
  BookOpen,
} from 'lucide-react';

export const FlashcardDeck: React.FC = () => {
  const {
    decks,
    flashcards,
    activeDeckId,
    setActiveDeckId,
    addDeck,
    deleteDeck,
    addCard,
    deleteCard,
    updateCardMastery,
  } = useStudy();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isAddingDeck, setIsAddingDeck] = useState(false);

  // New deck form
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');

  // New card form
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const activeCards = flashcards.filter((c) => c.deckId === activeDeckId);
  const currentCard = activeCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % (activeCards.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeCards.length) % (activeCards.length || 1));
  };

  const handleMastery = (mastery: 'learning' | 'reviewing' | 'mastered') => {
    if (!currentCard) return;
    updateCardMastery(currentCard.id, mastery);
    if (mastery === 'mastered') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
    handleNext();
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;
    addDeck(newDeckName, newDeckDesc);
    setNewDeckName('');
    setNewDeckDesc('');
    setIsAddingDeck(false);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeckId || !newQuestion.trim() || !newAnswer.trim()) return;
    addCard(activeDeckId, newQuestion, newAnswer);
    setNewQuestion('');
    setNewAnswer('');
    setIsAddingCard(false);
  };

  const masteredCount = activeCards.filter((c) => c.mastery === 'mastered').length;
  const progressPercent = activeCards.length > 0 ? Math.round((masteredCount / activeCards.length) * 100) : 0;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Active Recall Decks</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAddingCard((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-primary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-color)] flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Card</span>
            </button>
            <button
              onClick={() => setIsAddingDeck((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-primary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-color)] flex items-center gap-1 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Deck</span>
            </button>
          </div>
        </div>

        {/* Deck Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
          {decks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => {
                setActiveDeckId(deck.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeDeckId === deck.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {deck.name}
            </button>
          ))}
        </div>

        {/* Deck Add Form */}
        {isAddingDeck && (
          <form onSubmit={handleCreateDeck} className="p-3 mb-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
            <input
              type="text"
              placeholder="Deck Name (e.g. Biology Exam, French Vocab)"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingDeck(false)}
                className="px-2.5 py-1 rounded-lg text-xs text-[var(--text-muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-medium"
              >
                Save Deck
              </button>
            </div>
          </form>
        )}

        {/* Card Add Form */}
        {isAddingCard && (
          <form onSubmit={handleCreateCard} className="p-3 mb-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
            <textarea
              placeholder="Question / Prompt / Concept"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 resize-none h-16"
            />
            <textarea
              placeholder="Answer / Definition / Explanation"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 resize-none h-16"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="px-2.5 py-1 rounded-lg text-xs text-[var(--text-muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-medium"
              >
                Add Card
              </button>
            </div>
          </form>
        )}

        {/* Progress Bar */}
        {activeCards.length > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1">
              <span>Card {currentIndex + 1} of {activeCards.length}</span>
              <span>{progressPercent}% Mastered</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Card Display Area */}
        {activeCards.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-[var(--bg-primary)] border border-dashed border-[var(--border-color)] text-xs text-[var(--text-muted)] flex flex-col items-center">
            <BookOpen className="w-6 h-6 mb-2 opacity-50" />
            <span>This deck is empty. Click "+ Card" above to add your first study flashcard!</span>
          </div>
        ) : (
          <div>
            <div
              onClick={() => setIsFlipped((prev) => !prev)}
              className="min-h-44 p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-indigo-500/50 cursor-pointer flex flex-col justify-between text-center relative group transition-all select-none shadow-sm"
            >
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span className="uppercase font-semibold tracking-wider">
                  {isFlipped ? 'Answer' : 'Question'}
                </span>
                <span className="flex items-center gap-1 text-indigo-400 group-hover:scale-105 transition-transform">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Click to flip</span>
                </span>
              </div>

              <div className="my-auto py-4">
                <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-relaxed">
                  {isFlipped ? currentCard.answer : currentCard.question}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span className="capitalize">
                  Status: <strong className="text-[var(--text-primary)]">{currentCard.mastery}</strong>
                </span>
                {decks.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeDeckId) deleteDeck(activeDeckId);
                    }}
                    title="Delete Deck"
                    className="hover:text-rose-400 transition-colors"
                  >
                    Delete Deck
                  </button>
                )}
              </div>
            </div>

            {/* Navigation & Mastery Controls */}
            <div className="flex items-center justify-between mt-3 gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                title="Previous card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 flex-1 justify-center">
                <button
                  onClick={() => handleMastery('learning')}
                  className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-rose-500/10 text-rose-400 border border-[var(--border-color)] text-xs font-medium transition-all"
                  title="Needs more practice"
                >
                  Again
                </button>
                <button
                  onClick={() => handleMastery('reviewing')}
                  className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-amber-500/10 text-amber-400 border border-[var(--border-color)] text-xs font-medium transition-all"
                  title="Getting familiar"
                >
                  Reviewing
                </button>
                <button
                  onClick={() => handleMastery('mastered')}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-all"
                  title="Mastered!"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mastered</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => deleteCard(currentCard.id)}
                  className="p-2 rounded-xl bg-[var(--bg-primary)] hover:text-rose-400 border border-[var(--border-color)] text-[var(--text-muted)] transition-colors"
                  title="Delete this card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  title="Next card"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
