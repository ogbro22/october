import React, { useState } from 'react';
import { Search, Play, Heart, CheckCircle, Clock, Flame as FireIcon, Plus, Filter, Tag } from 'lucide-react';
import { CATEGORIES } from '../data/videos';

export default function VideoLibrary({
  videos,
  favorites,
  watchHistory,
  onPlayVideo,
  onToggleFavorite,
  onOpenAddVideo,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const watchedVideoIds = new Set(watchHistory.map((item) => item.videoId));

  const filteredVideos = videos.filter((video) => {
    const matchesCategory =
      selectedCategory === 'All' || video.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.tags && video.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesFavorite = !onlyFavorites || favorites.includes(video.id);

    return matchesCategory && matchesSearch && matchesFavorite;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search exercises, categories, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                onlyFavorites
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Favorites Only</span>
            </button>

            <button
              onClick={onOpenAddVideo}
              className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-orange-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Custom Video</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-500 mr-1 shrink-0" />
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 border-transparent shadow-md shadow-orange-500/20 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Cards Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No exercise videos found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or filter options to discover videos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isFav = favorites.includes(video.id);
            const isWatched = watchedVideoIds.has(video.id);

            return (
              <div
                key={video.id}
                className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-orange-500/40 transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />

                  {/* Play Button Overlay */}
                  <div
                    onClick={() => onPlayVideo(video)}
                    className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-slate-950 ml-1" />
                    </div>
                  </div>

                  {/* Category & Custom Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="bg-slate-950/80 backdrop-blur-md text-orange-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-orange-500/30">
                      {video.category}
                    </span>
                    {video.isCustom && (
                      <span className="bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(video.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-rose-400 transition-colors border border-slate-800"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`}
                    />
                  </button>

                  {/* Watched Banner Badge */}
                  {isWatched && (
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-emerald-500/90 backdrop-blur-md text-slate-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                      {video.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Specs & Play Action */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{video.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1 text-rose-400">
                        <FireIcon className="w-3.5 h-3.5" />
                        <span>{video.calories} kcal</span>
                      </div>
                      <span className="text-slate-500 px-2 py-0.5 rounded bg-slate-800 text-[10px]">
                        {video.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => onPlayVideo(video)}
                      className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-slate-200 font-bold text-xs py-2.5 rounded-xl transition-all duration-200"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Workout Video</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
