import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Grid, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  Card, CardContent, CardActions, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';
import { Edit, Delete, Visibility, Settings } from '@mui/icons-material';
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getPannelli, createPannello, updatePannello, deletePannello,
  getAssociazioni, saveAssociazioni,
  getPorteDisponibili
} from '../api/pannelli';

import { getClienti } from '../api/clienti';
import { getLocationByCliente, getMacchine } from '../api/macchine';

export default function Pannelli() {

  const [clienti, setClienti] = useState([]);
  const [location, setLocation] = useState([]);
  const [pannelli, setPannelli] = useState([]);

  const [selectedCliente, setSelectedCliente] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const [formNuovo, setFormNuovo] = useState({ nome: '', cliente: '', location: '' });
  const [formEdit, setFormEdit] = useState({ nome: '', cliente: '', location: '' });

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingPannello, setEditingPannello] = useState(null);
  const [configPannello, setConfigPannello] = useState(null);

  const [associazioniCorrenti, setAssociazioniCorrenti] = useState([]);
  const [nuoveAssociazioni, setNuoveAssociazioni] = useState([]);

  {/* */}
  const [dialogConfigOpen, setDialogConfigOpen] = useState(false);
  const [selectedMacchinaAssociazioni, setSelectedMacchinaAssociazioni] = useState('');
  const [selectedPortaAssociazioni, setSelectedPortaAssociazioni] = useState('');
  const [selectedSensoreAssociazioni, setSelectedSensoreAssociazioni] = useState('');
  const [associazioni, setAssociazioni] = useState([]);

  const [macchine, setMacchine] = useState([]);
  const [porte, setPorte] = useState([]);
  const [sensori, setSensori] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadClienti();
    fetchPannelli();
  }, []);



  useEffect(() => {
    if (formNuovo.cliente) getLocationByCliente(formNuovo.cliente).then(setLocation);
    else setLocation([]);
  }, [formNuovo.cliente]);

  useEffect(() => {
    if (formEdit.cliente) getLocationByCliente(formEdit.cliente).then(setLocation);
  }, [formEdit.cliente]);

  const loadClienti = async () => {
    const data = await getClienti();
    setClienti(data);
  };

  const fetchPannelli = async () => {
    const data = await getPannelli({ cliente: selectedCliente, location: selectedLocation });
    setPannelli(data);
  };


  const handleOpenConfig = async (p) => {

    setConfigPannello(p);

    const dati = await getAssociazioni(p.PAN_COD);

    const porte = await getPorteDisponibili(p.PAN_COD);
    const macchine = await getMacchine({pannello: p.PAN_COD});

    setAssociazioniCorrenti(dati);

    setMacchine(macchine);
    setPorte(porte);
    setSensori([]); // Inizialmente vuoto, si popolerà in base alla macchina selezionata

    setNuoveAssociazioni([]);
    setDialogConfigOpen(true);

  };


  const handleCreate = async () => {
    const { nome, cliente, location } = formNuovo;
    if (!nome || !cliente || !location) {
      setSnackbar({ open: true, message: 'Compila tutti i campi', severity: 'warning' });
      return;
    }
    await createPannello({ nome, cliente, location });
    setSnackbar({ open: true, message: 'Pannello creato', severity: 'success' });
    setFormNuovo({ nome: '', cliente: '', location: '' });
    fetchPannelli();
  };

  const handleEditOpen = (p) => {
    setEditingPannello(p);
    setFormEdit({ nome: p.PAN_NAME, cliente: p.CLI_COD, location: p.PAN_LOC });
    setDialogOpen(true);
  };

  const handleEditSave = async () => {
    const { nome, cliente, location } = formEdit;
    if (!nome || !cliente || !location) {
      setSnackbar({ open: true, message: 'Compila tutti i campi', severity: 'warning' });
      return;
    }
    await updatePannello(editingPannello.PAN_COD, { nome, cliente, location });
    setSnackbar({ open: true, message: 'Pannello aggiornato', severity: 'success' });
    fetchPannelli();
    setDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confermi eliminazione?')) return;
    await deletePannello(id);
    setSnackbar({ open: true, message: 'Pannello eliminato', severity: 'success' });
    fetchPannelli();
  };



    const handleDeleteAssociazione = (id) => {
        setAssociazioni(prev => prev.filter(r => r.id !== id));
    };

    const handleAddAssociazione = () => {
        if (selectedMacchinaAssociazioni && selectedPortaAssociazioni && selectedSensoreAssociazioni) {
            setSelectedMacchinaAssociazioni('');
            setSelectedPortaAssociazioni('');
            setSelectedSensoreAssociazioni('');
        }
    };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" gap={3} flexWrap="wrap" alignItems="center" mb={3}>
        <TextField select label="Cliente" value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)} size="small">
          <MenuItem value="all">Tutti i clienti</MenuItem>
          {clienti.map(c => (
            <MenuItem key={c.CLI_COD} value={c.CLI_COD}>{c.CLI_NAME}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Location" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} size="small">
          <MenuItem value="all">Tutte le location</MenuItem>
          {location.map(l => (
            <MenuItem key={l.LOC_COD} value={l.LOC_COD}>{l.LOC_NAME}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={fetchPannelli}>Cerca</Button>
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
        <TextField label="Nome pannello" value={formNuovo.nome} onChange={(e) => setFormNuovo({ ...formNuovo, nome: e.target.value })} size="small" />
        <TextField select label="Cliente" value={formNuovo.cliente} onChange={(e) => setFormNuovo({ ...formNuovo, cliente: e.target.value })} size="small">
          <MenuItem value=""><em>&lt;Seleziona&gt;</em></MenuItem>
          {clienti.map(c => (
            <MenuItem key={c.CLI_COD} value={c.CLI_COD}>{c.CLI_NAME}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Location" value={formNuovo.location} onChange={(e) => setFormNuovo({ ...formNuovo, location: e.target.value })} size="small">
          <MenuItem value=""><em>&lt;Seleziona&gt;</em></MenuItem>
          {location.map(l => (
            <MenuItem key={l.LOC_COD} value={l.LOC_COD}>{l.LOC_NAME}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleCreate}>Crea</Button>
      </Box>

      <Grid container spacing={2}>
        {pannelli.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.PAN_COD}>
            <Card>
              <CardContent>
                <Typography variant="h6">{p.PAN_NAME}</Typography>
                <Typography>Codice: {p.PAN_COD}</Typography>
                <Typography>Location: {p.LOC_NAME}</Typography>
                <Typography>Cliente: {p.CLI_NAME}</Typography>
                <Typography>Stato: {p.PAN_RX ? 'Attiva' : 'Disattiva'}</Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEditOpen(p)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(p.PAN_COD)} color="error"><Delete /></IconButton>
                <IconButton><Visibility /></IconButton>
                <IconButton onClick={() => handleOpenConfig(p)}><Settings /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Modifica Pannello</DialogTitle>
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
            {location.map(l => (
              <MenuItem key={l.LOC_COD} value={l.LOC_COD}>{l.LOC_NAME}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annulla</Button>
          <Button onClick={handleEditSave} variant="contained">Salva</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>


      <Dialog open={dialogConfigOpen} onClose={() => setDialogConfigOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Configurazione Pannello</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: "auto" }}>
        <Table stickyHeader>
            <TableHead>
            <TableRow>
                <TableCell>Porta</TableCell>
                <TableCell>Macchina</TableCell>
                <TableCell>Sensore</TableCell>
                <TableCell align="center">Azioni</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {associazioniCorrenti.map((a, i) => (
                <TableRow key={i}>
                <TableCell>{a.PORT_COD}</TableCell>
                <TableCell>{a.MAC_NAME}</TableCell>
                <TableCell>{a.CATS_NOME}</TableCell>
                <TableCell align="center">
                    <IconButton
                    color="error"
                    onClick={() =>  setAssociazioniCorrenti(prev => prev.filter((_, idx) => idx !== i))}
                    >
                    <DeleteIcon />
                    </IconButton>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>

        {/* Sezione aggiunta */}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>     

          <FormControl fullWidth>

            <InputLabel>Porta</InputLabel>
            <Select value={selectedPortaAssociazioni} label="Porta" onChange={(e) => setSelectedPortaAssociazioni(e.target.value)}>      
            {porte.map(p => (
              <MenuItem key={p.PORT_COD} value={p.PORT_COD}>{p.PORT_COD}</MenuItem>
            ))}   
            </Select>

            <InputLabel>Macchina</InputLabel>
            <Select value={selectedMacchinaAssociazioni} label="Macchina" onChange={(e) => setSelectedMacchinaAssociazioni(e.target.value)}>      
            {macchine.map(m => (
              <MenuItem key={m.MAC_COD} value={m.MAC_COD}>{m.MAC_NAME}</MenuItem>
            ))}   
            </Select>

            <InputLabel>Sensore</InputLabel>
            <Select value={selectedSensoreAssociazioni} label="Sensore" onChange={(e) => setSelectedSensoreAssociazioni(e.target.value)}>      
            {sensori.map(s => (
              <MenuItem key={s.CATS_NOME} value={s.CATS_NOME}>{s.CATS_NOME}</MenuItem>
            ))}   
            </Select>

          </FormControl>

          <Button variant="contained" onClick={handleAddAssociazione}>+</Button>

        </div>

        <Typography variant="subtitle1" mt={3}>Aggiungi nuova</Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
        <TextField select label="Porta" size="small">
            {/* Opzioni da porte_esp32 filtrate (placeholder) */}
            <MenuItem value="1">GPIO 32</MenuItem>
        </TextField>
        <TextField select label="Macchina" size="small">
            {/* Macchine del cliente del pannello */}
            <MenuItem value="1">Frullatore #1</MenuItem>
        </TextField>
        <TextField select label="Sensore" size="small">
            {/* Sensori disponibili per categoria */}
            <MenuItem value="1">Temperatura (°C)</MenuItem>
        </TextField>
        <Button variant="contained">+</Button>
        </Box>

        <Button variant="contained" sx={{ mt: 3 }} onClick={async () => {
        const response = await saveAssociazioni(configPannello.PAN_COD, {
            associazioni: [...associazioniCorrenti, ...nuoveAssociazioni]
        });
        setSnackbar({ open: true, message: 'Associazioni salvate', severity: 'success' });
        setDialogConfigOpen(false);
        }}>Salva</Button>
    </DialogContent>
    </Dialog>

    </Box>
  );
}
