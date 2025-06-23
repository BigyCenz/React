import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, CardActions,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { getLocations, creaLocation, eliminaLocation, aggiornaLocation } from '../api/location';
import { getClienti } from '../api/clienti';


const Location = () => {
  const [locations, setLocations] = useState([]);
  const [nuovaLocation, setNuovaLocation] = useState({ nome: '', cliente_id: '' });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [locationDaEliminare, setLocationDaEliminare] = useState(null);
  const [locationDaModificare, setLocationDaModificare] = useState(null);
  const [nomeModificato, setNomeModificato] = useState('');
  const [messaggio, setMessaggio] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarTipo, setSnackbarTipo] = useState('success');

  const [clienti, setClienti] = useState([]);


useEffect(() => {
  caricaLocations();
  caricaClienti();
}, []);

  const caricaLocations = async () => {
    const data = await getLocations();
    setLocations(data);
  };

  const caricaClienti = async () => {
    const data = await getClienti();
    setClienti(data);
  };

  const handleCreaLocation = async () => {
    const { nome, cliente_id } = nuovaLocation;
    if (nome.trim() && cliente_id) {
      try {
        const res = await creaLocation({ nome, cliente_id });
        setMessaggio(res.message);
        setSnackbarTipo('success');
        caricaLocations();
        setNuovaLocation({ nome: '', cliente_id: '' });
      } catch {
        setMessaggio('Errore durante la creazione della location');
        setSnackbarTipo('error');
      } finally {
        setOpenSnackbar(true);
      }
    }
  };
  

  const handleApriElimina = (loc) => {
    setLocationDaEliminare(loc);
    setOpenConfirm(true);
  };

  const handleConfermaElimina = async () => {
    try {
      await eliminaLocation(locationDaEliminare.LOC_COD);
      setMessaggio('Location eliminata');
      setSnackbarTipo('success');
      caricaLocations();
    } catch {
      setMessaggio('Errore durante l\'eliminazione');
      setSnackbarTipo('error');
    } finally {
      setOpenSnackbar(true);
      setOpenConfirm(false);
      setLocationDaEliminare(null);
    }
  };

  const handleSalvaModifica = async () => {
    try {
      await aggiornaLocation(locationDaModificare.LOC_COD, { nome: nomeModificato });
      setMessaggio('Location aggiornata');
      setSnackbarTipo('success');
      caricaLocations();
    } catch {
      setMessaggio('Errore durante la modifica');
      setSnackbarTipo('error');
    } finally {
      setOpenSnackbar(true);
      setOpenEditDialog(false);
      setLocationDaModificare(null);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom>Nuova Location</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Nome location"
            value={nuovaLocation.nome}
            onChange={(e) => setNuovaLocation({ ...nuovaLocation, nome: e.target.value })}
          />
          <Button variant="contained" onClick={handleCreaLocation}>Crea</Button>
        </Box>
        <FormControl sx={{ minWidth: 200}}>
        <InputLabel>Cliente</InputLabel>
            <Select
                value={nuovaLocation.cliente_id}
                label="Cliente"
                onChange={(e) => setNuovaLocation({ ...nuovaLocation, cliente_id: e.target.value })}
            >
                {clienti.map(cli => (
                <MenuItem key={cli.CLI_COD} value={cli.CLI_COD}>
                    {cli.CLI_NAME}
                </MenuItem>
                ))}
            </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {locations.map(loc => (
          <Grid item xs={12} sm={6} md={4} key={loc.LOC_COD}>
            <Card>
              <CardContent>
                <Typography variant="h6">{loc.LOC_NAME}</Typography>
                <Typography variant="body2">ID: {loc.LOC_COD}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => {
                  setLocationDaModificare(loc);
                  setNomeModificato(loc.LOC_NAME);
                  setOpenEditDialog(true);
                }}>Modifica</Button>
                <Button size="small" color="error" onClick={() => handleApriElimina(loc)}>Elimina</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          Vuoi davvero eliminare la location "{locationDaEliminare?.LOC_NAME}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Annulla</Button>
          <Button color="error" onClick={handleConfermaElimina}>Elimina</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Modifica Location</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome location"
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
    </Box>
  );
};

export default Location;
