import React, { useEffect, useState } from 'react';
import TableComponent, { Column } from '../../../../components/TableComponent/TableComponent';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import { Member } from '../../../../model/Member';
import MemberDetail from '../MemberDetail/MemberDetail';

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: Column[] = [
    { key: 'stt', label: 'STT' },
    { key: 'fullName', label: 'Họ tên' },
    { key: 'employeeNumber', label: 'Mã nhân viên' },
    { key: 'phoneNumber', label: 'Số điện thoại' },
    { key: 'reigon', label: 'Vùng' },
    { key: 'role', label: 'Chức vụ' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Trạng thái hoạt động' },
    { key: 'actions', label: 'Hành động' },
  ];

  const handleAction = (item: Member, action: string) => {
    if (action === 'view') {
      setSelectedId(item.id);
      setIsModalOpen(true);
    }
  };

  const handleSaveUser = async (user: Member) => {
    console.log('Saving user:', user);
    try {
      const response = await fetch(
        `https://683f00af1cd60dca33ddec2a.mockapi.io/members/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) throw new Error('Failed to update member');

      const updatedMember: Member = await response.json();
      setMembers((prevMembers) =>
        prevMembers.map((member) => (member.id === user.id ? updatedMember : member))
      );
    } catch (error) {
      console.error('Error updating member:', error);
    } finally {
      setIsModalOpen(false);
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
        setLoading(true);
        const response = await fetch('https://683f00af1cd60dca33ddec2a.mockapi.io/members');
        if (!response.ok) throw new Error('Network response was not ok');

        const data: Member[] = await response.json();

        const mapped = data.map((item, index) => ({
          ...item,
          stt: (index + 1).toString(),
          role: convertRoleIdToName(item.role),
        }));

        const filteredMembers = mapped.filter((member) => {
          const matchesId = !selectedId || member.id === selectedId;
          const matchesQuery =
            !query ||
            member.fullName.toLowerCase().includes(query.toLowerCase()) ||
            member.email.toLowerCase().includes(query.toLowerCase()) ||
            member.employeeNumber.toLowerCase().includes(query.toLowerCase());
          return matchesId && matchesQuery;
        });

        setMembers(filteredMembers);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [selectedId, query]);

  return members.length === 0 && !loading ? (
    <EmptyData />
  ) : (
    <div>
      <TableComponent
        columns={columns}
        data={members}
        itemsPerPage={10}
        onAction={handleAction}
        isLoading={loading}
        onSaveUser={handleSaveUser}
      />
      <MemberDetail
        id={isModalOpen ? selectedId : undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        isCreate={false}
      />
    </div>
  );
};

export default Members;
