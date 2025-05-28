import { Input, Select, Button, Typography } from 'antd';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

export default function SearchAndFilters({
    searchTerm,
    setSearchTerm,
    onSearch,
    filters = [],
    onClearFilters,
    showClearButton = false,
    searchPlaceholder = "Search...",
    searchMaxWidth = "500px"
}) {
    return (
        <div className="flex items-center gap-4 justify-between">
            {/* Search Bar */}
            <div className="flex-1">
                <Search
                    placeholder={searchPlaceholder}
                    allowClear
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onSearch={onSearch}
                    onClear={() => onSearch('')}
                    style={{ maxWidth: searchMaxWidth }}
                />
            </div>

            {/* Filters */}
            <div className="flex gap-3 items-center flex-shrink-0">
                <Text type="secondary" className="text-sm">Filter:</Text>
                
                {filters.map((filter, index) => (
                    <Select
                        key={index}
                        placeholder={filter.placeholder}
                        allowClear={filter.allowClear}
                        size="middle"
                        style={{ width: filter.width }}
                        value={filter.value}
                        onChange={filter.onChange}
                        className="filter-select"
                    >
                        {filter.options.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                ))}

                {showClearButton && (
                    <Button 
                        onClick={onClearFilters}
                        size="middle"
                        type="link"
                        style={{ padding: 0, height: 'auto' }}
                    >
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}