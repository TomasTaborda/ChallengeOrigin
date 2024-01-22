import { Button, TextField, Typography, Modal, Box, Snackbar, Alert } from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
//import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import NewOperationModal from "./Operations/NewOperationModal.component";
import NumericKeypad from "./shared/NumericPad.component";

const LoginContainer = styled("div")(() => ({
  display: "flex",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "right",
  width: "100vw",
  height: "100vh",
  color: "#4E6B9D",
}));

const ContainerSection = styled("div")(() => ({
  flex: 0.5,
  marginTop: "auto",
  marginBottom: "auto",
}));

const ContainerForm = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  paddingLeft: "18%",
  paddingRight: "18%",
  justifyContent: "center",
}));

const App = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [pin, setPin] = useState("");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [newModalOpen, setNewModalOpen] = useState(false);

  const backendUrl = 'http://localhost:8080';

  const fontColor = {
    style: { color: "#4e6b9d" },
  };
  const handleKeyPress = (number) => {
    const newCardNumber = cardNumber + number;
    if (newCardNumber.length <= 16) {
      setCardNumber(newCardNumber);
    }
  };
  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})(?=\d)/g, "$1-");
  };
  const handleSend = () => {
    axios.get(`${backendUrl}/api/Tarjeta/GetTarjetas`)
      .then(response => {
        const filteredData = response.data?.data?.filter(card => card.numeroTarjeta.toString() === cardNumber);
        if (filteredData.length > 0 && filteredData[0].activa == true) {
          setFilteredData(filteredData);
          setIsMatchFound(true);
        } else {
          setAlertSeverity("error");
          setAlertMessage("No se encontró una tarjeta con ese número o la tarjeta se encuentra bloqueada");
          setOpen(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const sendCardNumber = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    validate();
  }, [cardNumber]);

  useEffect(() => {
    setErrors({ start: "" });
  }, []);

  const validate = () => {
    let errors = {};

    if (!cardNumber || cardNumber === "") {
      errors.cardNumer = "Debe ingresar un numero de tarjeta";
    }

    return setErrors(errors);
  };

  const validateModal = () => {
    if (pin === "") {
      setAlertSeverity("error");
      setAlertMessage("Debe ingresar un pin");
      setOpen(true);
      return false;
    }
    return true;
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setOpen(false);
  };

  const handlePin = () => {
    const tarjeta = filteredData[0];
    if (tarjeta.pin != pin) {
      setFailedAttempts(failedAttempts + 1);
      setAlertSeverity("error");
      setAlertMessage("Pin incorrecto");
      setOpen(true);
      if (failedAttempts > 3) {
        axios.put(`${backendUrl}/api/Tarjeta/DesactivarTarjeta/${tarjeta.id}`)
          .then(response => {
            setAlertMessage("Su tarjeta ha sido bloqueada");
            setOpen(true);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    } else {
      setAlertSeverity("success");
      setAlertMessage("Pin ingresado correctamente");
      setOpen(true);
      setNewModalOpen(true);
    }
  };

  const NewOperation = React.memo(NewOperationModal);

  return (
    <LoginContainer>
      <div className="emptyContainer"></div>
      <ContainerSection>
        <ContainerForm className="loginForm">
          <Typography
            variant="h1"
            className="name"
            sx={{
              textAlign: "center",
              fontFamily: "Helvetica",
              fontWeight: "700!important",
            }}>
            Challenge
          </Typography>
          <TextField
            variant="standard"
            required
            label="Tarjeta"
            margin="normal"
            type="text"
            value={formatCardNumber(cardNumber)}
            onChange={(e) => {
              const value = e.target.value.replace(/-/g, '');
              if (value.length <= 16) {
                setCardNumber(value);
              }
            }}
            sx={{
              label: {
                color: "#4E6B9D!important",
                borderColor: "#4E6B9D!important",
                fontWeight: "400",
              },
            }}
            inputProps={{
              ...fontColor,
              maxLength: 19,
            }}
            errors={errors.cardNumer}
            helperText={errors.cardNumer}
            FormHelperTextProps={{
              style: { color: "#F85149" },
            }}
            onKeyDown={(e) => sendCardNumber(e)}
          />
          <Button
            color="primary"
            size="medium"
            fullwidth="true"
            label="Enviar"
            onClick={handleSend}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5%",
              backgroundColor: "#4E6B9D!important",
              width: "100%",
              padding: "10px",
              borderRadius: "15px",
              fontWeight: "700",
              color: "white!important",
            }}
          >
            Aceptar
          </Button>
          <Button
            color="primary"
            size="medium"
            fullwidth="true"
            label="Limpiar"
            onClick={() => {
              setCardNumber("");
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1%",
              backgroundColor: "#4E6B9D!important",
              width: "100%",
              padding: "10px",
              borderRadius: "15px",
              fontWeight: "700",
              color: "white!important",
            }}
          >
            Limpiar
          </Button>
          <Modal
            open={isMatchFound}
            onClose={() => setIsMatchFound(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "rgba(255, 255, 255, 0.7)",
                boxShadow: 24,
                p: 4,
                borderRadius: "15px",
              }}>
              <TextField
                variant="standard"
                id="pin"
                required
                fullWidth
                type="text"
                margin="normal"
                name="pin"
                value={pin}
                autoFocus
                inputProps={{
                  ...fontColor,
                  maxLength: 4,
                }}
                sx={{
                  label: {
                    color: "red!important",
                    borderColor: "red!important",
                    fontWeight: "400",
                  },
                }}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setPin(e.target.value);
                }}
              />
              <Button
                color="primary"
                size="medium"
                id="clear-pin"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5%",
                  backgroundColor: "#4E6B9D!important",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "15px",
                  fontWeight: "700",
                  color: "white!important",
                }}
                onClick={() => {
                  setPin("");
                }}>
                Limpiar
              </Button>
              <Button
                color="primary"
                size="medium"
                id="send-pin"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5%",
                  backgroundColor: "#4E6B9D!important",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "15px",
                  fontWeight: "700",
                  color: "white!important",
                }}
                onClick={() => {
                  if (validateModal()) handlePin();
                }}>
                Enviar
              </Button>
              <Button
                color="primary"
                size="medium"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5%",
                  backgroundColor: "transparent!important",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "15px",
                  fontWeight: "700",
                  color: "#4E6B9D!important",
                }}
                onClick={() => setIsMatchFound(false)}>
                Cancelar
              </Button>
            </Box>
          </Modal>
        </ContainerForm>
      </ContainerSection>
      <NumericKeypad onKeyPress={handleKeyPress} />
      <NewOperation
              open={newModalOpen}
              onClose={() => setNewModalOpen(false)}
              tarjeta={filteredData}
              setTarjeta={setFilteredData}
            />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </LoginContainer>
  );
};
export default App;
