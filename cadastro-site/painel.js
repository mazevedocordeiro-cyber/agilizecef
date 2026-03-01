import { auth, db } from "./firebase.js";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const lista = document.getElementById("lista");
const busca = document.getElementById("buscaNome");
const notificacao = document.getElementById("notificacao");

let registros = [];

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "admin.html";
});

async function carregar() {
  const snapshot = await getDocs(collection(db, "cadastros"));

  registros = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  // 🔥 ORDENA POR DATA (mais recente primeiro)
  registros.sort((a, b) => {
    if (!a.criadoEm || !b.criadoEm) return 0;
    return b.criadoEm.seconds - a.criadoEm.seconds;
  });

  renderizar();
}

function renderizar(filtro = "") {
  lista.innerHTML = "";

  registros
    .filter(r => r.nome.toLowerCase().includes(filtro.toLowerCase()))
    .forEach(r => {

      const dataFormatada = r.criadoEm
        ? r.criadoEm.toDate().toLocaleDateString()
        : "";

      const texto = `
Nome: ${r.nome}
Telefone: ${r.telefone}
CPF: ${r.cpf}
Nascimento: ${r.dataNascimento}
Data do cadastro: ${dataFormatada}
`;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="acoes-esquerda">
          <button class="btn delete">🗑</button>
        </div>

        <div class="info">
          <div class="bloco"><strong>Nome:</strong> ${r.nome}</div>
          <div class="bloco"><strong>Telefone:</strong> ${r.telefone}</div>
          <div class="bloco"><strong>CPF:</strong> ${r.cpf}</div>
          <div class="bloco"><strong>Nascimento:</strong> ${r.dataNascimento}</div>
          <div class="bloco"><strong>Cadastro:</strong> ${dataFormatada}</div>
        </div>

        <div class="acoes-direita">
          <button class="btn copy">📋</button>
          <button class="btn print">🖨</button>
          <button class="btn pdf">📄</button>
        </div>
      `;

      const btnDelete = card.querySelector(".delete");
      const btnCopy = card.querySelector(".copy");
      const btnPrint = card.querySelector(".print");
      const btnPdf = card.querySelector(".pdf");

      btnDelete.onclick = () => excluirCadastro(r.id);
      btnCopy.onclick = () => {
        navigator.clipboard.writeText(texto);
        mostrarNotificacao("Copiado com sucesso!");
      };
      btnPrint.onclick = () => imprimir(texto);
      btnPdf.onclick = () => gerarPDF(texto, r.nome);

      lista.appendChild(card);
    });
}

busca.addEventListener("input", (e) => {
  renderizar(e.target.value);
});

async function excluirCadastro(id) {
  try {
    await deleteDoc(doc(db, "cadastros", id));
    mostrarNotificacao("Cadastro excluído com sucesso!");
    carregar();
  } catch (erro) {
    mostrarNotificacao("Erro ao excluir.", true);
  }
}

function mostrarNotificacao(texto, erro = false) {
  notificacao.innerText = texto;
  notificacao.style.background = erro ? "#e53935" : "#4CAF50";
  notificacao.classList.add("ativo");

  setTimeout(() => {
    notificacao.classList.remove("ativo");
  }, 3000);
}

function imprimir(texto) {
  const w = window.open("", "", "width=800,height=600");
  w.document.write(`
    <html>
      <body style="font-family:Arial;padding:40px;">
        <h1 style="text-align:center;">Cadastro do proponente</h1>
        <p style="font-size:18px;">${texto.replaceAll("\n","<br>")}</p>
        <footer style="position:fixed;bottom:20px;width:100%;text-align:center;">
          www.agilizecef.com
        </footer>
      </body>
    </html>
  `);
  w.document.close();
  w.print();
}

function gerarPDF(texto, nome) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Cadastro do proponente", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(texto, 20, 40);
  doc.text("www.agilizecef.com", 105, 285, { align: "center" });
  doc.save(nome + ".pdf");
}

window.sair = () => {
  signOut(auth);
  window.location.href = "admin.html";
};

carregar();