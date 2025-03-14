
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Trash2, Edit, Save, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const UserManagement = () => {
  const { users, addUser, deleteUser, updateUser, user: currentUser } = useAuth();
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', isAdmin: false });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: '', email: '', isAdmin: false });
  const [loading, setLoading] = useState(false);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addUser(newUser);
      setNewUser({ name: '', email: '', password: '', isAdmin: false });
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const startEditing = (user: any) => {
    setEditingUser(user.id);
    setEditValues({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  const saveEditing = async (id: string) => {
    try {
      await updateUser(id, editValues);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleSetAdmin = async (email: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('set-admin', {
        body: { email },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: data.message || "User is now an admin",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to set admin status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users List</TabsTrigger>
          <TabsTrigger value="add">Add User</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            
            <div className="overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {editingUser === user.id ? (
                          <Input 
                            value={editValues.name} 
                            onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                          />
                        ) : (
                          user.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingUser === user.id ? (
                          <Input 
                            value={editValues.email} 
                            onChange={(e) => setEditValues({...editValues, email: e.target.value})}
                          />
                        ) : (
                          user.email
                        )}
                      </TableCell>
                      <TableCell>
                        {editingUser === user.id ? (
                          <input 
                            type="checkbox" 
                            checked={editValues.isAdmin} 
                            onChange={(e) => setEditValues({...editValues, isAdmin: e.target.checked})}
                            className="w-4 h-4"
                          />
                        ) : (
                          user.isAdmin ? "Yes" : "No"
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editingUser === user.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveEditing(user.id)}
                            >
                              <Save size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEditing}
                            >
                              <XCircle size={16} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(user)}
                              disabled={user.id === currentUser.id}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.id === currentUser.id}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                            {!user.isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetAdmin(user.email)}
                                disabled={loading}
                              >
                                Make Admin
                              </Button>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="add">
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input 
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="is-admin"
                  checked={newUser.isAdmin}
                  onChange={(e) => setNewUser({...newUser, isAdmin: e.target.checked})}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="is-admin" className="text-sm font-medium">
                  Admin User
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-primary py-6"
                disabled={loading}
              >
                <UserPlus size={18} className="mr-2" />
                {loading ? 'Adding...' : 'Add User'}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default UserManagement;
