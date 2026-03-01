import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";

const form = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");
const dataInput = document.getElementById("data");
const nomeInput = document.getElementById("nome");
const cpfInput = document.getElementById("cpf");
const telefoneInput = document.getElementById("telefone");
const btnCadastrar = document.getElementById("btnCadastrar");

const TEMPO_MENSAGEM = 3000;

function limparMensagem() {
  mensagem.classList.add("hidden");
  mensagem.innerText = "";
}

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.innerText = texto;
  mensagem.classList.remove("hidden");

  if (tipo === "sucesso") {
    mensagem.style.background = "#4CAF50";
    mensagem.style.color = "#fff";
  } else {
    mensagem.style.background = "#e53935";
    mensagem.style.color = "#fff";
  }

  setTimeout(() => {
    mensagem.classList.add("hidden");
  }, TEMPO_MENSAGEM);
}

dataInput.addEventListener("input", () => {
  let v = dataInput.value.replace(/\D/g, "");

  if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
  if (v.length >= 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);

  dataInput.value = v;
});

function validarFormulario() {
  if (nomeInput.value.trim().length < 3) {
    mostrarMensagem("Nome inválido", "erro");
    return false;
  }

  if (cpfInput.value.trim().length !== 11) {
    mostrarMensagem("CPF inválido", "erro");
    return false;
  }

  if (telefoneInput.value.trim().length < 10) {
    mostrarMensagem("Telefone inválido", "erro");
    return false;
  }

  if (dataInput.value.trim().length !== 10) {
    mostrarMensagem("Data inválida", "erro");
    return false;
  }

  return true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  limparMensagem();

  if (!validarFormulario()) return;

  btnCadastrar.disabled = true;
  btnCadastrar.innerText = "Salvando...";

  const dados = {
    nome: nomeInput.value.trim(),
    cpf: cpfInput.value.trim(),
    telefone: telefoneInput.value.trim(),
    dataNascimento: dataInput.value.trim(),
    criadoEm: serverTimestamp()
  };

  try {
    const ref = collection(db, "cadastros");
    await addDoc(ref, dados);
    mostrarMensagem("Cadastro realizado com sucesso!", "sucesso");
    form.reset();
  } catch (erro) {
    console.error("Erro:", erro);
    mostrarMensagem("Erro ao cadastrar.", "erro");
  }

  btnCadastrar.disabled = false;
  btnCadastrar.innerText = "Cadastrar";
});

cpfInput.addEventListener("input", () => {
  cpfInput.value = cpfInput.value.replace(/\D/g, "");
});

telefoneInput.addEventListener("input", () => {
  telefoneInput.value = telefoneInput.value.replace(/\D/g, "");
});

console.log("Sistema carregado com sucesso");