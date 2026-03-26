import { useEffect, useState } from 'react';
import UserModal from './components/UserModal.tsx';
import { userService } from '../../services/user.service.ts';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        const res = await userService.getAll();
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Xóa user này?')) return;
        await userService.delete(id);
        fetchUsers();
    };

    const handleToggle = async (id: number) => {
        await userService.toggleStatus(id);
        fetchUsers();
    };

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold">Nhân viên</h2>

            {users.map((u) => (
                <div key={u.id} className="bg-white rounded-xl shadow p-3 flex justify-between items-center">
                    <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                        <p className="text-xs">{u.role}</p>
                    </div>

                    <div className="text-right space-y-1">
                        <p className={`text-sm ${u.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
                            {u.status}
                        </p>

                        <div className="flex gap-2 text-xs">
                            <button onClick={() => handleEdit(u)}>Edit</button>
                            <button onClick={() => handleDelete(u.id)}>Delete</button>
                            <button onClick={() => handleToggle(u.id)}>Toggle</button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Floating Button */}
            <button
                onClick={() => {
                    setEditingUser(null);
                    setOpen(true);
                }}
                className="fixed bottom-20 right-5 bg-blue-500 text-white w-12 h-12 rounded-full"
            >
                +
            </button>

            {open && <UserModal user={editingUser} onClose={() => setOpen(false)} onSuccess={fetchUsers} />}
        </div>
    );
}
