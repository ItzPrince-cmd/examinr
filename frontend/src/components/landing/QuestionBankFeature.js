import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Filter, BookOpen, Check, X } from 'lucide-react';
import { Badge } from '../ui/badge';

// Mock question data
const questionCards = [
  {
    id: 1,
    question: "A particle is moving on a circular path of radius r with uniform speed v. What is the displacement after an angle of 60°?",
    subject: "Physics",
    topic: "Circular Motion",
    difficulty: "Medium"
  },
  {
    id: 2,
    question: "If f(x) = sin²x, then f'(π/4) is equal to:",
    subject: "Mathematics",
    topic: "Calculus",
    difficulty: "Hard"
  },
  {
    id: 3,
    question: "The hybridization of carbon in benzene is:",
    subject: "Chemistry",
    topic: "Organic Chemistry",
    difficulty: "Easy"
  },
  {
    id: 4,
    question: "The pH of a 0.1M solution of a weak acid (Ka = 1.0 × 10^-5) is approximately:",
    subject: "Chemistry",
    topic: "Acids & Bases",
    difficulty: "Medium"
  },
  {
    id: 5,
    question: "A projectile is fired with velocity v at an angle θ. The maximum height reached is:",
    subject: "Physics",
    topic: "Projectile Motion",
    difficulty: "Medium"
  },
];

export function QuestionBankFeature({ scrollProgress }) {
  const containerRef = useRef(null);
  
  // Create transformations based on scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  // Transform values for card animations
  const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]);
  
  // Transform values for text animations
  const titleX = useTransform(scrollYProgress, [0, 0.5], ["-50%", "0%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  
  // Card stack animations
  const getCardStyles = (index) => {
    const rotation = (index - 2) * 5; // Center card = 0, others rotated
    const xOffset = (index - 2) * 30; // Center card = 0, others offset
    const zIndex = 5 - Math.abs(index - 2); // Center card highest z-index
    
    return {
      rotate: rotation,
      x: xOffset,
      zIndex
    };
  };
  
  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />
      <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/3 -right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      
      <div className="w-full max-w-[90rem] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text content */}
        <motion.div
          style={{
            x: titleX,
            opacity: titleOpacity
          }}
          className="text-center lg:text-left"
        >
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
            <BookOpen className="mr-2 h-4 w-4" />
            For Students
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Largest Question Bank for <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              JEE & NEET</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            Access thousands of carefully curated questions with detailed solutions, 
            sorted by subject, topic, and difficulty level to enhance your exam preparation.
          </p>
          
          {/* Feature highlights */}
          <div className="space-y-4 mb-8">
            {[
              "15,000+ Questions with Detailed Solutions",
              "Previous Year Papers and Mock Tests",
              "Topic-wise Practice and Analysis",
              "Personalized Question Recommendations"
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
              >
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3">
                  <Check size={14} />
                </div>
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Search and filter UI mockup */}
          <motion.div 
            className="flex items-center gap-2 p-2 bg-background border border-border rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Search size={18} className="text-muted-foreground ml-2" />
            <div className="flex-1 h-10 bg-muted/30 rounded-md px-3 py-2 text-sm text-muted-foreground">
              Search questions by keywords, formulas or topics...
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                className="flex items-center gap-1 bg-primary/10 text-primary text-sm rounded-full px-3 py-1"
                whileHover={{ scale: 1.05 }}
              >
                <Filter size={14} />
                <span>Physics</span>
                <X size={14} />
              </motion.div>
              <motion.div 
                className="flex items-center gap-1 bg-secondary/10 text-secondary text-sm rounded-full px-3 py-1"
                whileHover={{ scale: 1.05 }}
              >
                <Filter size={14} />
                <span>Medium</span>
                <X size={14} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Card deck animation */}
        <div className="relative h-[500px] perspective-1000">
          {/* Stacked cards */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
            style={{
              scale: cardScale,
              opacity: cardOpacity,
              y: cardY,
            }}
          >
            {questionCards.map((card, index) => (
              <motion.div
                key={card.id}
                className="absolute top-0 left-0 w-full bg-background border border-border rounded-xl shadow-lg p-6 transition-all duration-300"
                initial={getCardStyles(index)}
                whileInView={getCardStyles(index)}
                whileHover={{ 
                  scale: 1.02, 
                  rotate: getCardStyles(index).rotate * 0.8,
                  zIndex: 10 
                }}
                style={{
                  originX: 0.5,
                  originY: 0.5,
                  zIndex: getCardStyles(index).zIndex
                }}
                viewport={{ once: true }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-primary/10 text-primary border-none">
                      {card.subject}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="bg-background">
                        {card.topic}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${card.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                          ${card.difficulty === "Medium" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : ""}
                          ${card.difficulty === "Hard" ? "bg-red-500/10 text-red-500 border-red-500/20" : ""}
                        `}
                      >
                        {card.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-foreground font-medium">{card.question}</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {["A", "B", "C", "D"].map((option) => (
                      <motion.div
                        key={option}
                        className="option-circle border border-border rounded-md p-2 text-center cursor-pointer hover:bg-muted/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Option {option}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-dashed border-primary/20 rounded-full" />
      <div className="absolute bottom-10 left-10 w-64 h-64 border border-dashed border-secondary/20 rounded-full" />
    </div>
  );
}