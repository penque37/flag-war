import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export async function loadState() {
  try {
    const { data, error } = await supabase
      .from('game_state')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.error('Error loading state:', error);
      return defaultState();
    }

    return {
      currentFlag:    { code: data.current_flag_code, name: data.current_flag_name },
      votes:          data.votes          || {},
      paidPerCountry: data.paid_per_country || {},
      totalRaised:    data.total_raised   || 0,
      totalSwaps:     data.total_swaps    || 0,
    };
  } catch (err) {
    console.error('Failed to load state:', err);
    return defaultState();
  }
}

export async function saveState({ currentFlag, votes, paidPerCountry, totalRaised, totalSwaps }) {
  try {
    const { error } = await supabase
      .from('game_state')
      .update({
        current_flag_code:  currentFlag.code,
        current_flag_name:  currentFlag.name,
        votes:              votes,
        paid_per_country:   paidPerCountry,
        total_raised:       totalRaised,
        total_swaps:        totalSwaps,
        updated_at:         new Date().toISOString(),
      })
      .eq('id', 1);

    if (error) console.error('Error saving state:', error);
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

export function subscribeToState(callback) {
  return supabase
    .channel('game_state_changes')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'game_state' },
      (payload) => {
        const data = payload.new;
        callback({
          currentFlag:    { code: data.current_flag_code, name: data.current_flag_name },
          votes:          data.votes          || {},
          paidPerCountry: data.paid_per_country || {},
          totalRaised:    data.total_raised   || 0,
          totalSwaps:     data.total_swaps    || 0,
        });
      }
    )
    .subscribe();
}

function defaultState() {
  return {
    currentFlag:    { code: 'US', name: 'United States' },
    votes:          {},
    paidPerCountry: {},
    totalRaised:    0,
    totalSwaps:     0,
  };
}