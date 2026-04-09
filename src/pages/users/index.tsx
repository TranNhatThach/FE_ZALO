import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserModal from '@/components/UserModal';
import { User } from '@/types/auth.types';
import { userService } from '@/services/user.service';

export default function Users() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // 1. Fetch data
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.getAll(),
    });

    // 2. Mutations
    const deleteMutation = useMutation({
        mutationFn: (id: string) => userService.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });

    const toggleMutation = useMutation({
        mutationFn: (id: string) => userService.toggleStatus(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa user này?')) return;
        deleteMutation.mutate(id);
    };

    const handleToggle = async (id: string) => {
        toggleMutation.mutate(id);
    };

    if (isLoading) return <div className="p-4 text-center">Đang tải data nhân viên...</div>;

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold">Nhân viên</h2>

            {users.map((u) => (
                <div key={u.id} className="bg-white rounded-xl shadow p-3 flex justify-between items-center">
                    <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                        <p className="text-xs">{u.roles.join(', ')}</p>
                    </div>

                    <div className="text-right space-y-1">
                        <p className={`text-sm ${u.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
                            {u.status}
                        </p>

                        <div className="flex gap-2 text-xs">
                            <button onClick={() => handleEdit(u)} className="text-blue-500 underline">Edit</button>
                            <button onClick={() => handleDelete(u.id)} className="text-red-500 underline">Delete</button>
                            <button onClick={() => handleToggle(u.id)} className="text-gray-500 underline">Toggle</button>
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
                className="fixed bottom-20 right-5 bg-blue-500 text-white w-12 h-12 rounded-full text-2xl flex items-center justify-center shadow-lg"
            >
                +
            </button>

            <UserModal 
                visible={open} 
                user={editingUser} 
                onClose={() => setOpen(false)} 
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ['users'] })} 
            />
        </div>
    );
}
