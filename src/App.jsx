import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, ArrowRight, RefreshCw, BookOpen, AlertCircle, ChevronRight, HelpCircle } from 'lucide-react';

const VERSES = [
  {
    ref: "신명기 6:4~5",
    text: "이스라엘아 들으라 우리 하나님 여호와는 오직 유일한 여호와이시니 너는 마음을 다하고 뜻을 다하고 힘을 다하여 네 하나님 여호와를 사랑하라"
  },
  {
    ref: "여호수아 1:9",
    text: "내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라"
  },
  {
    ref: "시편 37:4~6",
    text: "또 여호와를 기뻐하라 그가 네 마음의 소원을 네게 이루어 주시리로다 네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고 네 의를 빛 같이 나타내시며 네 공의를 정오의 빛 같이 하시리로다"
  },
  {
    ref: "시편 127:1",
    text: "여호와께서 집을 세우지 아니하시면 세우는 자의 수고가 헛되며 여호와께서 성을 지키지 아니하시면 파수꾼의 깨어 있음이 헛되도다"
  },
  {
    ref: "이사야 41:10",
    text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라"
  },
  {
    ref: "이사야 43:19",
    text: "보라 내가 새 일을 행하리니 이제 나타낼 것이라 너희가 그것을 알지 못하겠느냐 반드시 내가 광야에 길을 사막에 강을 내리니"
  },
  {
    ref: "이사야 43:21",
    text: "이 백성은 내가 나를 위하여 지었나니 나를 찬송하게 하려 함이니라"
  },
  {
    ref: "요한복음 13:34~35",
    text: "새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라 너희가 서로 사랑하면 이로써 모든 사람이 너희가 내 제자인 줄 알리라"
  },
  {
    ref: "갈라디아서 2:20",
    text: "내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라 이제 내가 육체 가운데 사는 것은 나를 사랑하사 나를 위하여 자기 자신을 버리신 하나님의 아들을 믿는 믿음 안에서 사는 것이라"
  }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState([]); // Array of { isCorrect: boolean }

  const currentVerse = VERSES[currentIndex];

  // Logic to compare text and highlight differences
  const compareText = useMemo(() => {
    if (!isChecked) return null;

    const target = currentVerse.text.replace(/\s/g, '');
    const input = userInput.replace(/\s/g, '');

    const targetChars = currentVerse.text.split('');
    const inputChars = userInput.split('');

    let resultElements = [];
    let inputIdx = 0;

    // Simple char-by-char comparison (for visualization)
    for (let i = 0; i < targetChars.length; i++) {
      const targetChar = targetChars[i];
      const inputChar = inputChars[i] || "";

      if (targetChar === inputChar) {
        resultElements.push(<span key={i} className="text-green-600 font-medium">{targetChar}</span>);
      } else {
        resultElements.push(
          <span key={i} className="bg-red-100 text-red-600 font-bold decoration-wavy underline">
            {targetChar}
          </span>
        );
      }
    }

    const isExactMatch = target === input;
    return { elements: resultElements, isExactMatch };
  }, [isChecked, userInput, currentVerse.text]);

  const handleCheck = () => {
    setIsChecked(true);
  };

  const handleNext = () => {
    if (currentIndex < VERSES.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setIsChecked(false);
      setShowHint(false);
    } else {
      // Completed all
      alert("모든 구절 암송을 완료하셨습니다! 축하합니다.");
      resetAll();
    }
  };

  const resetAll = () => {
    setCurrentIndex(0);
    setUserInput("");
    setIsChecked(false);
    setShowHint(false);
  };

  const progressPercentage = ((currentIndex + (isChecked ? 1 : 0)) / VERSES.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 font-sans text-slate-800">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700 flex items-center justify-center gap-2 mb-2">
            <BookOpen className="w-8 h-8" /> 말씀 암송 테스트
          </h1>
          <p className="text-slate-500">지정된 말씀을 암송하고 정확도를 확인해보세요.</p>
        </header>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Progress</span>
            <span className="text-sm font-medium text-slate-500">{currentIndex + 1} / {VERSES.length} 구절</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Test Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 overflow-hidden transition-all duration-300">
          <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                {currentIndex + 1}
              </div>
              <h2 className="text-xl font-bold tracking-tight">{currentVerse.ref}</h2>
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="힌트 보기"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 md:p-8">
            {showHint && (
              <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800 text-sm italic rounded-r-lg animate-in fade-in slide-in-from-top-1">
                <span className="font-bold">힌트: </span>
                {currentVerse.text.substring(0, 15)}...
              </div>
            )}

            {!isChecked ? (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-widest ml-1">
                  암송 내용을 입력하세요
                </label>
                <textarea
                  className="w-full h-40 p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all text-lg leading-relaxed resize-none bg-slate-50 focus:bg-white"
                  placeholder="여기에 말씀을 타이핑하세요..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) handleCheck();
                  }}
                />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-400">Ctrl + Enter 로 제출 가능</span>
                  <button
                    disabled={!userInput.trim()}
                    onClick={handleCheck}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                      userInput.trim()
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" /> 제출하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">내 입력 결과</h3>
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-lg leading-relaxed min-h-[100px]">
                    {userInput || <span className="text-slate-300 italic">내용 없음</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">정답 확인 및 대조</h3>
                  <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 text-lg leading-relaxed shadow-inner">
                    {compareText?.elements}
                  </div>
                  <p className="mt-2 text-xs text-indigo-500">
                    * <span className="bg-red-100 text-red-600 px-1 font-bold">빨간색 부분</span>은 틀렸거나 빠진 부분입니다.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setIsChecked(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <RefreshCw className="w-5 h-5" /> 다시 시도
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                  >
                    {currentIndex === VERSES.length - 1 ? "처음으로 돌아가기" : "다음 말씀으로"} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instruction Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><BookOpen className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm mb-1">9개 핵심 구절</h4>
              <p className="text-xs text-slate-500">엄선된 성경의 보석 같은 구절들을 학습합니다.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><AlertCircle className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm mb-1">정밀한 대조</h4>
              <p className="text-xs text-slate-500">틀린 글자를 정확히 찾아내어 기억을 돕습니다.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><ChevronRight className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm mb-1">순차적 학습</h4>
              <p className="text-xs text-slate-500">하나씩 정복하며 암송 실력을 쌓아갑니다.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-slate-400 text-xs">
        © 2024 말씀 암송 테스트 Tool - Vercel Ready
      </footer>
    </div>
  );
}