import { useState, useEffect } from 'react';
import { userService } from '@/services/user.service';

export default function UserModal({ user, onClose, onSuccess }: any) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'STAFF',
    });

    useEffect(() => {
        if (user) setForm(user);
    }, [user]);

    const handleSubmit = async () => {
        if (user) {
            await userService.update(user.id, form);
        } else {
            await userService.create(form);
        }
        onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-4 rounded-xl w-[90%]">
                <h3 className="font-semibold mb-3">{user ? 'Sửa' : 'Thêm'} nhân viên</h3>

                <input
                    className="border p-2 w-full mb-2"
                    placeholder="Tên"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    className="border p-2 w-full mb-2"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    className="border p-2 w-full mb-2"
                    placeholder="SĐT"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <select
                    className="border p-2 w-full mb-3"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="ADMIN">ADMIN</option>
                    <option value="STAFF">STAFF</option>
                </select>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Hủy</button>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleSubmit}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
