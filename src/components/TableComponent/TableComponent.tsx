import React, { useState, useEffect } from 'react';
import './TableComponent.scss';
import eyeIcon from '../../assets/img/eye.png';
import MemberDetail from '../../pages/Dashboard/components/MemberDetail/MemberDetail';
import { Member } from '../../model/Member';

export interface Column {
  key: keyof Member | 'stt' | 'actions'; // Restrict key to Member properties or special keys
  label: string;
  sortable?: boolean;
}

interface TableProps {
  columns: Column[];
  data: Member[]; // Changed from DataItem[] to Member[]
  itemsPerPage?: number;
  onAction?: (item: Member, action: string) => void; // Changed from DataItem to Member
  isLoading: boolean;
  onSaveUser?: (user: Member) => void; // Changed from DataItem to Member
}

const statusMap: Record<string, string> = {
  '0': 'Chưa kích hoạt',
  '1': 'Đang hoạt động',
  '2': 'Đã khóa tài khoản',
};

const statusMapEn: Record<string, string> = {
  '1': 'active',
  '0': 'pending',
  '2': 'inactive',
};

const TableComponent: React.FC<TableProps> = ({
  columns,
  data,
  itemsPerPage = 10,
  onAction,
  isLoading,
  onSaveUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedUser, setSelectedUser] = useState<Member | null>(null); // Changed from DataItem to Member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Extract unique status and region values from data
  const statusOptions = Array.from(new Set(data.map((item) => item.status)));
  const regionOptions = Array.from(new Set(data.map((item) => item.reigon))); // Changed from vung to region

  // Apply search and filter
  const filteredData = data
    .filter((item) =>
      columns.some((column) => {
        if (column.key === 'actions' || column.key === 'stt') return false; // Skip special keys
        return item[column.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    )
    .filter((item) => (selectedStatus !== '' ? item.status.toString() === selectedStatus : true))
    .filter((item) => (selectedRegion !== '' ? item.reigon.toString() === selectedRegion : true));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (item: Member, action: string) => {
    if (action === 'view' && onAction) {
      setSelectedUser(item);
      setIsModalOpen(true);
    }
  };

  const handleSaveUser = (user: Member) => {
    if (onSaveUser) {
      onSaveUser(user);
    }
    setIsModalOpen(false);
    setIsCreateModalOpen(false);
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on filter/search change
  }, [searchTerm, selectedStatus, selectedRegion]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className='table-container'>
      <div className='table-header-wrapper'>
        <div className='table-header'>
          <div className='table-search'>
            <input
              type='text'
              placeholder='Tìm kiếm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='search-input'
            />
            <div className='action-buttons'>
              <button className='action-btn'>Tải nhân viên</button>
              <button className='action-btn export-btn'>Xuất danh sách tài khoản</button>
              <button className='action-btn create-btn' onClick={() => setIsCreateModalOpen(true)}>
                Tạo mới
              </button>
            </div>
          </div>
          <div className='table-filter'>
            <p className='title'>Bộ Lọc:</p>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className='filter-select'
            >
              <option value=''>Trạng thái</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusMap[status.toString()]}
                </option>
              ))}
            </select>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className='filter-select'
            >
              <option value=''>Vùng</option>
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <table className='custom-table'>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.key === 'status' ? (
                    <span className={`status ${statusMapEn[item.status.toString()]}`}>
                      • {statusMap[item.status.toString()] || item.status}
                    </span>
                  ) : column.key === 'role' ? (
                    <span>
                      {item.role === '0' ? 'Nhân viên' : item.role === '1' ? 'Giám sát' : 'Quản lý'}
                    </span>
                  ) : column.key === 'actions' ? (
                    <div className='action-buttons'>
                      <button
                        className='action-btn view-btn'
                        onClick={() => handleAction(item, 'view')}
                      >
                        <img src={eyeIcon} alt='eye' />
                      </button>
                    </div>
                  ) : column.key === 'stt' ? (
                    (currentPage - 1) * itemsPerPage + index + 1
                  ) : (
                    item[column.key] // Safe with keyof Member
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length === 0 && <div className='no-data'>Không có dữ liệu</div>}

      <div className='pagination'>
        <span>Hiển thị {filteredData.length} nhân viên</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
        {totalPages > 10 && <span>...</span>}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
      </div>

      {selectedUser && (
        <MemberDetail
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
      <MemberDetail
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveUser}
        isCreate={true}
      />
    </div>
  );
};

export default TableComponent;
