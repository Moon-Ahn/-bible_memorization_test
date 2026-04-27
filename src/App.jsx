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

// 정밀 비교를 위한 LCS 알고리즘 기반 Diff 함수
const getDiff = (target, input) => {
  const n = target.length;
  const m = input.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (target[i - 1] === input[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const diff = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && target[i - 1] === input[j - 1]) {
      diff.unshift({ type: 'match', char: target[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // 입력에만 있는 글자 (무시하거나 특별 처리 가능)
      j--;
    } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
      // 정답에 있는데 입력에는 없는 글자 (틀린 부분)
      diff.unshift({ type: 'miss', char: target[i - 1] });
      i--;
    }
  }
  return diff;
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const currentVerse = VERSES[currentIndex];

  const diffResult = useMemo(() => {
    if (!isChecked) return null;
    return getDiff(currentVerse.text, userInput);
  }, [isChecked, userInput, currentVerse.text]);

  const isExactMatch = useMemo(() => {
    if (!diffResult) return false;
    return !diffResult.some(d => d.type === 'miss');
  }, [diffResult]);

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
      setShowCompleteModal(true);
    }
  };

  const resetAll = () => {
    setCurrentIndex(0);
    setUserInput("");
    setIsChecked(false);
    setShowHint(false);
    setShowCompleteModal(false);
  };

  const progressPercentage = ((currentIndex + (isChecked ? 1 : 0)) / VERSES.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-6 px-4 font-sans text-slate-800">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-indigo-700 flex items-center justify-center gap-2 mb-1">
            <BookOpen className="w-7 h-7" /> 말씀 암송 테스트
          </h1>
          <p className="text-slate-500 text-sm"> 시험 날짜까지 화이팅입니다 </p>
        </header>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Progress</span>
            <span className="text-xs font-medium text-slate-500">{currentIndex + 1} / {VERSES.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-sm font-bold">
                {currentIndex + 1}
              </span>
              <h2 className="text-lg font-bold">{currentVerse.ref}</h2>
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {showHint && (
              <div className="mb-5 p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-900 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                <span className="font-bold">힌트: </span>
                {currentVerse.text.substring(0, 15)}...
              </div>
            )}

            {!isChecked ? (
              <div className="space-y-4">
                <textarea
                  className="w-full h-48 p-5 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 focus:ring-0 outline-none transition-all text-lg leading-relaxed bg-slate-50 focus:bg-white shadow-inner"
                  placeholder="여기에 말씀을 입력하세요..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) handleCheck();
                  }}
                />
                <button
                  disabled={!userInput.trim()}
                  onClick={handleCheck}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                    userInput.trim()
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-[0.98]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" /> 제출하여 확인하기
                </button>
                <p className="text-center text-xs text-slate-400">Ctrl + Enter를 눌러 바로 제출할 수 있습니다.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <div className="w-1 h-3 bg-slate-300 rounded-full"></div> 내 입력 결과
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-lg leading-relaxed">
                    {userInput}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <div className="w-1 h-3 bg-indigo-300 rounded-full"></div> 정답 확인 및 대조
                  </h3>
                  <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-lg leading-relaxed shadow-inner">
                    {diffResult.map((d, i) => (
                      <span
                        key={i}
                        className={d.type === 'match'
                          ? "text-green-600 font-medium"
                          : "bg-red-100 text-red-600 font-bold decoration-wavy underline"
                        }
                      >
                        {d.char}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 일치</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 틀림/누락</span>
                    <span className="ml-auto text-indigo-600">*{isExactMatch ? "완벽하게 암송하셨습니다!" : "틀린 부분을 확인해 보세요."}</span>
                  </div>
                </section>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsChecked(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    <RefreshCw className="w-5 h-5" /> 다시 시도
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                  >
                    다음 말씀으로 <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-90 duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">암송 완료!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              모든 구절을 끝까지 마치셨습니다.<br/>시험 잘 마무리하기를 기도합니다!
            </p>
            <button
              onClick={resetAll}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
            >
              처음부터 다시 하기
            </button>
          </div>
        </div>
      )}

      <footer className="mt-auto pt-10 text-slate-400 text-[10px] tracking-widest uppercase">
        Bible Memory Test Tool
      </footer>
    </div>
  );
}