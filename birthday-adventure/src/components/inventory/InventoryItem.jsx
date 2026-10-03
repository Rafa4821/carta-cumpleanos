export default function InventoryItem({ icon, label, collected }) {
  return (
    <div
      role="listitem"
      aria-label={`${label}: ${collected ? 'conseguido' : 'pendiente'}`}
      className="tw:text-center tw:w-14"
      style={{ opacity: collected ? 1 : 0.3 }}
    >
      <div
        className={`tw:text-2xl tw:leading-none ${collected ? 'inventory-pulse' : ''}`}
      >
        {icon}
      </div>
      <span className="tw:text-[0.6rem] tw:block tw:mt-1">{label}</span>
    </div>
  );
}
