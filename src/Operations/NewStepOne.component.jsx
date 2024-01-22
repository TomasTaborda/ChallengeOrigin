import React, { useState, useEffect, useCallback } from "react";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from "@mui/material";
import './StepOne.css';
const NewStepOne = ({
  tarjeta,
  onClose,
  setStep,
}) => {
  const [open, setOpen] = useState(false);
  const nextStep = useCallback(() => {
    setStep(1);
  }, [setStep]);

  return (
    <div>
      <Box p={2} sx={{ width: 600 }}>
        <div className="divButton">
            <Button
            id="modal1-next-button"
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            >
            Balance
            </Button>
            <Button
            id="modal1-next-button"
            variant="contained"
            color="primary"
            onClick={() => nextStep()}>
            Retiro
            </Button>
        </div>
      </Box>
      <Box
        p={2}
        sx={{ minWidth: 400, display: "flex", justifyContent: "flex-end" }}>
        <Button id="modal1-cancel-button" onClick={onClose}>
          Cancelar
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Balance</DialogTitle>
        <DialogContent>
            <DialogContentText>Número de tarjeta: {tarjeta[0].numeroTarjeta}</DialogContentText>
            <DialogContentText>Fecha de vencimiento: {tarjeta[0].fechaVencimiento} </DialogContentText>
            <DialogContentText>Saldo: ${tarjeta[0].balance}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
            Atrás
            </Button>
        </DialogActions>
       </Dialog>
    </div>
  );
};

export default NewStepOne;
