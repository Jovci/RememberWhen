'use client';

import React, { useState } from 'react';
import createClient from '@/utils/supabase/client';
import { Box, Button, TextField, Typography } from '@mui/material';

const AddFriend = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleAddFriend = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { data: currentUser } = await supabase.auth.getUser();

      if (!currentUser) {
        setMessage('You must be logged in to add friends.');
        setLoading(false);
        return;
      }

      const { data: user, error: userError } = await supabase
      .from('users') // Use the custom users table
      .select('id')
      .eq('email', email)
      .single();
    
      if (userError || !user) {
        setMessage('User with this email does not exist.');
        setLoading(false);
        return;
      }
    
    

      const friendId = user.id;

      // Insert friendship into "friends" table (mutual relationship)
      const { error: friendError } = await supabase.from('friends').insert([
        { user_id: currentUser?.user?.id, friend_id: friendId },
        { user_id: friendId, friend_id: currentUser?.user?.id }, // Add reverse relationship
      ]);

      if (friendError) {
        setMessage('Error adding friend. Please try again later.');
        setLoading(false);
        return;
      }

      setMessage('Friend added successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Add a Friend
      </Typography>
      <TextField
        label="Friend's Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddFriend}
        disabled={loading || !email}
      >
        {loading ? 'Adding...' : 'Add Friend'}
      </Button>
      {message && (
        <Typography mt={2} color={message.includes('success') ? 'green' : 'red'}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default AddFriend;
