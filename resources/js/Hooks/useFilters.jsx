import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function useFilters(initialFilters, routeName) {
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
    const [statusFilter, setStatusFilter] = useState(initialFilters?.status || '');
    const [dateRange, setDateRange] = useState(initialFilters?.date_range || '');
    const [sortBy, setSortBy] = useState(
        initialFilters?.sort || (routeName === 'dashboard' ? 'published_at' : 'created_at')
    );
    const [sortOrder, setSortOrder] = useState(initialFilters?.order || 'desc');

    const applyFilters = (newFilters = {}) => {
        const params = {
            search: searchTerm,
            ...(routeName === 'dashboard' ? { date_range: dateRange } : { status: statusFilter }),
            sort: sortBy,
            order: sortOrder,
            ...newFilters
        };

        // Remove empty values
        Object.keys(params).forEach(key => {
            if (!params[key] || params[key] === '') {
                delete params[key];
            }
        });

        router.get(route(routeName), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        applyFilters({ search: value });
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        applyFilters({ status: value });
    };

    const handleDateRangeChange = (value) => {
        setDateRange(value);
        applyFilters({ date_range: value });
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        applyFilters({ sort: value });
    };

    const handleOrderChange = (value) => {
        setSortOrder(value);
        applyFilters({ order: value });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setDateRange('');
        setSortBy(routeName === 'dashboard' ? 'published_at' : 'created_at');
        setSortOrder('desc');
        
        router.get(route(routeName), {}, {
            preserveState: false,
            replace: true,
        });
    };

    // Sync state with URL parameters
    useEffect(() => {
        setSearchTerm(initialFilters?.search || '');
        setStatusFilter(initialFilters?.status || '');
        setDateRange(initialFilters?.date_range || '');
        setSortBy(initialFilters?.sort || (routeName === 'dashboard' ? 'published_at' : 'created_at'));
        setSortOrder(initialFilters?.order || 'desc');
    }, [initialFilters, routeName]);

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        dateRange,
        sortBy,
        sortOrder,
        handleSearch,
        handleStatusChange,
        handleDateRangeChange,
        handleSortChange,
        handleOrderChange,
        clearFilters
    };
}