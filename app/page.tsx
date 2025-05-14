import Link from 'next/link';
import WaitlistForm from "./components/WaitlistForm";
import WaitlistStats from "./components/WaitlistStats";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skyline
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            即将推出令人惊艳的新产品！现在加入等待列表，抢先体验。
          </p>
          <div className="mt-2">
            <Link 
              href="/simple" 
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              前往简易版页面 →
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">加入等待列表</h2>
          <WaitlistForm />
          <div className="mt-6">
            <WaitlistStats />
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium mb-4">为什么选择 Skyline?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-blue-500 text-2xl mb-2">✨</div>
              <h4 className="font-medium mb-2">创新体验</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                全新设计的用户界面，带来前所未有的体验
              </p>
            </div>
            <div className="p-4">
              <div className="text-blue-500 text-2xl mb-2">🚀</div>
              <h4 className="font-medium mb-2">高效工作流</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                提升您的工作效率，让您轻松应对各种挑战
              </p>
            </div>
            <div className="p-4">
              <div className="text-blue-500 text-2xl mb-2">🔒</div>
              <h4 className="font-medium mb-2">安全可靠</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                我们优先考虑您的数据安全，提供全方位保障
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Skyline. 保留所有权利。</p>
      </footer>
    </div>
  );
}
