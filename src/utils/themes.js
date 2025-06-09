// Theme configurations
 const themes = {
    dark: {
      background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      cardBg: 'bg-white/10 backdrop-blur-xl',
      cardBorder: 'border-white/20',
      text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        muted: 'text-gray-400'
      },
      input: 'bg-white/10 border-white/20 text-white placeholder-gray-400',
      button: {
        primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
        secondary: 'bg-white/10 hover:bg-white/20 text-white border-white/20'
      }
    },
    light: {
      background: 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50',
      cardBg: 'bg-white/70 backdrop-blur-xl',
      cardBorder: 'border-purple-200/50',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-700',
        muted: 'text-gray-500'
      },
      input: 'bg-white/50 border-purple-200/50 text-gray-900 placeholder-gray-500',
      button: {
        primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
        secondary: 'bg-white/50 hover:bg-white/70 text-gray-700 border-purple-200/50'
      }
    }
  };


    export default themes;