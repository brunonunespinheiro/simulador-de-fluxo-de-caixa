const transactions = [];

// Função para adicionar transação e atualizar o gráfico e lista
document.getElementById('transaction-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const transaction = {
    type: document.getElementById('type').value,
    name: document.getElementById('name').value,
    value: parseFloat(document.getElementById('value').value),
    date: document.getElementById('date').value
  };

  transactions.push(transaction);

  updateChart();
  updateTransactionList();
  clearForm(); // Limpa os campos após adicionar a transação
});

// Função para limpar o formulário
function clearForm() {
  document.getElementById('type').value = 'Receita';
  document.getElementById('name').value = '';
  document.getElementById('value').value = '';
  document.getElementById('date').value = '';
}

// Função para atualizar o gráfico
function updateChart() {
  const totalReceitas = transactions.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.value, 0);
  const totalDespesas = transactions.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.value, 0);

  const ctx = document.getElementById('chart').getContext('2d');
  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        label: 'R$',
        data: [totalReceitas, totalDespesas],
        backgroundColor: ['#4CAF50', '#FF5733']
      }]
    }
  });
}

// Função para atualizar a lista de transações
function updateTransactionList() {
  const transactionList = document.getElementById('transaction-list');
  transactionList.innerHTML = transactions.map(t => `
    <tr>
      <td>${t.type}</td>
      <td>${t.name}</td>
      <td>R$ ${t.value.toFixed(2)}</td>
      <td>${new Date(t.date).toLocaleDateString('pt-BR')}</td>
    </tr>
  `).join('');
}

// Função para gerar PDF
document.getElementById('generate-pdf').addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.text('Relatório de Fluxo de Caixa', 10, 10);
  pdf.text(`Receitas: R$${transactions.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.value, 0).toFixed(2)}`, 10, 20);
  pdf.text(`Despesas: R$${transactions.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.value, 0).toFixed(2)}`, 10, 30);

  let startY = 40;
  transactions.forEach((t, index) => {
    const entry = `${t.type}: ${t.name} - R$${t.value.toFixed(2)} em ${new Date(t.date).toLocaleDateString('pt-BR')}`;
    pdf.text(entry, 10, startY + (index * 10));
  });

  pdf.addImage(document.getElementById('chart').toDataURL('image/png'), 'PNG', 10, startY + transactions.length * 10 + 20, 180, 60);
  
  pdf.save('fluxo_caixa.pdf');
});
