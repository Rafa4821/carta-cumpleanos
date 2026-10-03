export function progressReducer(state, action) {
  switch (action.type) {
    case 'START_ADVENTURE':
      return {
        ...state,
        adventure: {
          ...state.adventure,
          started: true,
          startedAt: state.adventure.startedAt ?? Date.now(),
        },
      };

    case 'START_WORLD':
      return {
        ...state,
        worlds: {
          ...state.worlds,
          [action.worldId]: {
            ...state.worlds[action.worldId],
            status: 'in_progress',
          },
        },
      };

    case 'ADVANCE_STAGE':
      return {
        ...state,
        worlds: {
          ...state.worlds,
          [action.worldId]: {
            ...state.worlds[action.worldId],
            stage: (state.worlds[action.worldId]?.stage ?? 0) + 1,
          },
        },
      };

    case 'INCREMENT_ATTEMPTS':
      return {
        ...state,
        worlds: {
          ...state.worlds,
          [action.worldId]: {
            ...state.worlds[action.worldId],
            attempts: (state.worlds[action.worldId]?.attempts ?? 0) + 1,
          },
        },
      };

    case 'SET_WORLD_DATA':
      return {
        ...state,
        worlds: {
          ...state.worlds,
          [action.worldId]: {
            ...state.worlds[action.worldId],
            ...action.payload,
          },
        },
      };

    case 'COMPLETE_WORLD': {
      const nextInventory = state.inventory.includes(action.itemId)
        ? state.inventory
        : [...state.inventory, action.itemId];

      return {
        ...state,
        worlds: {
          ...state.worlds,
          [action.worldId]: {
            ...state.worlds[action.worldId],
            status: 'completed',
            completedAt: Date.now(),
          },
        },
        inventory: nextInventory,
      };
    }

    case 'VERIFY_PHYSICAL_TOKEN':
      return {
        ...state,
        physicalQuest: {
          unlocked: true,
          tokenVerified: true,
          verifiedAt: Date.now(),
        },
      };

    case 'COMPLETE_PHOTO_PUZZLE':
      return {
        ...state,
        photoPuzzle: {
          ...state.photoPuzzle,
          completed: true,
        },
        safe: {
          ...state.safe,
          unlocked: true,
        },
      };

    case 'UPDATE_PUZZLE_STATE':
      return {
        ...state,
        photoPuzzle: {
          ...state.photoPuzzle,
          ...action.payload,
        },
      };

    case 'UNLOCK_LETTER':
      return {
        ...state,
        safe: {
          ...state.safe,
          completed: true,
        },
        letter: {
          ...state.letter,
          unlocked: true,
        },
      };

    case 'OPEN_LETTER':
      return {
        ...state,
        letter: {
          ...state.letter,
          opened: true,
        },
      };

    case 'FINISH_LETTER':
      return {
        ...state,
        letter: {
          ...state.letter,
          finished: true,
        },
        adventure: {
          ...state.adventure,
          completedAt: state.adventure.completedAt ?? Date.now(),
        },
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'RESET':
      return action.initialState;

    default:
      return state;
  }
}
