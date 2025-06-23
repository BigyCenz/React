import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, CardActions,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert 
} from '@mui/material';
import { getClienti, creaCliente, eliminaCliente, aggiornaCliente } from '../api/clienti';

const Clienti = () => {

  const [clienti, setClienti] = useState([]);
  const [nuovoCliente, setNuovoCliente] = useState({ nome: '' });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [clienteDaEliminare, setClienteDaEliminare] = useState(null);
  const [messaggio, setMessaggio] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarTipo, setSnackbarTipo] = useState('success'); // "success" o "error"
  const [clienteDaModificare, setClienteDaModificare] = useState(null);
  const [nomeModificato, setNomeModificato] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    caricaClienti();
  }, []);

  const caricaClienti = async () => {
    const data = await getClienti();
    setClienti(data);
  };

const handleCreaCliente = async () => {
  if (nuovoCliente.nome.trim()) {
    try {
      const res = await creaCliente(nuovoCliente); // ← ottieni messaggio backend
      setMessaggio(res.message); // ← imposta messaggio da mostrare
      setOpenSnackbar(true);
      setNuovoCliente({ nome: '' });
      caricaClienti();
    } catch (err) {
      setMessaggio('Errore durante la creazione del cliente.');
      setOpenSnackbar(true);
    }
  }
};

  const handleSalvaModifica = async () => {
    try {
      await aggiornaCliente(clienteDaModificare.CLI_COD, { nome: nomeModificato });
      setMessaggio('Cliente aggiornato con successo');
      setSnackbarTipo('success');
      caricaClienti();
    } catch (err) {
      setMessaggio('Errore durante la modifica');
      setSnackbarTipo('error');
    } finally {
      setOpenSnackbar(true);
      setOpenEditDialog(false);
      setClienteDaModificare(null);
    }
  };


  const handleApriElimina = (cliente) => {
    setClienteDaEliminare(cliente);
    setOpenConfirm(true);
  };

  const handleConfermaElimina = async () => {
    if (clienteDaEliminare) {
      try {
        const res = await eliminaCliente(clienteDaEliminare.CLI_COD);
        setMessaggio(res.message || 'Cliente eliminato');
        setSnackbarTipo('success');
        caricaClienti();
      } catch (err) {
        setMessaggio('Errore durante l\'eliminazione');
        setSnackbarTipo('error');
      } finally {
        setOpenSnackbar(true);
        setOpenConfirm(false);
        setClienteDaEliminare(null);
      }
    }
  };

  return (
    <Box>
      {/* Sezione in alto: form nuovo cliente */}
      <Box sx={{ mb: 4, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom>Nuovo Cliente</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Nome cliente"
            value={nuovoCliente.nome}
            onChange={(e) => setNuovoCliente({ ...nuovoCliente, nome: e.target.value })}
          />
          <Button variant="contained" onClick={handleCreaCliente}>Crea</Button>
        </Box>
      </Box>

      {/* Sezione in basso: clienti */}
      <Grid container spacing={2}>
        {clienti.map(cli => (
          <Grid item xs={12} sm={6} md={4} key={cli.CLI_COD}>
            <Card>
              <CardContent>
                <Typography variant="h6">{cli.CLI_NAME}</Typography>
                <Typography variant="body2">ID: {cli.CLI_COD}</Typography>
              </CardContent>
              <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                        setClienteDaModificare(cli);
                        setNomeModificato(cli.CLI_NAME);
                        setOpenEditDialog(true);
                    }}
                    >
                    Modifica
                </Button>
                <Button size="small" color="error" onClick={() => handleApriElimina(cli)}>Elimina</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          Vuoi davvero eliminare il cliente "{clienteDaEliminare?.CLI_NAME}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Annulla</Button>
          <Button color="error" onClick={handleConfermaElimina}>Elimina</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
        <Alert severity={snackbarTipo} onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
            {messaggio}
        </Alert>
    </Snackbar>
    <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Modifica Cliente</DialogTitle>
            <DialogContent>
                <TextField
                label="Nome cliente"
                fullWidth
                value={nomeModificato}
                onChange={(e) => setNomeModificato(e.target.value)}
                sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenEditDialog(false)}>Annulla</Button>
                <Button onClick={handleSalvaModifica} variant="contained">Salva</Button>
            </DialogActions>
    </Dialog>
    </Box>
    
  );
};

export default Clienti;
