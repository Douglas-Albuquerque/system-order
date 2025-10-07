let comanda = [];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Adiciona um novo item à comanda
function adicionarItem(nome, preco) {
  // Verifica se já existe o mesmo item (mesmo nome e observação vazia)
  const itemExistente = comanda.find(item => item.nome === nome && item.observacao === '');
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    comanda.push({ nome, preco, observacao: '', quantidade: 1 });
  }
  atualizarComanda();
}

// Aumenta a quantidade de um item
function aumentarQuantidade(index) {
  comanda[index].quantidade += 1;
  atualizarComanda();
}

// Diminui ou remove o item
function diminuirQuantidade(index) {
  comanda[index].quantidade -= 1;
  if (comanda[index].quantidade <= 0) {
    comanda.splice(index, 1);
  }
  atualizarComanda();
}

// Alterna o campo de observação
function toggleObservacao(index) {
  const obsDiv = document.getElementById(`obs-div-${index}`);
  if (!obsDiv) return;

  const isVisible = obsDiv.style.display === 'block';
  obsDiv.style.display = isVisible ? 'none' : 'block';

  if (!isVisible) {
    setTimeout(() => {
      const input = document.getElementById(`obs-input-${index}`);
      if (input) input.focus();
    }, 100);
  }
}

// Atualiza visualmente a lista de itens
function atualizarComanda() {
  const lista = document.getElementById('lista-itens');
  const totalEl = document.getElementById('total');

  lista.innerHTML = '';
  let total = 0;

  comanda.forEach((item, index) => {
    const valorItem = item.preco * item.quantidade;
    total += valorItem;

    const li = document.createElement('li');
    li.className = 'list-group-item p-2';

    // Linha principal: nome, preço total do item, e botões de quantidade
    const headerDiv = document.createElement('div');
    headerDiv.className = 'd-flex justify-content-between align-items-center mb-1';

    const nomeDiv = document.createElement('div');
    nomeDiv.innerHTML = `<strong>${item.nome}</strong>`;

    const acoesDiv = document.createElement('div');
    acoesDiv.className = 'd-flex align-items-center gap-2';

    // Botão de diminuir
    const btnMenos = document.createElement('button');
    btnMenos.className = 'btn btn-sm btn-outline-danger';
    btnMenos.textContent = '–';
    btnMenos.onclick = () => diminuirQuantidade(index);

    // Quantidade
    const qtdSpan = document.createElement('span');
    qtdSpan.className = 'mx-2 fw-bold';
    qtdSpan.textContent = item.quantidade;

    // Botão de aumentar
    const btnMais = document.createElement('button');
    btnMais.className = 'btn btn-sm btn-outline-success';
    btnMais.textContent = '+';
    btnMais.onclick = () => aumentarQuantidade(index);

    // Botão de observação
    const btnObs = document.createElement('button');
    btnObs.className = 'btn btn-sm btn-outline-secondary';
    btnObs.innerHTML = '✏️';
    btnObs.onclick = () => toggleObservacao(index);

    acoesDiv.appendChild(btnMenos);
    acoesDiv.appendChild(qtdSpan);
    acoesDiv.appendChild(btnMais);
    acoesDiv.appendChild(btnObs);

    headerDiv.appendChild(nomeDiv);
    headerDiv.appendChild(acoesDiv);

    // Preço do item (com quantidade)
    const precoDiv = document.createElement('div');
    precoDiv.className = 'text-muted small mt-1';
    precoDiv.textContent = `${formatarMoeda(item.preco)} × ${item.quantidade} = ${formatarMoeda(valorItem)}`;

    // Campo de observação (inicialmente escondido)
    const obsDiv = document.createElement('div');
    obsDiv.id = `obs-div-${index}`;
    obsDiv.className = 'mt-2';
    obsDiv.style.display = item.observacao ? 'block' : 'none';
    obsDiv.innerHTML = `
      <textarea 
        id="obs-input-${index}" 
        class="form-control form-control-sm" 
        placeholder="Ex: sem tomate, mal passado..." 
        rows="2"
      >${item.observacao}</textarea>
    `;

    // Adiciona evento de digitação sem recriar o DOM
    const textarea = obsDiv.querySelector('textarea');
    textarea.addEventListener('input', function () {
      comanda[index].observacao = this.value;
    });

    li.appendChild(headerDiv);
    li.appendChild(precoDiv);
    li.appendChild(obsDiv);
    lista.appendChild(li);
  });

  totalEl.textContent = formatarMoeda(total);
}

// Limpa toda a comanda
function limparComanda() {
  comanda = [];
  atualizarComanda();
}

// Fecha a conta
function fecharConta() {
  const inputMesa = document.getElementById('input-mesa');
  const numeroMesa = inputMesa.value.trim();

  if (!numeroMesa || isNaN(numeroMesa) || Number(numeroMesa) <= 0) {
    alert('Por favor, informe um número de mesa válido.');
    inputMesa.focus();
    return;
  }

  const subtotal = comanda.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  const gorjeta = subtotal * 0.10;
  const totalComGorjeta = subtotal + gorjeta;

  document.getElementById('mesa-fechamento').textContent = numeroMesa;
  document.getElementById('subtotal-fechamento').textContent = formatarMoeda(subtotal);
  document.getElementById('gorjeta-fechamento').textContent = formatarMoeda(gorjeta);
  document.getElementById('total-com-gorjeta').textContent = formatarMoeda(totalComGorjeta);

  document.getElementById('tela-comanda').classList.add('d-none');
  document.getElementById('tela-fechamento').classList.remove('d-none');
}

// Volta para nova comanda
function voltarComanda() {
  comanda = [];
  document.getElementById('tela-fechamento').classList.add('d-none');
  document.getElementById('tela-comanda').classList.remove('d-none');
  atualizarComanda();
}