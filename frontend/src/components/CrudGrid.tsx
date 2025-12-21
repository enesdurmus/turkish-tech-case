import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowId,
} from "@mui/x-data-grid";
import { ReactElement, useState } from "react";

interface CrudGridProps<T extends { id: GridRowId }> {
  data: T[];
  columns: GridColDef[];
  rowCount: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onAdd: (newItem: Omit<T, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onUpdate: (updatedItem: T) => Promise<void>;
  onDelete: (id: GridRowId) => Promise<void>;
  formFields: (item: T) => ReactElement;
  getNewItem: () => T;
  entityName: string;
}

export default function CrudGrid<T extends { id: GridRowId }>({
  data,
  columns,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  onAdd,
  onUpdate,
  onDelete,
  formFields,
  getNewItem,
  entityName,
}: CrudGridProps<T>) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);

  const handleAddClick = () => {
    setCurrentItem(getNewItem());
    setIsFormOpen(true);
  };

  const handleEditClick = (id: GridRowId) => {
    const itemToEdit = data.find((row) => row.id === id);
    if (itemToEdit) {
      setCurrentItem(itemToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDeleteClick = (id: GridRowId) => {
    const itemToDelete = data.find((row) => row.id === id);
    if (itemToDelete) {
      setCurrentItem(itemToDelete);
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleFormSubmit = async () => {
    if (!currentItem) return;

    if (data.some(row => row.id === currentItem.id)) {
        await onUpdate(currentItem);
    } else {
        const { id, createdAt, updatedAt, ...newItem } = currentItem as any;
        await onAdd(newItem);
    }
    setIsFormOpen(false);
    setCurrentItem(null);
  };
  
  const handleDeleteConfirm = async () => {
    if (currentItem) {
      await onDelete(currentItem.id);
    }
    setIsDeleteConfirmOpen(false);
    setCurrentItem(null);
  };

  const actionColumn: GridColDef = {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 100,
    cellClassName: "actions",
    getActions: ({ id }) => [
      <GridActionsCellItem
        icon={<Edit />}
        label="Edit"
        onClick={() => handleEditClick(id)}
      />,
      <GridActionsCellItem
        icon={<Delete />}
        label="Delete"
        onClick={() => handleDeleteClick(id)}
      />,
    ],
  };

  return (
    <Box sx={{ height: "80vh", width: "100%" }}>
      <Button
        startIcon={<Add />}
        variant="contained"
        onClick={handleAddClick}
        sx={{ mb: 2 }}
      >
        Add {entityName}
      </Button>
      <DataGrid
        rows={data}
        columns={[...columns, actionColumn]}
        rowCount={rowCount}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={onPaginationModelChange}
        checkboxSelection
        disableRowSelectionOnClick
      />

      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <DialogTitle>{currentItem && currentItem.id ? `Edit ${entityName}` : `Add ${entityName}`}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }}>
            {currentItem && formFields(currentItem)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this {entityName}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
