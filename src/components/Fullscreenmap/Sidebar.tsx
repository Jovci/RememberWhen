import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  Typography,
  Divider,
  IconButton,
  Grid,
  Box,
  Button,
  TextField,
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PlaceIcon from '@mui/icons-material/Place';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import getSupabaseClient from '@/utils/supabase/client';
import AddFriend from './AddFriend';

interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  media_urls: string[];
  user_id: string;
  is_private: boolean;
  name?: string; // Add name if needed
}

interface SidebarProps {
  markers: MarkerData[];
  selectedMarkerId: string | null;
  onDelete: (id: string) => Promise<void>;
  onTogglePlacement: () => void;
  placementMode: boolean;
  onUploadPhoto?: () => void; // Make optional if not always used
  onUpdateMarkerName: (id: string, newName: string) => Promise<void>;
}


const Sidebar: React.FC<SidebarProps> = ({
  markers,
  selectedMarkerId,
  onDelete,
  onTogglePlacement,
  placementMode, // Use prop for placement mode
  onUpdateMarkerName,
}) => {

  const supabase = getSupabaseClient();
  const [editingMarkerId, setEditingMarkerId] = useState<string | null>(null);
  const [tempName, setTempName] = useState<string>(''); // Temporary name while editing

  const handleNameEditStart = (id: string, currentName?: string) => {
    setEditingMarkerId(id);
    setTempName(currentName || `Lat: ${markers.find((m) => m.id === id)?.latitude.toFixed(2)}, Lng: ${markers.find((m) => m.id === id)?.longitude.toFixed(2)}`);
  };

  const handleNameEditSave = async (id: string) => {
    await onUpdateMarkerName(id, tempName);
    setEditingMarkerId(null); // End editing mode
  };

  const handleFileUpload = async (markerId: string, file: File | null) => {
    if (!file) return;

    const filePath = `media/${markerId}/${file.name}`;
    const { data, error } = await supabase.storage
      .from('marker-media')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('marker-media')
      .getPublicUrl(filePath);

    console.log('Media uploaded, public URL:', publicUrl);

    const marker = markers.find((m) => m.id === markerId);
    if (!marker) {
      console.error('Marker not found');
      return;
    }

    const { error: dbError } = await supabase
      .from('markers')
      .update({
        media_urls: [...marker.media_urls, publicUrl],
      })
      .eq('id', markerId);

    if (dbError) {
      console.error('Error updating marker with media URL:', dbError.message);
    } else {
      console.log('Marker updated with media URL');
    }
  };

  return (
    <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: 330,
            marginTop: '30px', // Add margin at the top
            height: 'calc(100vh - 64px)', // Adjust height to exclude header
            flexShrink: 0,
            overflowY: 'auto',
            '& .MuiDrawer-paper': {
              width: 330,
              height: 'calc(96.5vh - 64px)',
              boxSizing: 'border-box',
              backgroundColor: '#181818',
              color: '#fff',
              marginTop: '48px', // Same margin for the drawer paper
            },
          }}
    >
      <Box p={2} textAlign="center">
        <Typography variant="h6" color="white">
          Memory Markers
        </Typography>
        <Typography variant="body2" color="gray">
          View and manage your markers
        </Typography>
      <AddFriend/>
      </Box>
      <Divider sx={{ borderColor: '#333' }} />
      <Box p={2} textAlign="center">

        <Button
          variant="contained"
          onClick={onTogglePlacement}
          sx={{
            backgroundColor: placementMode ? '#4caf50' : '#f44336',
            color: '#fff',
            textTransform: 'none',
          }}
          startIcon={placementMode ? <PlaceIcon /> : <EditLocationAltIcon />}
        >
          {placementMode ? 'Placement Mode' : 'Clicking Mode'}
        </Button>
      </Box>
      <Divider sx={{ borderColor: '#333' }} />
      <List>
        {markers.map((marker) => (
          <ListItem
            key={marker.id}
            sx={{
              flexDirection: 'column',
              alignItems: 'start',
              gap: 2,
              backgroundColor: selectedMarkerId === marker.id ? '#333' : 'transparent',
              '&:hover': { backgroundColor: '#222' },
              borderLeft: selectedMarkerId === marker.id ? '4px solid #4caf50' : 'none',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <AddLocationAltIcon sx={{ color: '#4caf50' }} />
              {editingMarkerId === marker.id ? (
                <>
                  <TextField
                    value={marker.name || ''}
                    onChange={(e) => onUpdateMarkerName(marker.id, e.target.value)}
                    onBlur={(e) => onUpdateMarkerName(marker.id, e.target.value)} // Save to DB on blur
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleNameEditSave(marker.id)}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Typography
                  color="white"
                  fontSize={14}
                  sx={{ flexGrow: 1, cursor: 'pointer' }}
                  onClick={() => handleNameEditStart(marker.id, marker.name)}
                >
                  {marker.name || `Lat: ${marker.latitude.toFixed(2)}, Lng: ${marker.longitude.toFixed(2)}`}
                </Typography>
              )}
              <IconButton
                onClick={() => onDelete(marker.id)}
                sx={{ color: '#f44336' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid container spacing={1}>
              {marker.media_urls?.map((url, index) => (
                <Grid item xs={6} key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Box
                      component="img"
                      src={url}
                      alt="Media"
                      sx={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid #333',
                      }}
                    />
                  </a>
                </Grid>
              ))}
            </Grid>
            <Box>
              <input
                type="file"
                accept="image/*,video/*"
                id={`upload-media-${marker.id}`}
                style={{ display: 'none' }}
                onChange={(e) =>
                  handleFileUpload(marker.id, e.target.files?.[0] || null)
                }
              />
              <label htmlFor={`upload-media-${marker.id}`}>
                <IconButton component="span" sx={{ color: '#4caf50' }}>
                  <AddPhotoAlternateIcon />
                </IconButton>
              </label>
            </Box>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};


export default Sidebar;

