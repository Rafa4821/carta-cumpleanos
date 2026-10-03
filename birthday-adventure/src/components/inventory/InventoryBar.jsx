import { useProgress } from '../../context/ProgressContext';
import { INVENTORY_ITEMS } from '../../data/inventory';
import { WORLD_ORDER } from '../../data/gameConfig';
import InventoryItem from './InventoryItem';

export default function InventoryBar() {
  const { state } = useProgress();

  return (
    <div
      className="tw:flex tw:justify-center tw:gap-3 tw:py-3"
      role="list"
      aria-label="Inventario de objetos"
    >
      {WORLD_ORDER.map((worldId) => {
        const item = INVENTORY_ITEMS[worldId];
        const collected = state.inventory.includes(item.id);
        return (
          <InventoryItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            collected={collected}
          />
        );
      })}
    </div>
  );
}
