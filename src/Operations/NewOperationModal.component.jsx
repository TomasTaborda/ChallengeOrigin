import React, { useState, useCallback } from "react";
import { Dialog, IconButton, Box, Tooltip, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import NewStepOne from "./NewStepOne.component";
import NewStepTwo from "./NewStepTwo.component";

const NewOperationModal = ({
  open,
  onClose,
  tarjeta,
  setTarjeta,
}) => {
  const [step, setStep] = useState(0);

  const close = useCallback(() => {
    setStep(0);
    onClose();
  }, [onClose, setStep]);

  const backStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const onSave = useCallback(() => {
    close();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="md">
      <div>
        {step === 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}>
            <Typography variant="h6" component="div">
              Operaciones
            </Typography>
          </Box>
        )}
        {step > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <IconButton
                onClick={() => backStep()}
                sx={{
                  marginRight: "30%",
                }}>
                <ArrowBackIcon />
              </IconButton>
            <Typography variant="h6" component="div">
              Retiro
            </Typography>
          </Box>
        )}
        {step === 0 && (
          <NewStepOne
            tarjeta={tarjeta}
            onClose={close}
            setStep={setStep}
          />
        )}
        {step === 1 && (
          <NewStepTwo
            tarjeta={tarjeta}
            setTarjeta={setTarjeta}
            onClose={close}
            setStep={(step) => {
              setStep(step);
            }}
          />
        )}
      </div>
    </Dialog>
  );
};

export default NewOperationModal;
