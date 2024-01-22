/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import NumericKeypadModal from "../shared/NumericPadModal.component";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText
} from "@mui/material";

const NewStepTwo = ({
  tarjeta,
  setTarjeta,
  onClose,
  setStep,
}) => {

  const nextStep = useCallback(() => {
    setStep(2);
  }, []);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = React.useState('');
  const [saldo, setSaldo] = useState(0);
  const [modalData, setModalData] = useState({});
  const backendUrl = 'http://localhost:8080';

  useEffect(() => {
    getTarjetas();
  }, []);
  const handleKeyPress = (number) => {
    if (value.length <= 20) {
        setValue(value + number);
      }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setOpen(false);
  };

  const getTarjetas = () => {
    axios.get(`${backendUrl}/api/Tarjeta/GetTarjetas/${tarjeta[0].id}`)
      .then(response => {
        setSaldo(response.data.data.balance);
        setModalData(response.data.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleRetiro = () => {
    if (value <= saldo && value > 0) {
        axios.put(`${backendUrl}/api/Tarjeta/RetiroSaldo/${tarjeta[0].id}/${value}`)
            .then(response => {
                setAlertSeverity("success");
                setAlertMessage("Retiro Exitoso");
                setOpen(true);
                getTarjetas();
                setOpenModal(true)
            })
            .catch(error => {
                console.error('Error:', error);
            });
        const movimiento = {
            tarjetaId: tarjeta[0].id,
            monto: Number(value),
            fecha: new Date().toISOString(),
            tarjeta: {
                numeroTarjeta: tarjeta[0].numeroTarjeta,
                pin: tarjeta[0].pin,
                activa: tarjeta[0].activa,
                balance: tarjeta[0].balance,
                fechaVencimiento: tarjeta[0].fechaVencimiento,
                movimientos: [],
            }
            };
        axios.post(`${backendUrl}/api/Movimiento/AddMovimiento`, movimiento)
            .then(response => {
                setAlertSeverity("success");
                setAlertMessage("Retiro Exitoso");
                setOpen(true);
                getTarjetas();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        setAlertSeverity("error");
        setAlertMessage("Saldo Insuficiente");
        setOpen(true);
    }
  };

  return (
    <div>
      <Box p={2} sx={{ width: 600, height: 300 }}>
        <TextField
          label="Ingrese el monto a retirar"
          variant="standard"
          fullWidth
          value={value}
          sx={{ width: "80%", marginBottom: 2, marginLeft: "10%" }}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ maxLength: 20 }}
        />
        <Grid container columns={3} sx={{ marginLeft: "10%", width: "90%" }}>
          <Grid item xs={1}>
            <Typography variant="subtitle1">Saldo: {saldo}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box
        p={2}
        sx={{ minWidth: 400, display: "flex", justifyContent: "flex-end" }}>
        <Button id="modal2-cancel-button" onClick={onClose}>
          Salir
        </Button>
        <Button
          id="modal2-next-button"
          variant="contained"
          color="primary"
          onClick={() => handleRetiro()}>
          Confirmar
        </Button>
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Comprobante de Retiro</DialogTitle>
        <DialogContent>
            <DialogContentText>Número de tarjeta: {tarjeta[0].numeroTarjeta}</DialogContentText>
            <DialogContentText>Fecha de vencimiento: {tarjeta[0].fechaVencimiento} </DialogContentText>
            <DialogContentText>Saldo: ${modalData.balance}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="primary">
            Atrás
            </Button>
        </DialogActions>
       </Dialog>
      <NumericKeypadModal onKeyPress={handleKeyPress} />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NewStepTwo;
