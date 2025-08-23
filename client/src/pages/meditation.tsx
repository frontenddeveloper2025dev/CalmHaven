import { useState } from "react";
import BreathingAnimation from "@/components/breathing-animation";
import AmbientSounds from "@/components/ambient-sounds";
import MeditationTimer from "@/components/meditation-timer";
import ProgressStats from "@/components/progress-stats";
import SettingsPanel from "@/components/settings-panel";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MeditationApp() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-sage-50 to-ocean-50 min-h-screen font-inter">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-ocean-400 rounded-full flex items-center justify-center">
                <Leaf className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Serene</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('meditate')}
                className="nav-transition text-gray-600 hover:text-sage-600 font-medium"
                data-testid="nav-meditate"
              >
                Meditate
              </button>
              <button 
                onClick={() => scrollToSection('sounds')}
                className="nav-transition text-gray-600 hover:text-sage-600 font-medium"
                data-testid="nav-sounds"
              >
                Sounds
              </button>
              <button 
                onClick={() => scrollToSection('progress')}
                className="nav-transition text-gray-600 hover:text-sage-600 font-medium"
                data-testid="nav-progress"
              >
                Progress
              </button>
              <button 
                onClick={() => scrollToSection('settings')}
                className="nav-transition text-gray-600 hover:text-sage-600 font-medium"
                data-testid="nav-settings"
              >
                Settings
              </button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 glass-effect border-b border-white/20 py-4">
              <div className="flex flex-col space-y-4 px-4">
                <button 
                  onClick={() => scrollToSection('meditate')}
                  className="text-left text-gray-600 hover:text-sage-600 font-medium"
                  data-testid="nav-mobile-meditate"
                >
                  Meditate
                </button>
                <button 
                  onClick={() => scrollToSection('sounds')}
                  className="text-left text-gray-600 hover:text-sage-600 font-medium"
                  data-testid="nav-mobile-sounds"
                >
                  Sounds
                </button>
                <button 
                  onClick={() => scrollToSection('progress')}
                  className="text-left text-gray-600 hover:text-sage-600 font-medium"
                  data-testid="nav-mobile-progress"
                >
                  Progress
                </button>
                <button 
                  onClick={() => scrollToSection('settings')}
                  className="text-left text-gray-600 hover:text-sage-600 font-medium"
                  data-testid="nav-mobile-settings"
                >
                  Settings
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="pt-16">
        {/* Hero Section with Breathing Animation */}
        <section id="meditate" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1380" 
              alt="Peaceful mountain lake at sunrise" 
              className="w-full h-full object-cover opacity-30" 
            />
          </div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="mb-12 flex justify-center">
              <BreathingAnimation />
            </div>
            
            <div className="glass-effect rounded-2xl p-8 mb-8 animate-fade-in">
              <h2 className="text-2xl font-light text-gray-800 mb-2">Find Your Inner Peace</h2>
              <p className="text-gray-600 mb-6">Choose your meditation length and begin your journey to mindfulness</p>
              
              <MeditationTimer />
            </div>
          </div>
        </section>

        {/* Ambient Sounds Section */}
        <section id="sounds" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-800 mb-4">Ambient Soundscapes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Create your perfect meditation atmosphere by mixing and matching peaceful sounds from nature</p>
            </div>
            
            <AmbientSounds />
          </div>
        </section>

        {/* Progress & Statistics Section */}
        <section id="progress" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sage-25 to-ocean-25">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-800 mb-4">Your Meditation Journey</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Track your progress and celebrate your commitment to mindfulness</p>
            </div>
            
            <ProgressStats />
          </div>
        </section>

        {/* Settings & Preferences */}
        <section id="settings" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-800 mb-4">Personalize Your Practice</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Adjust settings to create your perfect meditation environment</p>
            </div>
            
            <SettingsPanel />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-sage-50 to-ocean-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-ocean-400 rounded-full flex items-center justify-center">
              <Leaf className="text-white text-sm" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Serene</h3>
          </div>
          <p className="text-gray-600 mb-6">Find peace in the present moment</p>
          <div className="text-sm text-gray-500">
            <p>© 2024 Serene Meditation App. Designed for mindfulness and inner peace.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
