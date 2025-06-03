import React, { useState, useEffect } from 'react';
import './MemberDetail.scss';
import { Member } from '../../../../model/Member';

interface MemberDetailProps {
  user?: Member;
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Member) => void;
  isCreate?: boolean;
}

const MemberDetail: React.FC<MemberDetailProps> = ({
  user,
  id,
  isOpen,
  onClose,
  onSave,
  isCreate = false,
}) => {
  const [formData, setFormData] = useState<any>({
    id: '',
    fullName: '',
    employeeNumber: '',
    phoneNumber: '',
    reigon: '',
    role: 0,
    email: '',
    status: 0,
  });

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (id && !user && isOpen) {
        try {
          const response = await fetch(`https://683f00af1cd60dca33ddec2a.mockapi.io/members/${id}`);
          if (!response.ok) throw new Error('Failed to fetch member details');
          const memberData: Member = await response.json();
          setFormData(memberData);
        } catch (error) {
          console.error('Error fetching member:', error);
        }
      } else if (user && isOpen) {
        setFormData(user);
      } else if (isCreate && isOpen) {
        try {
          const response = await fetch(`https://683f00af1cd60dca33ddec2a.mockapi.io/members`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          });
          if (!response.ok) throw new Error('Failed to fetch member details');
          const memberData: Member = await response.json();
          setFormData(memberData);
        } catch (error) {
          console.error('Error fetching member:', error);
        }
        setFormData({
          id: '',
          fullName: '',
          employeeNumber: '',
          phoneNumber: '',
          reigon: '',
          role: '0',
          email: '',
          status: '0',
        });
      }
    };

    fetchMemberDetails();
  }, [user, id, isOpen, isCreate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      role: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>{isCreate ? 'Tạo mới nhân viên' : 'Chi tiết nhân viên'}</h2>
        <div className='modal-body'>
          <div className='form-group'>
            <label>ID</label>
            <input
              type='text'
              name='id'
              value={formData.id}
              onChange={handleChange}
              placeholder='Nhập ID'
              disabled={true}
            />
          </div>
          <div className='form-group'>
            <label>Họ và tên</label>
            <input
              type='text'
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              placeholder='Nhập họ và tên'
            />
          </div>
          <div className='form-group'>
            <label>Mã nhân viên</label>
            <input
              type='text'
              name='employeeNumber'
              value={formData.employeeNumber}
              onChange={handleChange}
              placeholder='Nhập mã nhân viên'
            />
          </div>
          <div className='form-group'>
            <label>Số điện thoại</label>
            <input
              type='text'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder='Nhập số điện thoại'
            />
          </div>
          <div className='form-group'>
            <label>Vùng</label>
            <input
              type='text'
              name='reigon'
              value={formData.reigon}
              onChange={handleChange}
              placeholder='Nhập vùng'
            />
          </div>
          <div className='form-group'>
            <label>Chức vụ</label>
            <select name='role' value={formData.role} onChange={handleRoleChange}>
              <option value={0}>Nhân viên</option>
              <option value={1}>Giám sát</option>
              <option value={2}>Quản lý</option>
            </select>
          </div>
          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Nhập email'
            />
          </div>
          <div className='form-group'>
            <label>Trạng thái</label>
            <select name='status' value={formData.status} onChange={handleStatusChange}>
              <option value={0}>Chưa kích hoạt</option>
              <option value={1}>Đang hoạt động</option>
              <option value={2}>Đã khóa tài khoản</option>
            </select>
          </div>
        </div>
        <div className='modal-footer'>
          <button className='btn-cancel' onClick={onClose}>
            Hủy
          </button>
          <button className='btn-save' onClick={handleSave}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
