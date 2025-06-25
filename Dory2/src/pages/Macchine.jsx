import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem,
  Card, CardContent, CardActions, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  getMacchine,
  createMacchina,
  updateMacchina,
  deleteMacchina,
  getClienti,
  getCategorie,
  getLocationByCliente
} from '../api/macchine';

export default function Macchine() {
    
  const [clienti, setClienti] = useState([]);
  const [location, setLocation] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [macchine, setMacchine] = useState([]);

  const [selectedCliente, setSelectedCliente] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategoria, setSelectedCategoria] = useState('all');

  const [formNuova, setFormNuova] = useState({ nome: '', cliente: '', location: '', categoria: '' });
  const [editingMachine, setEditingMachine] = useState(null);
  const [formEdit, setFormEdit] = useState({ nome: '', cliente: '', location: '', categoria: '' });
  const [editLocations, setEditLocations] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getClienti().then(setClienti);
    getCategorie().then(setCategorie);
    fetchMacchine();
  }, []);

  useEffect(() => {
    if (selectedCliente !== 'all') {
      getLocationByCliente(selectedCliente).then(setLocation);
    } else {
      setLocation([]);
      setSelectedLocation('all');
    }
  }, [selectedCliente]);

  useEffect(() => {
    if (formNuova.cliente) {
      getLocationByCliente(formNuova.cliente).then(setLocation);
    } else {
      setLocation([]);
    }
  }, [formNuova.cliente]);

  useEffect(() => {
    if (formEdit.cliente) {
      getLocationByCliente(formEdit.cliente).then(setEditLocations);
    } else {
      setEditLocations([]);
    }
  }, [formEdit.cliente]);

  const fetchMacchine = async () => {
    try {
      const data = await getMacchine({
        cliente: selectedCliente,
        location: selectedLocation,
        categoria: selectedCategoria
      });
      setMacchine(data);
    } catch {
      setSnackbar({ open: true, message: 'Errore caricamento macchine', severity: 'error' });
    }
  };

  const handleCreate = async () => {
    const { nome, cliente, location, categoria } = formNuova;
    if (!nome || !cliente || !location || !categoria) {
      setSnackbar({ open: true, message: 'Compila tutti i campi', severity: 'warning' });
      return;
    }
    try {
      await createMacchina(formNuova);
      setFormNuova({ nome: '', cliente: '', location: '', categoria: '' });
      fetchMacchine();
      setSnackbar({ open: true, message: 'Macchina creata', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Errore creazione', severity: 'error' });
    }
  };

  const handleEditOpen = (macchina) => {
    setEditingMachine(macchina);
    setFormEdit({
      nome: macchina.MAC_NAME,
      cliente: macchina.MAC_CLI,
      location: macchina.MAC_LOC,
      categoria: macchina.MAC_CAT
    });
    getLocationByCliente(macchina.MAC_CLI).then(setEditLocations);
    setDialogOpen(true);
  };

  const handleEditSave = async () => {
    const { nome, cliente, location, categoria } = formEdit;
    if (!nome || !cliente || !location || !categoria) {
      setSnackbar({ open: true, message: 'Compila tutti i campi', severity: 'warning' });
      return;
    }
    try {
      await updateMacchina(editingMachine.MAC_COD, formEdit);
      setSnackbar({ open: true, message: 'Macchina aggiornata', severity: 'success' });
      fetchMacchine();
      setDialogOpen(false);
    } catch {
      setSnackbar({ open: true, message: 'Errore aggiornamento', severity: 'error' });
    }
  };

  const handleDelete = async (macCod) => {
    if (!window.confirm('Confermi eliminazione?')) return;
    try {
      await deleteMacchina(macCod);
      setSnackbar({ open: true, message: 'Macchina eliminata', severity: 'success' });
      fetchMacchine();
    } catch {
      setSnackbar({ open: true, message: 'Errore eliminazione', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" gap={4} flexWrap="wrap">
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h6">Filtri:</Typography>
          <TextField select label="Cliente" size="small" value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="all">Tutti i clienti</MenuItem>
            {clienti.map(c => (
              <MenuItem key={c.CLI_COD} value={c.CLI_COD}>{c.CLI_NAME}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Location" size="small" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="all">Tutte le location</MenuItem>
            {location.map(l => (
              <MenuItem key={l.LOC_COD} value={l.LOC_COD}>{l.LOC_NAME}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Categoria" size="small" value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="all">Tutte le categorie</MenuItem>
            {categorie.map(c => (
              <MenuItem key={c.CAT_COD} value={c.CAT_COD}>{c.CAT_NAME}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={fetchMacchine}>Cerca</Button>
        </Box>

        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h6">Nuova:</Typography>
          <TextField size="small" label="Nome" value={formNuova.nome} onChange={(e) => setFormNuova({ ...formNuova, nome: e.target.value })} />
          <TextField select size="small" label="Cliente" value={formNuova.cliente} onChange={(e) => setFormNuova({ ...formNuova, cliente: e.target.value })} sx={{ minWidth: 160 }}>
            <MenuItem value=""><em>&lt;Seleziona&gt;</em></MenuItem>
            {clienti.map(c => (
              <MenuItem key={c.CLI_COD} value={c.CLI_COD}>{c.CLI_NAME}</MenuItem>
            ))}
          </TextField>
          <TextField select size="small" label="Location" value={formNuova.location} onChange={(e) => setFormNuova({ ...formNuova, location: e.target.value })} sx={{ minWidth: 160 }}>
            <MenuItem value=""><em>&lt;Seleziona&gt;</em></MenuItem>
            {location.map(l => (
              <MenuItem key={l.LOC_COD} value={l.LOC_COD}>{l.LOC_NAME}</MenuItem>
            ))}
          </TextField>
          <TextField select size="small" label="Categoria" value={formNuova.categoria} onChange={(e) => setFormNuova({ ...formNuova, categoria: e.target.value })} sx={{ minWidth: 160 }}>
            <MenuItem value=""><em>&lt;Seleziona&gt;</em></MenuItem>
            {categorie.map(c => (
              <MenuItem key={c.CAT_COD} value={c.CAT_COD}>{c.CAT_NAME}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={handleCreate}>Crea</Button>
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Risultati</Typography>
        {macchine.map(mac => (
          <Card key={mac.MAC_COD} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{mac.MAC_NAME}</Typography>
              <Typography>Cliente: {mac.CLI_NAME}</Typography>
              <Typography>Location: {mac.LOC_NAME}</Typography>
              <Typography>Categoria: {mac.CAT_NAME}</Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleEditOpen(mac)}><Edit /></IconButton>
              <IconButton onClick={() => handleDelete(mac.MAC_COD)} color="error"><Delete /></IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Modifica Macchina</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nome" value={formEdit.nome} onChange={(e) => setFormEdit({ ...formEdit, nome: e.target.value })} />
          <TextField select label="Cliente" value={formEdit.cliente} onChange={(e) => setFormEdit({ ...formEdit, cliente: e.target.value })}>
            <MenuItem value=""><em>&lt;Seleziona&gt;</em></MenuItem>
            {clienti.map(c => (
              <MenuItem key={c.CLI_COD} value={c.CLI_COD}>{c.CLI_NAME}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Location" value={formEdit.location} onChange={(e) => setFormEdit({ ...formEdit, location: e.target.value })}>
            <MenuItem value=""><em>&lt;Seleziona&gt;</em></MenuItem>
            {editLocations.map(l => (
              <MenuItem key={l.LOC_COD} value={l.LOC_COD}>{l.LOC_NAME}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Categoria" value={formEdit.categoria} onChange={(e) => setFormEdit({ ...formEdit, categoria: e.target.value })}>
            <MenuItem value=""><em>&lt;Seleziona&gt;</em></MenuItem>
            {categorie.map(c => (
              <MenuItem key={c.CAT_COD} value={c.CAT_COD}>{c.CAT_NAME}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annulla</Button>
          <Button variant="contained" onClick={handleEditSave}>Salva</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
