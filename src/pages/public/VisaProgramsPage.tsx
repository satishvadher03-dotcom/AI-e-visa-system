import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { VisaProgram, TravelDirection } from '../../types/index.ts';
import { Search, Globe, ChevronRight, Filter, ExternalLink, PlaneTakeoff, PlaneLanding } from 'lucide-react';

export const VisaProgramsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [programs, setPrograms] = useState<VisaProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const initialDirection = (searchParams.get('direction') as TravelDirection) || 'india_to_world';
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [direction, setDirection] = useState<TravelDirection>(initialDirection);
  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (direction) query.set('direction', direction);
        if (category && category !== 'all') query.set('category', category);
        if (search.trim()) query.set('search', search.trim());

        const res = await fetch(`/api/v1/visa-programs?${query.toString()}`);
        const data = await res.json();
        if (data.programs) {
          setPrograms(data.programs);
        }
      } catch (err) {
        console.error('Failed to load visa programs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, [direction, category, search]);

  const handleDirectionChange = (newDir: TravelDirection) => {
    setDirection(newDir);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('direction', newDir);
    setSearchParams(nextParams);
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'tourist', label: 'Tourist & Visitor' },
    { id: 'business', label: 'Business & Commercial' },
    { id: 'student', label: 'Student & Academic' },
    { id: 'medical', label: 'Medical Treatment' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          International Visa Programs Directory
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Explore verified visa pathways, government processing timelines, statutory fees, and documentation checklists grounded in official consular publications.
        </p>

        {/* Direction Tabs */}
        <div className="mt-6 inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => handleDirectionChange('india_to_world')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              direction === 'india_to_world' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlaneTakeoff className="w-4 h-4 text-blue-600" />
            <span>Outbound: India to World</span>
          </button>
          <button
            onClick={() => handleDirectionChange('world_to_india')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              direction === 'world_to_india' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlaneLanding className="w-4 h-4 text-blue-600" />
            <span>Inbound: World to India</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by country, keyword, or visa code..."
            className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                category === cat.id 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count and Unboxed Metadata */}
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <span>Showing {programs.length} programs</span>
        <span aria-hidden="true">·</span>
        <span>Direction: {direction === 'india_to_world' ? 'India to Worldwide' : 'Worldwide to India'}</span>
        <span aria-hidden="true">·</span>
        <span>Last verified: February 2026</span>
      </div>

      {/* Program Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading verified visa directory...
        </div>
      ) : programs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto">
          <Globe className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No Matching Visa Programs Found</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search terms or switching travel directions.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
            }}
            className="px-4 py-2 text-xs font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{prog.country}</span>
                  <span className="font-mono">{prog.countryCode}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {prog.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Validity:</span>
                    <span className="font-medium">{prog.validity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stay Duration:</span>
                    <span className="font-medium">{prog.stayDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Processing Time:</span>
                    <span className="font-medium">{prog.processingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Official Fee:</span>
                    <span className="font-medium text-slate-900 tabular-nums">{prog.approxGovFee}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={prog.officialSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 truncate max-w-[150px]"
                  title={prog.officialSourceName}
                >
                  <span className="truncate">{prog.officialSourceName}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>

                <Link
                  to={`/visa-programs/${prog.id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
