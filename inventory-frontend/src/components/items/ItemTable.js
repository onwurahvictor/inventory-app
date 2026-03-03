import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { format } from 'date-fns';
import StockBadge from '../common/StockBadge';
import ConfirmDialog from '../common/ConfirmDialog';

const ItemTable = ({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onDeleteItem,
  onSort,
  sortBy,
  sortOrder
}) => {
  const [itemToDelete, setItemToDelete] = React.useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => onSort(column)}
      className="flex items-center space-x-1 hover:text-gray-900"
    >
      <span>{children}</span>
      {sortBy === column && (
        <span className="text-gray-400">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell w-12">
                <input
                  type="checkbox"
                  checked={items.length > 0 && selectedItems.length === items.length}
                  onChange={onSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="table-header-cell">
                <SortButton column="name">Name</SortButton>
              </th>
              <th className="table-header-cell">
                <SortButton column="category">Category</SortButton>
              </th>
              <th className="table-header-cell">
                <SortButton column="quantity">Quantity</SortButton>
              </th>
              <th className="table-header-cell">
                <SortButton column="price">Price</SortButton>
              </th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">
                <SortButton column="updatedAt">Last Updated</SortButton>
              </th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => onSelectItem(item._id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="table-cell">
                  <div className="flex items-center">
                    {item.image && (
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.sku && (
                        <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <span className="badge badge-info">{item.category}</span>
                </td>
                <td className="table-cell">
                  <div className="font-medium">{item.quantity}</div>
                  {item.lowStockThreshold && (
                    <div className="text-xs text-gray-500">
                      Threshold: {item.lowStockThreshold}
                    </div>
                  )}
                </td>
                <td className="table-cell font-medium">
                  {formatCurrency(item.price)}
                </td>
                <td className="table-cell">
                  <StockBadge quantity={item.quantity} threshold={item.lowStockThreshold} />
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">
                    {format(new Date(item.updatedAt), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(item.updatedAt), 'HH:mm')}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/items/${item._id}`}
                      className="p-1 text-gray-500 hover:text-primary-600"
                      title="View"
                    >
                      <HiOutlineEye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/items/${item._id}/edit`}
                      className="p-1 text-gray-500 hover:text-primary-600"
                      title="Edit"
                    >
                      <HiOutlinePencil className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="p-1 text-gray-500 hover:text-danger-600"
                      title="Delete"
                    >
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          onDeleteItem(itemToDelete._id);
          setItemToDelete(null);
        }}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default ItemTable;