import {Add, Delete, Edit} from "@mui/icons-material";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridColDef, GridPaginationModel, GridRowId} from "@mui/x-data-grid";
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

export default function CrudGrid<T extends { id: GridRowId }, TFormData>(props: CrudGridProps<T, TFormData>) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingId, setEditingId] = useState<GridRowId | null>(null);
    const [formData, setFormData] = useState<TFormData | null>(null);

    const handleAdd = () => {
        setEditingId(null);
        setFormData(props.getNewFormData());
        setIsFormOpen(true);
    };

    const handleEdit = (id: GridRowId) => {
        const item = props.data.find((row) => row.id === id);
        if (item) {
            setEditingId(id);
            setFormData(props.toFormData(item));
            setIsFormOpen(true);
        }
    };

    const handleDelete = (id: GridRowId) => {
        setEditingId(id);
        setIsDeleteOpen(true);
    };

    const handleSave = async () => {
        if (!formData) return;
        if (editingId) {
            await props.onUpdate(editingId, formData);
        } else {
            await props.onAdd(formData);
        }
        setIsFormOpen(false);
        setFormData(null);
        setEditingId(null);
    };

    const handleConfirmDelete = async () => {
        if (editingId) {
            await props.onDelete(editingId);
            setIsDeleteOpen(false);
            setEditingId(null);
        }
    };

    const actionColumn: GridColDef = {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        getActions: ({id}) => [
            <GridActionsCellItem icon={<Edit/>} label="Edit" onClick={() => handleEdit(id)} key="edit"/>,
            <GridActionsCellItem icon={<Delete/>} label="Delete" onClick={() => handleDelete(id)} key="delete"/>,
        ],
    };

    return (
        <Box sx={{height: "80vh", width: "100%"}}>
            <Button startIcon={<Add/>} variant="contained" onClick={handleAdd} sx={{mb: 2}}>
                Add {props.entityName}
            </Button>
            <DataGrid
                rows={props.data}
                columns={[...props.columns, actionColumn]}
                rowCount={props.rowCount}
                loading={props.loading}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                paginationModel={props.paginationModel}
                paginationMode="server"
                onPaginationModelChange={props.onPaginationModelChange}
                checkboxSelection
                disableRowSelectionOnClick
            />

            <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? `Edit ${props.entityName}` : `Add ${props.entityName}`}</DialogTitle>
                <DialogContent>
                    {formData && props.formFields(formData, setFormData)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <DialogTitle>Delete {props.entityName}</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this {props.entityName}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
