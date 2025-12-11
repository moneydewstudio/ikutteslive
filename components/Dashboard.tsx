import React from 'react';
import { User, UserSession } from '../types';
import Button from '../components/Button';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Zap, TrendingUp, Award, Grid, ArrowRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  history: UserSession[];
  onStartQuiz: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, history, onStartQuiz }) => {
  const chartData = history.slice(0, 10).reverse().map((h, i) => ({
    name: `S${i+1}`,
    score: h.readiness
  }));

  const lastSession = history[0];

  return (
    <div className="flex flex-col w-full animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="p-8 border-b border-black bg-white">
         <div className="flex justify-between items-end">
             <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-2">My Stats</h1>
                <p className="text-gray-500 font-medium">Track your progress and readiness.</p>
             </div>
             <Button onClick={onStartQuiz} withArrow>
               Quick Practice
             </Button>
         </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        
        {/* LEFT COLUMN: Profile & Key Metrics */}
        <div className="md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-black bg-bg">
            
            {/* User Profile Cell */}
            <div className="p-6 border-b border-black flex items-center gap-4">
               <div className="w-16 h-16 rounded-full border border-black bg-brand-cream overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
               </div>
               <div>
                   <h2 className="font-black text-xl">{user.name || 'Guest User'}</h2>
                   <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Free Account</span>
               </div>
            </div>

            {/* Readiness Cell */}
            <div className="p-8 flex-1 flex flex-col justify-center items-center text-center bg-brand-lime">
               <span className="font-bold text-sm uppercase tracking-widest mb-4 border border-black px-2 py-1 rounded-full bg-white">Readiness Score</span>
               <h2 className="text-8xl font-black mb-2">{lastSession?.readiness || 0}%</h2>
               <p className="font-medium text-sm max-w-[200px]">Your probability of passing the CPNS exam based on recent performance.</p>
            </div>
        </div>

        {/* RIGHT COLUMN: Charts & History */}
        <div className="md:w-2/3 flex flex-col bg-white">
            
            {/* Chart Section */}
            <div className="h-64 md:h-80 border-b border-black p-6 relative">
                 <div className="absolute top-6 left-6 z-10">
                    <h3 className="font-black text-xl flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Performance Trend
                    </h3>
                 </div>
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData}>
                     <Tooltip 
                        contentStyle={{backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '8px'}}
                        itemStyle={{color: '#D4F938'}}
                        cursor={{stroke: 'black', strokeWidth: 1}}
                     />
                     <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#000000" 
                        strokeWidth={2} 
                        dot={{r: 4, fill: '#D4F938', stroke: 'black', strokeWidth: 1}} 
                        activeDot={{r: 6}}
                     />
                   </LineChart>
                 </ResponsiveContainer>
            </div>

            {/* Bottom Split: Badges & History */}
            <div className="flex flex-col md:flex-row flex-1">
                
                {/* Badges */}
                <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-black bg-gray-50">
                    <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5" /> Achievements
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-square rounded-xl border border-black bg-white flex flex-col items-center justify-center p-2 text-center hover:shadow-md transition-shadow cursor-pointer">
                                <div className={`w-8 h-8 rounded-full border border-black mb-2 ${i===1 ? 'bg-brand-orange' : 'bg-gray-200'}`}></div>
                                <span className="text-[10px] font-bold uppercase">Badge {i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent History List */}
                <div className="md:w-1/2 flex flex-col">
                    <div className="p-4 border-b border-black bg-brand-purple/20 flex justify-between items-center">
                         <h3 className="font-black text-lg">Recent Sessions</h3>
                         <Grid className="w-4 h-4" />
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-64 md:max-h-auto">
                        {history.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 font-medium">No sessions yet.</div>
                        ) : (
                            history.slice(0, 5).map((h, idx) => (
                                <div key={h.id} className="p-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs text-gray-400">0{idx+1}</span>
                                        <div>
                                            <p className="font-bold text-sm">Daily Mix</p>
                                            <p className="text-xs text-gray-500">{new Date(h.completedAt || 0).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-black px-2 py-1 border border-black rounded-md ${h.score >= 3 ? 'bg-brand-lime' : 'bg-brand-pink'}`}>
                                        {h.score}/5
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="p-3 text-center text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">View All History</button>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;