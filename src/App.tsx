import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sword, 
  Shield, 
  Gem, 
  Zap, 
  Wind, 
  RefreshCw, 
  Download, 
  Sparkles,
  Info,
  ChevronRight,
  Eye
} from "lucide-react";
import { RPG_SETS } from "./constants";
import { RPGSet, RPGItem } from "./types";
import { generateItemImage } from "./services/geminiService";

export default function App() {
  const [selectedSet, setSelectedSet] = useState<RPGSet>(RPG_SETS[0]);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  const handleGenerate = async (item: RPGItem) => {
    if (loadingItems[item.id]) return;

    setLoadingItems((prev) => ({ ...prev, [item.id]: true }));
    setError(null);

    try {
      const imageUrl = await generateItemImage(item.prompt);
      setGeneratedImages((prev) => ({ ...prev, [item.id]: imageUrl }));
    } catch (err) {
      console.error(err);
      setError(`Failed to generate ${item.name}. Please try again.`);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-white/20">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-900/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="fantasy-title text-xl font-bold tracking-wider">RPG Item Forge</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Legendary Artifact Generator</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
            {RPG_SETS.map((set) => (
              <button
                key={set.id}
                onClick={() => setSelectedSet(set)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedSet.id === set.id
                    ? "bg-white text-black shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {set.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
              <Info className="w-3.5 h-3.5" />
              <span>Powered by Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Set Info Banner */}
        <motion.div 
          key={selectedSet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
        >
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60">
                Active Set
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
            <h2 className="fantasy-title text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
              {selectedSet.name}
            </h2>
            <p className="text-lg text-white/60 max-w-2xl leading-relaxed italic">
              "{selectedSet.theme}"
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {selectedSet.id === "twilight-order" && <Shield size={80} />}
              {selectedSet.id === "arcane-sage" && <Zap size={80} />}
              {selectedSet.id === "shadow-hunter" && <Wind size={80} />}
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Gem className="w-3 h-3" /> Set Bonus
            </h3>
            <div className="text-xl font-mono text-white/90">
              {selectedSet.bonus.split(', ').map((bonus, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <ChevronRight className="w-4 h-4 text-white/20" />
                  {bonus}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3"
          >
            <Info className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {selectedSet.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col h-full bg-gradient-to-b from-white/[0.02] to-transparent">
                {/* Image Area */}
                <div className="aspect-square relative bg-black/40 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {generatedImages[item.id] ? (
                      <motion.img
                        key="image"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={generatedImages[item.id]}
                        alt={item.name}
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={() => setPreviewImage({ url: generatedImages[item.id], name: item.name })}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                          <Sparkles className="w-8 h-8 text-white/20" />
                        </div>
                        <p className="text-xs text-white/30 font-medium uppercase tracking-widest">Not Forged Yet</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Loading Overlay */}
                  {loadingItems[item.id] && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                      <RefreshCw className="w-10 h-10 text-white animate-spin mb-4" />
                      <p className="text-sm font-medium text-white/80 animate-pulse">Forging Artifact...</p>
                      <p className="text-[10px] text-white/40 mt-2 uppercase tracking-tighter">Consulting the Ancients</p>
                    </div>
                  )}

                  {/* Hover Actions */}
                  {generatedImages[item.id] && !loadingItems[item.id] && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => setPreviewImage({ url: generatedImages[item.id], name: item.name })}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition-colors"
                        title="View Large"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => downloadImage(generatedImages[item.id], item.name)}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1 block">
                      {item.type}
                    </span>
                    <h4 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
                      {item.name}
                    </h4>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleGenerate(item)}
                      disabled={loadingItems[item.id]}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                        generatedImages[item.id]
                          ? "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10"
                          : "bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5"
                      }`}
                    >
                      {loadingItems[item.id] ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : generatedImages[item.id] ? (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Reforge
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Forge Item
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white/40" />
            </div>
            <p className="text-sm text-white/40">
              © 2026 RPG Item Forge. All artifacts generated via AI.
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">API Access</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Community</a>
          </div>
        </div>
      </footer>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-xl"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full aspect-square bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={previewImage.url} 
                alt={previewImage.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-between">
                <div>
                  <h3 className="fantasy-title text-3xl font-bold mb-2">{previewImage.name}</h3>
                  <p className="text-white/40 text-sm uppercase tracking-widest font-medium">Legendary Artifact • Level 99</p>
                </div>
                <button 
                  onClick={() => downloadImage(previewImage.url, previewImage.name)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-white/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Asset
                </button>
              </div>
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-black/40 hover:bg-white/10 border border-white/10 text-white transition-colors"
              >
                <RefreshCw className="w-6 h-6 rotate-45" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
