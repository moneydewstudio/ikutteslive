import React from 'react';
import { Clock, AlertTriangle, Calendar, ChevronRight, ArrowUpRight } from 'lucide-react';
import Button from './Button';

const TryoutView: React.FC = () => {
  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 md:pb-0">
       
       <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-80px)]">
           
           {/* Left: Main Action */}
           <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black bg-brand-purple flex flex-col justify-center relative overflow-hidden">
               <div className="relative z-10">
                   <div className="inline-flex items-center gap-2 border border-black bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-6">
                       <Clock className="w-3 h-3" />
                       Limited Time
                   </div>
                   <h1 className="text-5xl md:text-7xl font-black leading-none mb-6">
                       Mega<br/>Tryout
                   </h1>
                   <p className="font-bold text-lg mb-8 max-w-md">
                       Full scale simulation. 100 questions. 90 minutes. 
                       Test yourself against the national average.
                   </p>
                   <Button size="lg" variant="black" withArrow>
                       Start Simulation
                   </Button>
               </div>
               
               {/* Decorative BG */}
               <div className="absolute -bottom-20 -right-20 w-64 h-64 border-[40px] border-black opacity-10 rounded-full"></div>
           </div>

           {/* Right: Info & Schedule */}
           <div className="flex flex-col bg-white">
               
               {/* Stats Row */}
               <div className="flex-1 border-b border-black p-8 flex flex-col justify-center">
                   <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                       <Calendar className="w-5 h-5" /> Schedule
                   </h3>
                   <div className="space-y-4">
                       {[1, 2, 3].map(i => (
                           <div key={i} className="flex items-center justify-between p-4 border border-black hover:bg-gray-50 cursor-pointer transition-colors group">
                               <div>
                                   <div className="font-black text-lg">Batch {i}</div>
                                   <div className="text-xs text-gray-500 font-bold">Oct {10 + i}, 2024 • 09:00 WIB</div>
                               </div>
                               <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                           </div>
                       ))}
                   </div>
               </div>

               {/* Bottom Row */}
               <div className="h-1/3 bg-brand-lime p-8 flex items-center justify-between">
                   <div>
                       <div className="text-xs font-black uppercase tracking-widest mb-1">Participants</div>
                       <div className="text-4xl font-black">1,240</div>
                   </div>
                   <div className="h-12 w-12 bg-black text-brand-lime flex items-center justify-center rounded-full">
                       <ArrowUpRight className="w-6 h-6" />
                   </div>
               </div>
           </div>

       </div>

    </div>
  );
};

export default TryoutView;