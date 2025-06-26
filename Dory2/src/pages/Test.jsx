import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MyDialog() {
  const [open, setOpen] = useState(true); // lo apriamo subito per demo
  const [rows, setRows] = useState([
    { id: 1, type: "Tipo A", status: "Attivo" },
    { id: 2, type: "Tipo B", status: "Inattivo" }
  ]);
  const [newType, setNewType] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const handleAdd = () => {
    if (newType && newStatus) {
      setRows(prev => [...prev, { id: Date.now(), type: newType, status: newStatus }]);
      setNewType("");
      setNewStatus("");
    }
  };

  const handleDelete = (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Gestione Elementi</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDelete(row.id)}>
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
            <InputLabel>Tipo</InputLabel>
            <Select
              value={newType}
              label="Tipo"
              onChange={(e) => setNewType(e.target.value)}
            >
              <MenuItem value=""><em>-- Seleziona --</em></MenuItem>
              <MenuItem value="Tipo A">Tipo A</MenuItem>
              <MenuItem value="Tipo B">Tipo B</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value=""><em>-- Seleziona --</em></MenuItem>
              <MenuItem value="Attivo">Attivo</MenuItem>
              <MenuItem value="Inattivo">Inattivo</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleAdd}>Aggiungi</Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => console.log(rows)} variant="contained">Salva</Button>
        <Button onClick={() => setOpen(false)}>Chiudi</Button>
      </DialogActions>
    </Dialog>
  );
}
