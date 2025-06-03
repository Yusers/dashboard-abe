import React, { useEffect, useState } from 'react';
import TableComponent from '../../../../components/TableComponent/TableComponent';
import EmptyData from '../../../../components/EmptyData/EmptyData';

// Raw data type from API
export type Member = {
  id: string;
  fullName: string;
  employeeNumber: string;
  phoneNumber: string;
  reigon: string;
  role: string;
  email: string;
  status: string;
};

const Members: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns = [
    { key: 'stt', label: 'STT' },
    { key: 'hoTen', label: 'Họ tên' },
    { key: 'maNhanVien', label: 'Mã nhân viên' },
    { key: 'soDienThoai', label: 'Số điện thoại' },
    { key: 'vung', label: 'Vùng' },
    { key: 'chucVu', label: 'Chức vụ' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Trạng thái hoạt động' },
    { key: 'actions', label: 'Hành động' },
  ];

  const handleAction = (item: any, action: string) => {
    if (action === 'view') {
      alert(`Viewing details for ${item.hoTen}`);
    }
  };

  const convertRoleIdToName = (roleId: string) => {
    switch (roleId) {
      case '1':
        return 'Nhân Viên';
      case '2':
        return 'Giám Sát';
      case '3':
        return 'Quản Lý';
      default:
        return 'Khác';
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('https://683f00af1cd60dca33ddec2a.mockapi.io/members');
        if (!response.ok) throw new Error('Network response was not ok');

        const data: Member[] = await response.json();

        const mapped = data.map((item, index) => ({
          stt: index + 1,
          hoTen: item.fullName,
          maNhanVien: item.employeeNumber,
          soDienThoai: item.phoneNumber,
          vung: item.reigon,
          chucVu: convertRoleIdToName(item.role.toString()),
          email: item.email,
          status: item.status,
          actions: '',
        }));

        setMembers(mapped);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return !members ? (
    <EmptyData />
  ) : (
    <TableComponent
      columns={columns}
      data={members}
      itemsPerPage={10}
      onAction={handleAction}
      isLoading={loading}
    />
  );
};

export default Members;
