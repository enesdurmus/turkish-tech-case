import {Add, Delete, Edit} from "@mui/icons-material";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridColDef, GridPaginationModel, GridRowId,} from "@mui/x-data-grid";
import {ReactElement, useState} from "react";
import {PAGE_SIZE_OPTIONS} from "../constants";

interface CrudGridProps<T extends { id: GridRowId }, TFormData> {
    data: T[];
    columns: GridColDef[];
    rowCount: number;
    loading: boolean;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    onAdd: (formData: TFormData) => Promise<void>;
    onUpdate: (id: GridRowId, formData: TFormData) => Promise<void>;
    onDelete: (id: GridRowId) => Promise<void>;
    formFields: (formData: TFormData, onChange: (data: TFormData) => void) => ReactElement;
    getNewFormData: () => TFormData;
    toFormData: (item: T) => TFormData;
    entityName: string;
}

export default function CrudGrid<T extends { id: GridRowId }, TFormData>(
    props: Readonly<CrudGridProps<T, TFormData>>
) {
    const {
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
        getNewFormData,
        toFormData,
        entityName,
    } = props;
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<GridRowId | null>(null);
    const [formData, setFormData] = useState<TFormData | null>(null);

    const handleAddClick = () => {
        setEditingItemId(null);
        setFormData(getNewFormData());
        setIsFormOpen(true);
    };

    const handleEditClick = (id: GridRowId) => {
        const itemToEdit = data.find((row) => row.id === id);
        if (itemToEdit) {
            setEditingItemId(id);
            setFormData(toFormData(itemToEdit));
            setIsFormOpen(true);
        }
    };

    const handleDeleteClick = (id: GridRowId) => {
        setEditingItemId(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleFormSubmit = async () => {
        if (!formData) return;

        try {
            if (editingItemId !== null) {
                await onUpdate(editingItemId, formData);
            } else {
                await onAdd(formData);
            }
            setIsFormOpen(false);
            setFormData(null);
            setEditingItemId(null);
        } catch (error) {
            console.error("Failed to save:", error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (editingItemId !== null) {
            try {
                await onDelete(editingItemId);
                setIsDeleteConfirmOpen(false);
                setEditingItemId(null);
            } catch (error) {
                console.error("Failed to delete:", error);
            }
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setFormData(null);
        setEditingItemId(null);
    };

    const handleDeleteClose = () => {
        setIsDeleteConfirmOpen(false);
        setEditingItemId(null);
    };

    const actionColumn: GridColDef = {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({id}) => [
            <GridActionsCellItem
                icon={<Edit/>}
                label="Edit"
                onClick={() => handleEditClick(id)}
                key="edit"
            />,
            <GridActionsCellItem
                icon={<Delete/>}
                label="Delete"
                onClick={() => handleDeleteClick(id)}
                key="delete"
            />,
        ],
    };

    return (
        <Box sx={{height: "80vh", width: "100%"}}>
            <Button
                startIcon={<Add/>}
                variant="contained"
                onClick={handleAddClick}
                sx={{mb: 2}}
            >
                Add {entityName}
            </Button>
            <DataGrid
                rows={data}
                columns={[...columns, actionColumn]}
                rowCount={rowCount}
                loading={loading}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={onPaginationModelChange}
                checkboxSelection
                disableRowSelectionOnClick
            />

            <Dialog open={isFormOpen} onClose={handleFormClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingItemId === null ? `Add ${entityName}` : `Edit ${entityName}`}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{pt: 1}}>
                        {formData && formFields(formData, setFormData)}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFormClose}>Cancel</Button>
                    <Button onClick={handleFormSubmit} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onClose={handleDeleteClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this {entityName}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
