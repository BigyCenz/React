import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, CardActions,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import apiClient from '../api/auth';

export default function Categorie() {
  const [categorie, setCategorie] = useState([]);
  const [categorieDisponibili, setCategorieDisponibili] = useState([]);
  const [form, setForm] = useState({ nome: '', unita: '', codiceCategoria: '' });
  const [editDialog, setEditDialog] = useState(false);
  const [catToEdit, setCatToEdit] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCategorie();
    fetchCategorieDisponibili();
  }, []);

  const fetchCategorie = async () => {
    try {
      const res = await apiClient.get('/categorie');
      setCategorie(res.data);
    } catch {
      showSnackbar('Errore durante il caricamento delle categorie', 'error');
    }
  };

  const fetchCategorieDisponibili = async () => {
    try {
      const res = await apiClient.get('/clienti/categorie'); // supponendo che ci sia un endpoint
      setCategorieDisponibili(res.data);
    } catch {
      showSnackbar('Errore durante il caricamento categorie base', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCrea = async () => {
    const { nome, unita, codiceCategoria } = form;
    if (!nome || !unita || !codiceCategoria)
      return showSnackbar('Compila tutti i campi', 'warning');
    try {
      const res = await apiClient.post('/categorie', {
        nome,
        unita,
        codiceCategoria
      });
      showSnackbar(res.message, 'success');
      fetchCategorie();
      setForm({ nome: '', unita: '', codiceCategoria: '' });
    } catch {
      showSnackbar('Errore nella creazione categoria', 'error');
    }
  };

  const handleElimina = async (cod, sns) => {
    if (!window.confirm('Confermare eliminazione sensore?')) return;
    try {
      const res = await apiClient.delete(`/categorie/${cod}/${sns}`);
      showSnackbar(res.message, 'success');
      fetchCategorie();
    } catch {
      showSnackbar('Errore nella cancellazione', 'error');
    }
  };

  const handleApriModifica = (cat) => {
    setCatToEdit(cat);
    setForm({ nome: cat.CATS_NOME, unita: cat.CATS_UNIT, codiceCategoria: cat.CATS_COD });
    setEditDialog(true);
  };

  const handleModifica = async () => {
    try {
      const res = await apiClient.put(`/categorie/${catToEdit.CATS_COD}/${catToEdit.CATS_SNS}`, form);
      showSnackbar(res.message, 'success');
      fetchCategorie();
    } catch {
      showSnackbar('Errore durante la modifica', 'error');
    } finally {
      setEditDialog(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Nuovo Sensore</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField label="Nome Sensore" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <TextField label="Unità di misura" value={form.unita} onChange={(e) => setForm({ ...form, unita: e.target.value })} />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Categoria</InputLabel>
          <Select value={form.codiceCategoria} onChange={(e) => setForm({ ...form, codiceCategoria: e.target.value })} label="Categoria">
            {categorieDisponibili.map(cat => (
              <MenuItem key={cat.CAT_COD} value={cat.CAT_COD}>{cat.CAT_COD}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleCrea}>Crea</Button>
      </Box>

      <Grid container spacing={2}>
        {categorie.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={`${cat.CATS_COD}-${cat.CATS_SNS}`}>
            <Card>
              <CardContent>
                <Typography variant="h6">{cat.CATS_NOME}</Typography>
                <Typography variant="body2">Categoria: {cat.CATS_COD}</Typography>
                <Typography variant="body2">Codice sensore: {cat.CATS_SNS}</Typography>
                <Typography variant="body2">Unità: {cat.CATS_UNIT}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleApriModifica(cat)}>Modifica</Button>
                <Button size="small" color="error" onClick={() => handleElimina(cat.CATS_COD, cat.CATS_SNS)}>Elimina</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Modifica Sensore</DialogTitle>
        <DialogContent>
          <TextField label="Nome" fullWidth sx={{ mt: 1 }} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <TextField label="Unità" fullWidth sx={{ mt: 2 }} value={form.unita} onChange={(e) => setForm({ ...form, unita: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Annulla</Button>
          <Button variant="contained" onClick={handleModifica}>Salva</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
