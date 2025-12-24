import {Alert, Snackbar} from '@mui/material';
import {useError} from '../context/ErrorContext';

export default function ErrorNotification() {
    const {error, clearError} = useError();

    return (
        <Snackbar open={!!error} autoHideDuration={2000} onClose={clearError}
                  anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
            <Alert onClose={clearError} severity="error" variant="filled">
                {error}
            </Alert>
        </Snackbar>
    );
}

