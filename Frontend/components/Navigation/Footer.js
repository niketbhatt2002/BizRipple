import { TrendingUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-700/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">BizRipple</span>
        </div>
        <div className="text-slate-400 text-sm">
          © {new Date().getFullYear()} BizRipple. Empowering small businesses across Canada.
        </div>
      </div>
    </footer>
  );
}

export default Footer
