// src/pages/Categorie.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, CardActions,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Snackbar, Alert
} from '@mui/material';
import { Add, Edit, Delete, Save, Close } from '@mui/icons-material';
import apiClient from '../api/auth';

export default function Categorie() {
  const [categorie, setCategorie] = useState([]);
  const [nuovaCategoria, setNuovaCategoria] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
  const [sensoriEsistenti, setSensoriEsistenti] = useState([]);
  const [originaliSensori, setOriginaliSensori] = useState([]);
  const [editingSensori, setEditingSensori] = useState({});
  const [nomeCategoriaModificato, setNomeCategoriaModificato] = useState('');
  const [nuovoSensore, setNuovoSensore] = useState({ nome: '', unita: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCategorie();
  }, []);

  const fetchCategorie = async () => {
    try {
      const res = await apiClient.get('/categorie');
      setCategorie(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Errore nel caricamento', severity: 'error' });
    }
  };

  const handleAggiungiCategoria = async () => {
    if (!nuovaCategoria.trim()) return;
    try {
      await apiClient.post('/categorie', { nome: nuovaCategoria });
      setSnackbar({ open: true, message: 'Categoria creata', severity: 'success' });
      setNuovaCategoria('');
      fetchCategorie();
    } catch {
      setSnackbar({ open: true, message: 'Errore creazione', severity: 'error' });
    }
  };

  const handleApriModifica = async (cat) => {
    setCategoriaSelezionata(cat);
    setNomeCategoriaModificato(cat.CAT_NAME);
    try {
      const res = await apiClient.get(`/categorie/${cat.CAT_COD}/sensori`);
      setSensoriEsistenti(res.data);
      setOriginaliSensori(JSON.parse(JSON.stringify(res.data)));
    } catch {
      setSensoriEsistenti([]);
      setOriginaliSensori([]);
    }
    setEditingSensori({});
    setNuovoSensore({ nome: '', unita: '' });
    setOpenDialog(true);
  };

  const handleSalvaModifica = async () => {
    try {
      await apiClient.put(`/categorie/${categoriaSelezionata.CAT_COD}`, { nome: nomeCategoriaModificato });

      const nuovi = sensoriEsistenti.filter(s => s.nuovo && s.CATS_NOME.trim() && s.CATS_UNIT.trim());
      if (nuovi.length > 0) {
        await apiClient.post(`/categorie/${categoriaSelezionata.CAT_COD}/sensori`, nuovi.map(s => ({ nome: s.CATS_NOME, unita: s.CATS_UNIT })));
      }

      const modificati = sensoriEsistenti.filter(s => !s.nuovo && JSON.stringify(s) !== JSON.stringify(originaliSensori.find(o => o.CATS_SNS === s.CATS_SNS)));
      for (const sensore of modificati) {
        await apiClient.put(`/categorie/${categoriaSelezionata.CAT_COD}/sensori/${sensore.CATS_SNS}`, {
          nome: sensore.CATS_NOME,
          unita: sensore.CATS_UNIT
        });
      }

      const eliminati = originaliSensori.filter(o => !sensoriEsistenti.find(s => s.CATS_SNS === o.CATS_SNS));
      for (const sensore of eliminati) {
        await apiClient.delete(`/categorie/${categoriaSelezionata.CAT_COD}/sensori/${sensore.CATS_SNS}`);
      }

      setSnackbar({ open: true, message: 'Categoria aggiornata', severity: 'success' });
      fetchCategorie();
    } catch {
      setSnackbar({ open: true, message: 'Errore salvataggio', severity: 'error' });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleEliminaSensore = (sns) => {
    setSensoriEsistenti(prev => prev.filter(s => s.CATS_SNS !== sns));
  };


  const toggleEdit = (sns) => {
    setEditingSensori({ ...editingSensori, [sns]: !editingSensori[sns] });
  };

  const handleChangeSensoreEsistente = (sns, campo, valore) => {
    setSensoriEsistenti(prev =>
      prev.map(s => s.CATS_SNS === sns ? { ...s, [campo]: valore } : s)
    );
  };

  const handleAnnullaModifica = (sns) => {
    const originale = originaliSensori.find(s => s.CATS_SNS === sns);
    setSensoriEsistenti(prev =>
      prev.map(s => s.CATS_SNS === sns ? { ...originale } : s)
    );
    toggleEdit(sns);
  };


  const handleEliminaCategoria = async (cod) => {
    try {
      await apiClient.delete(`/categorie/${cod}`);
      setSnackbar({ open: true, message: 'Categoria eliminata', severity: 'success' });
      fetchCategorie();
    } catch {
      setSnackbar({ open: true, message: 'Errore eliminazione categoria', severity: 'error' });
    }
  };

  const handleAggiungiNuovoSensore = () => {
    if (!nuovoSensore.nome.trim() || !nuovoSensore.unita.trim()) return;
    setSensoriEsistenti([...sensoriEsistenti, {
      CATS_SNS: Date.now(),
      CATS_NOME: nuovoSensore.nome,
      CATS_UNIT: nuovoSensore.unita,
      nuovo: true
    }]);
    setNuovoSensore({ nome: '', unita: '' });
  };

  const handleChiudiDialog = () => {
    setOpenDialog(false);
    setCategoriaSelezionata(null);
    setSensoriEsistenti([]);
    setOriginaliSensori([]);
    setEditingSensori({});
    setNomeCategoriaModificato('');
    setNuovoSensore({ nome: '', unita: '' });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Nuova Categoria</Typography>
      <Box display="flex" gap={2} mb={4}>
        <TextField label="Nome categoria" value={nuovaCategoria} onChange={(e) => setNuovaCategoria(e.target.value)} />
        <Button variant="contained" onClick={handleAggiungiCategoria}>Crea</Button>
      </Box>

      <Grid container spacing={2}>
        {categorie.map(cat => (
          <Grid item xs={12} sm={6} md={4} key={cat.CAT_COD}>
            <Card>
              <CardContent>
                <Typography variant="h6">{cat.CAT_NAME}</Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleApriModifica(cat)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleEliminaCategoria(cat.CAT_COD)}><Delete /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleChiudiDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Modifica Categoria</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome categoria"
            value={nomeCategoriaModificato}
            onChange={(e) => setNomeCategoriaModificato(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle1">Sensori associati:</Typography>
          {sensoriEsistenti.map(s => (
            <Box key={s.CATS_SNS} display="flex" gap={1} mb={1} alignItems="center">
              {editingSensori[s.CATS_SNS] ? (
                <>
                  <TextField value={s.CATS_NOME} onChange={(e) => handleChangeSensoreEsistente(s.CATS_SNS, 'CATS_NOME', e.target.value)} label="Nome" fullWidth />
                  <TextField value={s.CATS_UNIT} onChange={(e) => handleChangeSensoreEsistente(s.CATS_SNS, 'CATS_UNIT', e.target.value)} label="Unità" fullWidth />
                  <IconButton onClick={() => toggleEdit(s.CATS_SNS)}><Save /></IconButton>
                  <IconButton onClick={() => handleAnnullaModifica(s.CATS_SNS)}><Close /></IconButton>
                </>
              ) : (
                <>
                  <TextField value={s.CATS_NOME} label="Nome" fullWidth disabled />
                  <TextField value={s.CATS_UNIT} label="Unità" fullWidth disabled />
                  <IconButton onClick={() => toggleEdit(s.CATS_SNS)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleEliminaSensore(s.CATS_SNS)}><Delete /></IconButton>
                </>
              )}
            </Box>
          ))}

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Aggiungi nuovo sensore:</Typography>
          <Box display="flex" gap={1} mb={2}>
            <TextField label="Nome" value={nuovoSensore.nome} onChange={(e) => setNuovoSensore({ ...nuovoSensore, nome: e.target.value })} fullWidth />
            <TextField label="Unità" value={nuovoSensore.unita} onChange={(e) => setNuovoSensore({ ...nuovoSensore, unita: e.target.value })} fullWidth />
            <IconButton onClick={handleAggiungiNuovoSensore}><Add /></IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChiudiDialog}>Annulla</Button>
          <Button variant="contained" onClick={handleSalvaModifica}>Salva</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
