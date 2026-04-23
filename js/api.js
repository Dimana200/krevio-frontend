// api.js — всички връзки със Supabase и backend

import State from './state.js';

// ═══════════════════════════════
// ПРОФИЛ
// ═══════════════════════════════

export async function fetchProfile(userId) {
  try {
    const { data, error } = await State.sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('fetchProfile:', e.message);
    return null;
  }
}

export async function updateProfile(userId, updates) {
  try {
    const { error } = await State.sb
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('updateProfile:', e.message);
    return false;
  }
}

export async function insertProfile(profileData) {
  try {
    const { error } = await State.sb
      .from('profiles')
      .insert(profileData);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('insertProfile:', e.message);
    return false;
  }
}

// ═══════════════════════════════
// ВИДЕА
// ═══════════════════════════════

export async function fetchVideos(limit = 20) {
  try {
    const { data, error } = await State.sb
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('fetchVideos:', e.message);
    return [];
  }
}

export async function fetchMyVideos(userId, limit = 12) {
  try {
    const { data, error } = await State.sb
      .from('videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('fetchMyVideos:', e.message);
    return [];
  }
}

export async function fetchVideoCount(userId) {
  try {
    const { count, error } = await State.sb
      .from('videos')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);
    if (error) throw error;
    return count || 0;
  } catch (e) {
    console.error('fetchVideoCount:', e.message);
    return 0;
  }
}

export async function deleteVideo(videoId) {
  try {
    const { error } = await State.sb
      .from('videos')
      .delete()
      .eq('id', videoId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('deleteVideo:', e.message);
    return false;
  }
}

// ═══════════════════════════════
// ХАРЕСВАНИЯ
// ═══════════════════════════════

export async function fetchLikeCount(videoId) {
  try {
    const { count, error } = await State.sb
      .from('likes')
      .select('id', { count: 'exact' })
      .eq('video_id', videoId);
    if (error) throw error;
    return count || 0;
  } catch (e) {
    console.error('fetchLikeCount:', e.message);
    return 0;
  }
}

export async function fetchMyLike(videoId, userId) {
  try {
    const { data, error } = await State.sb
      .from('likes')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  } catch (e) {
    console.error('fetchMyLike:', e.message);
    return false;
  }
}

export async function addLike(videoId, userId) {
  try {
    const { error } = await State.sb
      .from('likes')
      .insert({ video_id: videoId, user_id: userId });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('addLike:', e.message);
    return false;
  }
}

export async function removeLike(videoId, userId) {
  try {
    const { error } = await State.sb
      .from('likes')
      .delete()
      .eq('video_id', videoId)
      .eq('user_id', userId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('removeLike:', e.message);
    return false;
  }
}

export async function fetchLikedVideos(userId) {
  try {
    const { data, error } = await State.sb
      .from('likes')
      .select('video_id')
      .eq('user_id', userId);
    if (error) throw error;
    const ids = (data || []).map(l => l.video_id);
    if (ids.length === 0) return [];
    const { data: videos } = await State.sb
      .from('videos')
      .select('*')
      .in('id', ids);
    return videos || [];
  } catch (e) {
    console.error('fetchLikedVideos:', e.message);
    return [];
  }
}

// ═══════════════════════════════
// ЗАПАЗЕНИ
// ═══════════════════════════════

export async function fetchSaveState(videoId, userId) {
  try {
    const { data, error } = await State.sb
      .from('saves')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  } catch (e) {
    console.error('fetchSaveState:', e.message);
    return false;
  }
}

export async function addSave(videoId, userId) {
  try {
    const { error } = await State.sb
      .from('saves')
      .insert({ video_id: videoId, user_id: userId });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('addSave:', e.message);
    return false;
  }
}

export async function removeSave(videoId, userId) {
  try {
    const { error } = await State.sb
      .from('saves')
      .delete()
      .eq('video_id', videoId)
      .eq('user_id', userId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('removeSave:', e.message);
    return false;
  }
}

export async function fetchSavedVideos(userId) {
  try {
    const { data, error } = await State.sb
      .from('saves')
      .select('video_id')
      .eq('user_id', userId);
    if (error) throw error;
    const ids = (data || []).map(s => s.video_id);
    if (ids.length === 0) return [];
    const { data: videos } = await State.sb
      .from('videos')
      .select('*')
      .in('id', ids);
    return videos || [];
  } catch (e) {
    console.error('fetchSavedVideos:', e.message);
    return [];
  }
}

// ═══════════════════════════════
// КОМЕНТАРИ
// ═══════════════════════════════

export async function fetchComments(videoId) {
  try {
    const { data, error } = await State.sb
      .from('comments')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: true })
      .limit(50);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('fetchComments:', e.message);
    return [];
  }
}

export async function fetchCommentCount(videoId) {
  try {
    const { count, error } = await State.sb
      .from('comments')
      .select('id', { count: 'exact' })
      .eq('video_id', videoId);
    if (error) throw error;
    return count || 0;
  } catch (e) {
    console.error('fetchCommentCount:', e.message);
    return 0;
  }
}

export async function addComment(videoId, userId, username, text) {
  try {
    const { error } = await State.sb
      .from('comments')
      .insert({ video_id: videoId, user_id: userId, username, text });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('addComment:', e.message);
    return false;
  }
}

// ═══════════════════════════════
// ТЪРСЕНЕ
// ═══════════════════════════════

export async function searchProfiles(query) {
  try {
    const { data, error } = await State.sb
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('searchProfiles:', e.message);
    return [];
  }
}

export async function searchVideos(query) {
  try {
    const { data, error } = await State.sb
      .from('videos')
      .select('*')
      .ilike('title', `%${query}%`)
      .limit(10);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('searchVideos:', e.message);
    return [];
  }
}

// ═══════════════════════════════
// AVATAR UPLOAD
// ═══════════════════════════════

export async function uploadAvatar(userId, file) {
  try {
    const ext = file.name.split('.').pop();
    const path = `avatars/${userId}.${ext}`;
    const { error: upErr } = await State.sb.storage
      .from('avatars')
      .upload(path, file, { upsert: true, cacheControl: '0' });
    if (upErr) throw upErr;
    const url = State.sb.storage
      .from('avatars')
      .getPublicUrl(path).data.publicUrl;
    const { error: updErr } = await State.sb
      .from('profiles')
      .update({ avatar_url: url })
      .eq('id', userId);
    if (updErr) throw updErr;
    return url + '?t=' + Date.now();
  } catch (e) {
    console.error('uploadAvatar:', e.message);
    return null;
  }
}

// ═══════════════════════════════
// PRESIGN (качване на видео)
// ═══════════════════════════════

export async function getPresignedUrl(token, fileData) {
  try {
    const res = await fetch(State.config.BACKEND + '/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(fileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Грешка');
    return data;
  } catch (e) {
    console.error('getPresignedUrl:', e.message);
    return null;
  }
}
