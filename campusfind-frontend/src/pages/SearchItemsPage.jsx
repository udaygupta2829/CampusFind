import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { itemService } from '../services/itemService';
import ItemCard from '../components/ItemCard';
import ClaimModal from '../components/ClaimModal';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Package,
  Layers,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';

const SearchItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [colour, setColour] = useState(searchParams.get('colour') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [fromDate, setFromDate] = useState(searchParams.get('fromDate') || '');
  const [toDate, setToDate] = useState(searchParams.get('toDate') || '');

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);

  const categories = [
    'Electronics',
    'ID Cards / Documents',
    'Bags & Backpacks',
    'Keys',
    'Books & Stationery',
    'Clothing & Accessories',
    'Sports Equipment',
    'Other Belongings'
  ];

  const fetchItems = async (page = 0) => {
    setLoading(true);
    try {
      const filters = {
        page,
        size: 12,
        keyword: keyword || undefined,
        type: type || undefined,
        category: category || undefined,
        colour: colour || undefined,
        location: location || undefined,
        status: status || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      };

      const res = await itemService.searchReports(filters);
      if (res.success && res.data) {
        setItems(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
        setCurrentPage(res.data.number || 0);
      }
    } catch (err) {
      console.error('Failed to search items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(0);
  }, [type, category, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems(0);
  };

  const handleReset = () => {
    setKeyword('');
    setType('');
    setCategory('');
    setColour('');
    setLocation('');
    setStatus('');
    setFromDate('');
    setToDate('');
    setSearchParams({});
    setTimeout(() => fetchItems(0), 10);
  };

  return (
    <div className="container" style={{ marginTop: '2.5rem', marginBottom: '3.5rem' }}>
      {/* Title & Type Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Campus Item Registry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            {totalElements} total lost and found items matching your criteria
          </p>
        </div>

        {/* Type Filter Buttons */}
        <div style={{ display: 'flex', backgroundColor: '#E2E8F0', padding: '4px', borderRadius: 'var(--radius-md)', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setType('')}
            className={`btn btn-sm ${type === '' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px' }}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => setType('LOST')}
            className={`btn btn-sm ${type === 'LOST' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px' }}
          >
            🔍 Lost Only
          </button>
          <button
            type="button"
            onClick={() => setType('FOUND')}
            className={`btn btn-sm ${type === 'FOUND' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px' }}
          >
            📦 Found Only
          </button>
        </div>
      </div>

      {/* Filter Bar Card */}
      <div className="search-filter-bar">
        <form onSubmit={handleSearchSubmit}>
          <div className="grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
            {/* Keyword Search */}
            <div style={{ position: 'relative' }}>
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search keywords, title, desc..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Location Input */}
            <div>
              <input
                type="text"
                className="form-control"
                placeholder="Filter by campus location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-4" style={{ gap: '1rem', alignItems: 'center' }}>
            {/* Colour Input */}
            <div>
              <input
                type="text"
                className="form-control"
                placeholder="Colour (e.g. Blue, Black)"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
              />
            </div>

            {/* Status Select */}
            <div>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="POSSIBLE_MATCH">Possible Match</option>
                <option value="CLAIM_REQUESTED">Claim Requested</option>
                <option value="CLAIMED">Claimed</option>
                <option value="APPROVED">Approved</option>
                <option value="RETURNED">Returned</option>
              </select>
            </div>

            {/* From Date */}
            <div>
              <input
                type="date"
                className="form-control"
                title="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-gold btn-sm" style={{ flex: 1 }}>
                <Search size={15} /> Apply
              </button>
              <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm" title="Reset Filters">
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Item Results Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={32} />
          </div>
          <h3>No Items Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: '1.25rem' }}>
            Try adjusting your search filters or clear keywords to see all campus listings.
          </p>
          <button onClick={handleReset} className="btn btn-primary btn-sm">
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid-3">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClaimClick={(it) => setSelectedClaimItem(it)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
              <button
                disabled={currentPage === 0}
                onClick={() => fetchItems(currentPage - 1)}
                className="btn btn-secondary btn-sm"
              >
                &larr; Previous
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => fetchItems(currentPage + 1)}
                className="btn btn-secondary btn-sm"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}

      {/* Claim Modal */}
      <ClaimModal
        item={selectedClaimItem}
        isOpen={!!selectedClaimItem}
        onClose={() => setSelectedClaimItem(null)}
        onSuccess={() => {
          fetchItems(currentPage);
          alert('Claim submitted successfully! Staff will review your private proof.');
        }}
      />
    </div>
  );
};

export default SearchItemsPage;
